# Used Car Price Prediction Project

This project predicts the selling price of second-hand cars using a Random Forest Regressor.

## Project Structure
- `data/`: Contains the CarDekho dataset.
- `src/`:
    - `train.py`: Data preprocessing, EDA, model training, and evaluation.
    - `app.py`: Flask API for serving predictions.
- `models/`: Stores the trained model (`.pkl`) and EDA visualizations (`.png`).
- `requirements.txt`: Python dependencies.

## Setup Instructions

1. **Create a Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the Model:**
   ```bash
   python3 src/train.py
   ```
   This will:
   - Load and preprocess the data.
   - Generate EDA plots in the `models/` folder.
   - Tune and train the Random Forest model.
   - Save the model to `models/car_price_model.pkl`.

4. **Run the Flask API:**
   ```bash
   python3 src/app.py
   ```
   The API will start on `http://127.0.0.1:5001`.

## How to Predict
Send a POST request to `/predict` with JSON data:
```json
{
    "Present_Price": 5.59,
    "Kms_Driven": 27000,
    "Owner": 0,
    "car_age": 10,
    "Fuel_Type_Diesel": 0,
    "Fuel_Type_Petrol": 1,
    "Seller_Type_Individual": 1,
    "Transmission_Manual": 1
}
```

## EDA Visualizations
Check the `models/` directory for:
- `correlation_heatmap.png`
- `selling_price_dist.png`
- `feature_importance.png`
- `actual_vs_predicted.png`
