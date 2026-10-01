import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Set paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'data', 'processed')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def train_flood_model():
    print("--- Training Flood/Waterlogging Model ---")
    
    # 1. Load or Generate Dummy Data for now
    # Replace this with actual pandas read_csv once data is available
    print("Generating synthetic data for demonstration...")
    np.random.seed(42)
    n_samples = 1000
    
    # Features: rainfall (mm), elevation (m), drainage_capacity (index)
    X = pd.DataFrame({
        'rainfall_mm': np.random.uniform(0, 300, n_samples),
        'elevation_m': np.random.uniform(0, 100, n_samples),
        'drainage_capacity': np.random.uniform(1, 10, n_samples)
    })
    
    # Target: 0 (Low Risk), 1 (Medium Risk), 2 (High Risk)
    # Simple logic: High rain + low elevation + poor drainage = High Risk
    risk_score = X['rainfall_mm'] / (X['elevation_m'] + 1) - X['drainage_capacity']
    y = pd.cut(risk_score, bins=[-np.inf, 1, 5, np.inf], labels=[0, 1, 2])
    
    # 2. Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 3. Train Model
    print("Training RandomForest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 4. Evaluate Model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Low", "Medium", "High"]))
    
    # 5. Save Model
    os.makedirs(MODELS_DIR, exist_ok=True)
    model_path = os.path.join(MODELS_DIR, 'flood_model.joblib')
    joblib.dump(model, model_path)
    print(f"Successfully saved flood model to {model_path}")

def main():
    train_flood_model()

if __name__ == "__main__":
    main()
