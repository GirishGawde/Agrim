from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime

from ..models.incident import Incident, IncidentBase
from ..core.security import get_current_user, require_role
from ..core.database import get_db

router = APIRouter()

# ── In-memory store ───────────────────────────────────────────────────────────
_incidents: list[dict] = [
    {
        "id": 1,
        "description": "Flooding in Ward 2, Patto area. Roads submerged for 6 hours.",
        "lessons_learned": "Drainage channels need clearing before monsoon.",
        "area_id": 1,
        "hazard_type": "flood",
        "date": "2025-07-12",
        "created_at": datetime(2025, 7, 12, 8, 0, 0),
    },
    {
        "id": 2,
        "description": "Landslide near NH-66 at Borim, blocking traffic for 3 hours.",
        "lessons_learned": "Slope stabilisation work required before next monsoon.",
        "area_id": 2,
        "hazard_type": "landslide",
        "date": "2025-08-03",
        "created_at": datetime(2025, 8, 3, 11, 30, 0),
    },
]
_next_id = 3


@router.get("/", response_model=List[Incident])
def get_incidents(
    area_id: Optional[int] = None,
    hazard_type: Optional[str] = None,
    _: dict = Depends(get_current_user),
):
    """Return all logged past incidents, filterable by area and hazard type."""
    db = get_db()

    if db:
        try:
            query = db.table("incidents").select("*").order("date", desc=True)
            if area_id is not None:
                query = query.eq("area_id", area_id)
            if hazard_type:
                query = query.eq("hazard_type", hazard_type)
            result = query.execute()
            return [Incident(**i) for i in result.data]
        except Exception as exc:
            print(f"[incidents] Supabase query failed: {exc}")

    rows = _incidents
    if area_id is not None:
        rows = [r for r in rows if r.get("area_id") == area_id]
    if hazard_type:
        rows = [r for r in rows if r.get("hazard_type") == hazard_type]
    return [Incident(**r) for r in rows]


@router.post("/", response_model=Incident, status_code=201)
def log_incident(
    incident: IncidentBase,
    current_user: dict = Depends(require_role("volunteer", "authority")),
):
    """
    Log a new past incident for learning / Module 3 retraining.
    Volunteers and authorities can log incidents.
    """
    global _next_id
    db = get_db()

    now = datetime.utcnow()
    new_incident = {
        "id": _next_id,
        **incident.model_dump(),
        "created_at": now,
        "date": incident.date or now.date().isoformat(),
    }

    if db:
        try:
            result = (
                db.table("incidents")
                .insert({k: v for k, v in new_incident.items() if k != "id"})
                .execute()
            )
            new_incident["id"] = result.data[0]["id"]
        except Exception as exc:
            print(f"[incidents] Supabase insert failed: {exc}")
            _incidents.append(new_incident)
            _next_id += 1
    else:
        _incidents.append(new_incident)
        _next_id += 1

    return Incident(**new_incident)


@router.get("/{incident_id}", response_model=Incident)
def get_incident(incident_id: int, _: dict = Depends(get_current_user)):
    """Return a single incident by ID."""
    for r in _incidents:
        if r["id"] == incident_id:
            return Incident(**r)
    raise HTTPException(status_code=404, detail="Incident not found")
