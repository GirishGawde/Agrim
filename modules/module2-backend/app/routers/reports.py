import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Optional
from datetime import datetime

from ..models.report import Report, ReportBase
from ..core.security import get_current_user, require_role
from ..core.database import get_db
from ..services.realtime import broadcast_update

router = APIRouter()

# Directory for local fallback uploads
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# ── In-memory store (fallback when Supabase not configured) ───────────────────
_reports: list[dict] = [
    {
        "id": 1,
        "type": "flood",
        "location": "Patto Bridge",
        "area_id": 1,
        "status": "Open",
        "photo_url": None,
        "latitude": 15.4989,
        "longitude": 73.8278,
        "description": "Road submerged near the bridge.",
        "verified": False,
        "created_at": datetime(2026, 10, 1, 6, 0, 0),
    }
]
_next_id = 2


@router.post("/", response_model=Report, status_code=status.HTTP_201_CREATED)
def create_report(report: ReportBase, current_user: dict = Depends(get_current_user)):
    """
    Submit a new hazard report.
    Accessible to all authenticated roles.
    Broadcasts a realtime update so the live map refreshes.
    """
    global _next_id
    db = get_db()

    now = datetime.utcnow()
    new_report = {
        "id": _next_id,
        **report.model_dump(),
        "verified": False,
        "created_at": now,
        "submitted_by": current_user["user_id"],
    }

    if db:
        try:
            insert_data = {
                k: (v.isoformat() if isinstance(v, datetime) else v)
                for k, v in new_report.items()
                if k != "id" and v is not None
            }
            result = (
                db.table("reports")
                .insert(insert_data)
                .execute()
            )
            if result.data:
                new_report["id"] = result.data[0]["id"]
        except Exception as exc:
            print(f"[reports] Supabase insert failed, using in-memory: {exc}")
            _reports.append(new_report)
            _next_id += 1
    else:
        _reports.append(new_report)
        _next_id += 1


    broadcast_update(
        channel=f"area:{new_report.get('area_id', 0)}:reports",
        payload={"event": "new_report", "report_id": new_report["id"]},
    )
    return Report(**new_report)


@router.get("/", response_model=List[Report])
def get_reports(
    area_id: Optional[int] = None,
    status: Optional[str] = None,
    _: dict = Depends(get_current_user),
):
    """Get all reports, optionally filtered by area and/or status."""
    db = get_db()

    if db:
        try:
            query = db.table("reports").select("*")
            if area_id is not None:
                query = query.eq("area_id", area_id)
            if status:
                query = query.eq("status", status)
            result = query.execute()
            return [Report(**r) for r in result.data]
        except Exception as exc:
            print(f"[reports] Supabase query failed, using in-memory: {exc}")

    # In-memory fallback
    rows = _reports
    if area_id is not None:
        rows = [r for r in rows if r.get("area_id") == area_id]
    if status:
        rows = [r for r in rows if r.get("status") == status]
    return [Report(**r) for r in rows]


@router.patch("/{report_id}/status", response_model=Report)
def update_report_status(
    report_id: int,
    status: str,
    current_user: dict = Depends(require_role("volunteer", "authority")),
):
    """
    Update a report's status.
    Only volunteers and authorities may do this.
    Valid values: Open | Assigned | Resolved
    """
    valid = {"Open", "Assigned", "Resolved"}
    if status not in valid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"status must be one of {valid}",
        )

    db = get_db()
    if db:
        try:
            result = (
                db.table("reports")
                .update({"status": status})
                .eq("id", report_id)
                .execute()
            )
            if result.data:
                return Report(**result.data[0])
        except Exception as exc:
            print(f"[reports] Supabase update failed: {exc}")

    # In-memory fallback
    for r in _reports:
        if r["id"] == report_id:
            r["status"] = status
            return Report(**r)
    raise HTTPException(status_code=404, detail="Report not found")


def get_active_hazard_points() -> list[dict]:
    """Retrieve active flood, landslide, or road block reports with lat/lon."""
    points: list[dict] = []
    db = get_db()
    if db:
        try:
            res = (
                db.table("reports")
                .select("id, type, location, latitude, longitude, description, status")
                .in_("type", ["flood", "landslide", "blocked_road"])
                .in_("status", ["Open", "Assigned"])
                .execute()
            )
            data = res.data or []
            points.extend([
                r for r in data
                if r.get("latitude") is not None and r.get("longitude") is not None
            ])
        except Exception as exc:
            print(f"[reports] Query active hazard points failed: {exc}")

    known_ids = {p["id"] for p in points}
    for r in _reports:
        if (
            r["id"] not in known_ids
            and r.get("type") in ["flood", "landslide", "blocked_road"]
            and r.get("status") in ["Open", "Assigned"]
            and r.get("latitude") is not None
            and r.get("longitude") is not None
        ):
            points.append({
                "id": r["id"],
                "type": r["type"],
                "location": r.get("location"),
                "latitude": r.get("latitude"),
                "longitude": r.get("longitude"),
                "description": r.get("description"),
                "status": r.get("status"),
            })

    return points



@router.post("/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):
    """
    Upload a hazard report photo.
    Stores in Supabase Storage bucket 'report-photos' if available,
    or falls back to local uploads directory.
    Returns the URL of the uploaded photo.
    """
    db = get_db()
    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    unique_filename = f"{uuid.uuid4()}{ext}"
    contents = await file.read()

    if db:
        try:
            bucket_name = "report-photos"
            db.storage.from_(bucket_name).upload(
                path=unique_filename,
                file=contents,
                file_options={"content-type": file.content_type or "image/jpeg"},
            )
            public_url = db.storage.from_(bucket_name).get_public_url(unique_filename)
            return {"photo_url": public_url, "filename": unique_filename}
        except Exception as exc:
            print(f"[reports] Supabase storage upload failed, saving locally: {exc}")

    # Fallback to local storage
    file_path = UPLOAD_DIR / unique_filename
    with open(file_path, "wb") as f:
        f.write(contents)

    local_url = f"/uploads/{unique_filename}"
    return {"photo_url": local_url, "filename": unique_filename}

