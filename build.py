"""
Render build script — trains the ML model if .pkl is not present.
This runs during `buildCommand` on Render so the model is ready at startup.
"""
import os

MODEL_PATH = "models/car_price_model.pkl"
DATA_PATH = "data/car_data.csv"

if not os.path.exists(MODEL_PATH):
    print("⚙️  Model not found. Training from scratch...")
    if os.path.exists(DATA_PATH):
        # Import and run training inline
        from src.train import load_data, preprocess_data, train_model, save_model
        df = load_data(DATA_PATH)
        df_processed = preprocess_data(df)
        model, X_test, y_test, columns = train_model(df_processed)
        save_model(model, columns, MODEL_PATH)
        print("✅ Model trained and saved successfully!")
    else:
        print(f"❌ Training data not found at {DATA_PATH}. Cannot train model.")
else:
    print("✅ Pre-trained model found. Skipping training.")
