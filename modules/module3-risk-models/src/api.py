from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.predict import predict_flood_risk, predict_landslide_risk

app = FastAPI(title="Module 3 - Risk Prediction API")

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
