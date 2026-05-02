import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn import metrics
from sklearn.model_selection import RandomizedSearchCV
import pickle
import os

def load_data(file_path):
    """Load dataset from CSV."""
    df = pd.read_csv(file_path)
    print("Dataset loaded successfully!")
    print(df.head())
    return df

def preprocess_data(df):
    """Perform full data preprocessing and feature engineering."""
    # Handle missing values (if any)
    df.dropna(inplace=True)
    
    # Feature Engineering: Create 'car_age' from 'Year'
    current_year = 2024 # Using 2024 as reference
    df['car_age'] = current_year - df['Year']
    
    # Drop columns that are not useful for prediction
    df.drop(['Car_Name', 'Year'], axis=1, inplace=True)
    
    # Convert categorical variables using one-hot encoding
    df = pd.get_dummies(df, drop_first=True)
    
    print("\nPreprocessed Data Head:")
    print(df.head())
    return df

def perform_eda(df):
    """Exploratory Data Analysis."""
    # Correlation Heatmap
    plt.figure(figsize=(10, 8))
    sns.heatmap(df.corr(), annot=True, cmap="RdYlGn")
    plt.title("Feature Correlation Heatmap")
    plt.savefig("models/correlation_heatmap.png")
    plt.close()
    
    # Distribution of Selling Price
    plt.figure(figsize=(8, 6))
    sns.histplot(df['Selling_Price'], kde=True)
    plt.title("Distribution of Selling Price")
    plt.savefig("models/selling_price_dist.png")
    plt.close()
    
    print("\nEDA plots saved in models/ directory.")

def train_model(df):
    """Train Random Forest Regressor and tune hyperparameters."""
    X = df.drop('Selling_Price', axis=1)
    y = df['Selling_Price']
    
    # Split dataset (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Hyperparameter Tuning
    n_estimators = [int(x) for x in np.linspace(start=100, stop=1200, num=12)]
    max_features = [1.0, 'sqrt']
    max_depth = [int(x) for x in np.linspace(5, 30, num=6)]
    min_samples_split = [2, 5, 10, 15, 100]
    min_samples_leaf = [1, 2, 5, 10]
    
    random_grid = {
        'n_estimators': n_estimators,
        'max_features': max_features,
        'max_depth': max_depth,
        'min_samples_split': min_samples_split,
        'min_samples_leaf': min_samples_leaf
    }
    
    rf = RandomForestRegressor()
    rf_random = RandomizedSearchCV(estimator=rf, param_distributions=random_grid, 
                                   scoring='neg_mean_squared_error', n_iter=10, 
                                   cv=5, verbose=2, random_state=42, n_jobs=1)
    
    rf_random.fit(X_train, y_train)
    
    best_model = rf_random.best_estimator_
    
    # Show feature importance
    importances = best_model.feature_importances_
    indices = np.argsort(importances)
    plt.figure(figsize=(10, 6))
    plt.title('Feature Importances')
    plt.barh(range(len(indices)), importances[indices], align='center')
    plt.yticks(range(len(indices)), [X.columns[i] for i in indices])
    plt.xlabel('Relative Importance')
    plt.savefig("models/feature_importance.png")
    plt.close()
    
    return best_model, X_test, y_test, X.columns.tolist()

def evaluate_model(model, X_test, y_test):
    """Print evaluation metrics and plot actual vs predicted."""
    predictions = model.predict(X_test)
    
    print("\nModel Evaluation:")
    print('MAE:', metrics.mean_absolute_error(y_test, predictions))
    print('MSE:', metrics.mean_squared_error(y_test, predictions))
    print('RMSE:', np.sqrt(metrics.mean_squared_error(y_test, predictions)))
    print('R2 Score:', metrics.r2_score(y_test, predictions))
    
    # Actual vs Predicted plot
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=y_test, y=predictions)
    plt.xlabel("Actual Price")
    plt.ylabel("Predicted Price")
    plt.title("Actual vs Predicted Car Prices")
    plt.savefig("models/actual_vs_predicted.png")
    plt.close()

def save_model(model, columns, file_path):
    """Save model and feature columns."""
    with open(file_path, 'wb') as f:
        pickle.dump({'model': model, 'columns': columns}, f)
    print(f"\nModel saved to {file_path}")

if __name__ == "__main__":
    data_path = 'data/car_data.csv'
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
    else:
        df = load_data(data_path)
        df_processed = preprocess_data(df)
        perform_eda(df_processed)
        model, X_test, y_test, columns = train_model(df_processed)
        evaluate_model(model, X_test, y_test)
        save_model(model, columns, 'models/car_price_model.pkl')
