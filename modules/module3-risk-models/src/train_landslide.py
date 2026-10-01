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

def train_landslide_model():
    print("--- Training Landslide Risk Model ---")
    
    # 1. Load or Generate Dummy Data
    print("Generating synthetic data for demonstration...")
    np.random.seed(42)
    n_samples = 1000
    
    # Features: rainfall (mm), slope (degrees), soil_type (1: solid rock, 3: loose soil)
    X = pd.DataFrame({
        'rainfall_mm': np.random.uniform(0, 300, n_samples),
        'slope_degrees': np.random.uniform(0, 60, n_samples),
        'soil_type_index': np.random.choice([1, 2, 3], size=n_samples)
    })
    
    # Target: 0 (Low Risk), 1 (Medium Risk), 2 (High Risk)
    risk_score = X['rainfall_mm'] * X['slope_degrees'] * X['soil_type_index']
    y = pd.cut(risk_score, bins=[-np.inf, 10000, 30000, np.inf], labels=[0, 1, 2])
    
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
    model_path = os.path.join(MODELS_DIR, 'landslide_model.joblib')
    joblib.dump(model, model_path)
    print(f"Successfully saved landslide model to {model_path}")

def main():
    train_landslide_model()

if __name__ == "__main__":
    main()
