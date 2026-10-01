from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from language.alert_generator import generate_alert
from language.translate import translate_message
from approval.human_approval import create_pending_alert, approve_alert, reject_alert, get_pending_alert
from vision.classify_photo import classify_image
from vision.duplicate_merge import merge_reports
from language.plan_generator import generate_action_plan
from matching.need_offer_match import match_needs

app = FastAPI(title="Module 4: AI Services API", description="AI Verification, Language & Matching")

class AlertRequest(BaseModel):
    household_type: str
    hazard_type: str
    risk_level: str
    reason: str
    target_language: str = "en"

class ApprovalRequest(BaseModel):
    alert_id: str
    action: str  # "approve" or "reject"

class Report(BaseModel):
    id: str
    lat: float
    lng: float
    hazard_type: str
    timestamp: str
    image_path: str = ""

class PlanRequest(BaseModel):
    household_type: str
    hazard_type: str
    risk_level: str

class MatchRequest(BaseModel):
    need: str
    lat: float
    lng: float
    available_resources: List[Dict[str, Any]]

@app.get("/")
def read_root():
    return {"status": "ok", "module": "Module 4"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/alerts/generate")
def generate_and_queue_alert(request: AlertRequest):
    message = generate_alert(request.household_type, request.hazard_type, request.risk_level, request.reason)
    translated_msg = translate_message(message, request.target_language)
    alert_id = create_pending_alert(translated_msg, request.target_language)
    return {
        "status": "queued_for_approval",
        "alert_id": alert_id,
        "preview_message": translated_msg
    }

@app.post("/alerts/approval")
def review_alert(request: ApprovalRequest):
    if request.action == "approve":
        success = approve_alert(request.alert_id)
    elif request.action == "reject":
        success = reject_alert(request.alert_id)
    else:
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'reject'")
        
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found or already processed")
        
    alert_data = get_pending_alert(request.alert_id)
    return {"status": "success", "alert": alert_data}

@app.post("/vision/classify")
def classify_report_photo(image_path: str):
    result = classify_image(image_path)
    return {"status": "success", "classification": result}

@app.post("/vision/merge")
def merge_duplicate_reports(reports: List[Report]):
    reports_dict = [r.model_dump() for r in reports]
    merged = merge_reports(reports_dict)
    return {"status": "success", "merged_reports": merged}

@app.post("/recovery/plan")
def get_action_plan(request: PlanRequest):
    plan = generate_action_plan(request.household_type, request.hazard_type, request.risk_level)
    return {"status": "success", "action_plan": plan}

@app.post("/recovery/match")
def match_need_to_resources(request: MatchRequest):
    matches = match_needs(request.need, request.lat, request.lng, request.available_resources)
    return {"status": "success", "matches": matches}
