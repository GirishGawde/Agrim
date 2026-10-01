from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime

from ..models.alert import Alert, AlertBase
from ..core.security import get_current_user, require_role
from ..core.database import get_db
from ..services.ai_client import fetch_alert_text_from_module4
from ..services.alert_delivery import send_in_app_alert, build_whatsapp_link

router = APIRouter()

# ── In-memory store ───────────────────────────────────────────────────────────
_alerts: list[dict] = [
    {
        "id": 1,
        "area_id": 1,
        "message": "High flood risk in Patto-Panaji. Move vehicles to higher ground.",
        "language": "en",
        "hazard_type": "flood",
        "status": "Approved",
        "created_at": datetime(2026, 10, 1, 6, 0, 0),
        "whatsapp_link": build_whatsapp_link(
            "⚠️ High flood risk in Patto-Panaji. Move vehicles to higher ground."
        ),
    }
]
_next_id = 2


@router.post("/", response_model=Alert, status_code=status.HTTP_201_CREATED)
def create_alert(
    alert_req: AlertBase,
    current_user: dict = Depends(require_role("volunteer", "authority")),
):
    """
    Generate and queue an alert.
    Calls Module 4 for personalised alert text if the caller doesn't supply a message.
    Status starts as 'Pending' until an authority approves it.
    """
    global _next_id
    db = get_db()

    # Enrich message via Module 4 if caller sent an empty string
    message = alert_req.message.strip()
    if not message:
        message = fetch_alert_text_from_module4(
            household_type="general",
            language=alert_req.language,
            hazard_type=alert_req.hazard_type or "flood",
            risk_level="High",
        )

    whatsapp = build_whatsapp_link(f"⚠️ ALERT: {message}")
    now = datetime.utcnow()

    new_alert = {
        "id": _next_id,
        "area_id": alert_req.area_id,
        "message": message,
        "language": alert_req.language,
        "hazard_type": alert_req.hazard_type,
        "status": alert_req.status,
        "created_at": now,
        "whatsapp_link": whatsapp,
    }

    if db:
        try:
            result = (
                db.table("alerts")
                .insert({k: v for k, v in new_alert.items() if k != "id"})
                .execute()
            )
            new_alert["id"] = result.data[0]["id"]
        except Exception as exc:
            print(f"[alerts] Supabase insert failed, using in-memory: {exc}")
            _alerts.append(new_alert)
            _next_id += 1
    else:
        _alerts.append(new_alert)
        _next_id += 1

    return Alert(**new_alert)


@router.get("/", response_model=List[Alert])
def get_alerts(
    area_id: Optional[int] = None,
    _: dict = Depends(get_current_user),
):
    """Get active alerts, optionally filtered by area."""
    db = get_db()

    if db:
        try:
            query = db.table("alerts").select("*").eq("status", "Approved")
            if area_id is not None:
                query = query.eq("area_id", area_id)
            result = query.execute()
            return [Alert(**a) for a in result.data]
        except Exception as exc:
            print(f"[alerts] Supabase query failed, using in-memory: {exc}")

    rows = [a for a in _alerts if a.get("status") == "Approved"]
    if area_id is not None:
        rows = [a for a in rows if a.get("area_id") == area_id]
    return [Alert(**a) for a in rows]


@router.patch("/{alert_id}/approve", response_model=Alert)
def approve_alert(
    alert_id: int,
    current_user: dict = Depends(require_role("authority")),
):
    """
    Approve a pending alert and trigger in-app + WhatsApp delivery.
    Only authorities may approve.
    """
    db = get_db()

    if db:
        try:
            result = (
                db.table("alerts")
                .update({"status": "Approved"})
                .eq("id", alert_id)
                .execute()
            )
            if result.data:
                alert_data = result.data[0]
                send_in_app_alert(alert_data["area_id"], alert_id, alert_data["message"])
                return Alert(**alert_data)
        except Exception as exc:
            print(f"[alerts] Supabase update failed: {exc}")

    # In-memory fallback
    for a in _alerts:
        if a["id"] == alert_id:
            a["status"] = "Approved"
            send_in_app_alert(a["area_id"], alert_id, a["message"])
            return Alert(**a)
    raise HTTPException(status_code=404, detail="Alert not found")
