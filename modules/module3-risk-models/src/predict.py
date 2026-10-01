import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Mapping from class index to risk level
RISK_LEVELS = {0: "Low", 1: "Medium", 2: "High"}

def load_model(model_name):
    """Utility to load a trained model."""
    path = os.path.join(MODELS_DIR, f'{model_name}.joblib')
    if os.path.exists(path):
        return joblib.load(path)
    return None

def predict_flood_risk(rainfall, elevation, drainage):
    """
    Predicts the flood risk for a given area.
    """
    model = load_model('flood_model')
    if not model:
        return "Unknown", "Flood model not trained yet."
    
    # Create input DataFrame
    input_data = pd.DataFrame([{
        'rainfall_mm': rainfall,
        'elevation_m': elevation,
        'drainage_capacity': drainage
    }])
    
    prediction = model.predict(input_data)[0]
    risk_level = RISK_LEVELS.get(prediction, "Unknown")
    
    # Generate a simple reason
    if risk_level == "High":
        reason = f"High rainfall ({rainfall}mm) combined with poor drainage/elevation."
    elif risk_level == "Medium":
        reason = "Moderate rainfall or moderate elevation."
    else:
        reason = "Safe elevation and manageable rainfall."
        
    return risk_level, reason

def predict_landslide_risk(rainfall, slope, soil_type):
    """
    Predicts the landslide risk for a given area.
    """
    model = load_model('landslide_model')
    if not model:
        return "Unknown", "Landslide model not trained yet."
        
    # Create input DataFrame
    input_data = pd.DataFrame([{
        'rainfall_mm': rainfall,
        'slope_degrees': slope,
        'soil_type_index': soil_type
    }])
    
    prediction = model.predict(input_data)[0]
    risk_level = RISK_LEVELS.get(prediction, "Unknown")
    
    # Generate a simple reason
    if risk_level == "High":
        reason = f"Steep slope ({slope} degrees) with heavy rainfall ({rainfall}mm) makes soil highly unstable."
    elif risk_level == "Medium":
        reason = "Moderate risk due to sloping terrain."
    else:
        reason = "Stable terrain with low risk of sliding."
        
    return risk_level, reason

if __name__ == "__main__":
    # Test the predictions locally
    print("Testing Flood Prediction (Rain: 250, Elev: 5, Drain: 2):")
    risk, reason = predict_flood_risk(250, 5, 2)
    print(f"Result: {risk} - {reason}")
    
    print("\nTesting Landslide Prediction (Rain: 150, Slope: 45, Soil: 3):")
    risk, reason = predict_landslide_risk(150, 45, 3)
    print(f"Result: {risk} - {reason}")
