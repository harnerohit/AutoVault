from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# CORS: Allow the Vercel frontend in production, all origins in dev
frontend_url = os.environ.get('FRONTEND_URL', '*')
CORS(app, origins=[frontend_url] if frontend_url != '*' else '*')

# Load the trained model and feature columns
MODEL_PATH = 'models/car_price_model.pkl'

def load_saved_artifacts():
    with open(MODEL_PATH, 'rb') as f:
        artifacts = pickle.load(f)
    return artifacts['model'], artifacts['columns']

try:
    model, model_columns = load_saved_artifacts()
    print("✅ Model loaded successfully!")
    print(f"   Features: {model_columns}")
except FileNotFoundError:
    model, model_columns = None, None
    print("⚠️  Warning: Model file not found. Please run src/train.py first.")

def predict_price(input_data):
    """
    Predict price for new input data.
    """
    if model is None:
        return "Model not loaded."
        
    # Extract condition and remove from input_data for model prediction
    condition = input_data.get('Condition', 'Pristine')
    # Filter out keys not in model_columns for the model prediction
    model_input = {k: v for k, v in input_data.items() if k in model_columns}
    
    # Convert input dict to DataFrame
    df = pd.DataFrame([model_input])
    
    # Ensure all model columns are present (handle missing ones with 0)
    for col in model_columns:
        if col not in df.columns:
            df[col] = 0
            
    # Reorder columns to match training set
    df = df[model_columns]
    
    # Raw prediction from model
    base_prediction = model.predict(df)[0]
    
    # Apply condition multiplier
    multipliers = {
        'Pristine': 1.0,
        'Good': 0.92,
        'Fair': 0.82,
        'Poor': 0.65
    }
    
    multiplier = multipliers.get(condition, 1.0)
    final_prediction = base_prediction * multiplier
    
    # Cap prediction at Present_Price if available
    present_price = input_data.get('Present_Price')
    if present_price is not None and final_prediction > present_price:
        final_prediction = present_price
        
    return round(float(final_prediction), 2)

@app.route('/')
def home():
    return jsonify({
        'status': 'online',
        'service': 'AutoVault Car Price Prediction API',
        'version': '2.5',
        'endpoints': {
            'POST /predict': 'Predict car selling price (Supports Condition)',
            'GET /api/stats': 'Get model and dataset statistics',
            'GET /api/cars': 'Get car listings with fallback',
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not trained yet. Run src/train.py first.'}), 400
        
    try:
        data = request.get_json()
        prediction = predict_price(data)
        return jsonify({
            'prediction': prediction,
            'unit': 'Lakhs',
            'model': 'RandomForestRegressor',
            'version': '2.5',
            'condition_applied': data.get('Condition', 'Pristine')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    """Return model and dataset statistics."""
    stats_data = {
        'model_type': 'RandomForestRegressor',
        'model_version': '2.5',
        'model_loaded': model is not None,
        'features': model_columns if model_columns else [],
        'feature_count': len(model_columns) if model_columns else 0,
    }
    
    # Try to load dataset stats
    data_path = 'data/car_data.csv'
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        stats_data['dataset'] = {
            'rows': len(df),
            'columns': list(df.columns),
            'price_range': {
                'min': float(df['Selling_Price'].min()),
                'max': float(df['Selling_Price'].max()),
                'mean': round(float(df['Selling_Price'].mean()), 2),
            },
            'year_range': {
                'min': int(df['Year'].min()),
                'max': int(df['Year'].max()),
            },
            'fuel_types': df['Fuel_Type'].value_counts().to_dict(),
            'brands_count': df['Car_Name'].nunique(),
        }
    
    return jsonify(stats_data)

@app.route('/api/cars', methods=['GET'])
def get_cars():
    """Get paginated car listings with fallback to basic dataset."""
    cardekho_path = 'cardekho_dataset.csv'
    basic_path = 'data/car_data.csv'
    
    path = cardekho_path if os.path.exists(cardekho_path) else basic_path
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    brand = request.args.get('brand', None)
    fuel = request.args.get('fuel', None)
    sort = request.args.get('sort', 'price_desc')
    
    try:
        if os.path.exists(path):
            df = pd.read_csv(path)
            
            # Basic filtering and mapping
            if path == basic_path:
                df['brand'] = df['Car_Name'].apply(lambda x: x.split(' ')[0])
                df['selling_price'] = df['Selling_Price']
            
            # Apply filters
            if brand:
                brand_col = 'brand' if 'brand' in df.columns else 'Car_Name'
                df = df[df[brand_col].str.lower().str.contains(brand.lower())]
            if fuel:
                fuel_col = 'fuel_type' if 'fuel_type' in df.columns else 'Fuel_Type'
                df = df[df[fuel_col].str.lower() == fuel.lower()]
            
            # Sort
            sort_col = 'selling_price' if 'selling_price' in df.columns else 'Selling_Price'
            if sort == 'price_asc':
                df = df.sort_values(sort_col, ascending=True)
            elif sort == 'price_desc':
                df = df.sort_values(sort_col, ascending=False)
            
            total = len(df)
            start = (page - 1) * per_page
            end = start + per_page
            df_page = df.iloc[start:end]
            
            cars = []
            for _, row in df_page.iterrows():
                cars.append({
                    'car_name': row.get('car_name', row.get('Car_Name', '')),
                    'brand': row.get('brand', row.get('Car_Name', '').split(' ')[0]),
                    'year': int(row.get('year', row.get('Year', 2020))),
                    'km_driven': int(row.get('km_driven', row.get('Kms_Driven', 0))),
                    'fuel_type': row.get('fuel_type', row.get('Fuel_Type', '')),
                    'transmission': row.get('transmission_type', row.get('Transmission', '')),
                    'selling_price_lakhs': float(row.get('Selling_Price', row.get('selling_price', 0))),
                })
            
            return jsonify({
                'cars': cars,
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page,
                'dataset_used': 'basic' if path == basic_path else 'cardekho'
            })
        else:
            return jsonify({'error': 'Dataset not found', 'cars': []}), 404
            
    except Exception as e:
        return jsonify({'error': str(e), 'cars': []}), 500

if __name__ == "__main__":
    app.run()

