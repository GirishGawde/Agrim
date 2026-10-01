from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from src.predict import predict_flood_risk, predict_landslide_risk

app = FastAPI(title="Module 3 - Risk Prediction API")

# Set paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'data', 'processed')

# Input Schemas
class FloodRiskRequest(BaseModel):
    rainfall_mm: float
    elevation_m: float
    drainage_capacity: float

class LandslideRiskRequest(BaseModel):
    rainfall_mm: float
    slope_degrees: float
    soil_type_index: int

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Risk Models API is running."}

@app.get("/risk/{area_id}")
def get_risk_by_area(area_id: int):
    """Endpoint called by Module 2 to fetch risk for a specific area."""
    # 1. Fetch live weather
    weather_file = os.path.join(PROCESSED_DATA_DIR, 'live_weather.json')
    rainfall = 215.5 # Mock heavy rainfall for the hackathon demo
    if os.path.exists(weather_file):
        with open(weather_file, 'r') as f:
            data = json.load(f)
            rainfall = float(data.get('current', {}).get('precipitation', 215.5))
            
    # 2. Mock area geography based on area_id (in production, fetch from DB)
    elevation = 2.0 if area_id == 1 else 15.0 # Area 1 (Patto-Panaji) is very low elevation
    drainage = 3.0 if area_id == 1 else 7.0
    
    # 3. Predict Risk
    level, reason = predict_flood_risk(rainfall, elevation, drainage)
    
    # 4. Return format expected by Module 2
    return {"risk_level": level, "reason": reason}

@app.post("/risk/flood")
def get_flood_risk(req: FloodRiskRequest):
    try:
        level, reason = predict_flood_risk(req.rainfall_mm, req.elevation_m, req.drainage_capacity)
        return {"hazard": "flood", "risk_level": level, "reason": reason}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/risk/landslide")
def get_landslide_risk(req: LandslideRiskRequest):
    try:
        level, reason = predict_landslide_risk(req.rainfall_mm, req.slope_degrees, req.soil_type_index)
        return {"hazard": "landslide", "risk_level": level, "reason": reason}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn src.api:app --reload --port 8003
