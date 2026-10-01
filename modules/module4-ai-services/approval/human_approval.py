import uuid
from typing import Dict, Any

# Mock database for pending approvals
pending_alerts: Dict[str, Any] = {}

def create_pending_alert(message: str, target_language: str) -> str:
    alert_id = str(uuid.uuid4())
    pending_alerts[alert_id] = {
        "message": message,
        "language": target_language,
        "status": "pending"
    }
    return alert_id

def approve_alert(alert_id: str) -> bool:
    if alert_id in pending_alerts and pending_alerts[alert_id]["status"] == "pending":
        pending_alerts[alert_id]["status"] = "approved"
        return True
    return False

def reject_alert(alert_id: str) -> bool:
    if alert_id in pending_alerts and pending_alerts[alert_id]["status"] == "pending":
        pending_alerts[alert_id]["status"] = "rejected"
        return True
    return False

def get_pending_alert(alert_id: str) -> Any:
    return pending_alerts.get(alert_id)
