from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from ..models.resource import Resource, ResourceBase
from ..core.security import get_current_user, require_role
from ..core.database import get_db

router = APIRouter()

# ── In-memory store ───────────────────────────────────────────────────────────
_resources: list[dict] = [
    {
        "id": 1,
        "type": "boat",
        "provider_contact": "555-0201",
        "location": "Patto Bridge",
        "area_id": 1,
        "available": True,
        "capacity": 8,
    },
    {
        "id": 2,
        "type": "water_tank",
        "provider_contact": "555-0202",
        "location": "Taleigao Center",
        "area_id": 2,
        "available": True,
        "capacity": 5000,
    },
    {
        "id": 3,
        "type": "vehicle",
        "provider_contact": "555-0303",
        "location": "Panaji Market",
        "area_id": 1,
        "available": True,
        "capacity": 12,
    },
]
_next_id = 4


@router.get("/", response_model=List[Resource])
def get_resources(
    resource_type: Optional[str] = None,
    area_id: Optional[int] = None,
    available_only: bool = True,
    _: dict = Depends(get_current_user),
):
    """List community resources, filterable by type, area, and availability."""
    db = get_db()

    if db:
        try:
            query = db.table("resources").select("*")
            if resource_type:
                query = query.eq("type", resource_type)
            if area_id is not None:
                query = query.eq("area_id", area_id)
            if available_only:
                query = query.eq("available", True)
            result = query.execute()
            return [Resource(**r) for r in result.data]
        except Exception as exc:
            print(f"[resources] Supabase query failed: {exc}")

    rows = _resources
    if resource_type:
        rows = [r for r in rows if r.get("type") == resource_type]
    if area_id is not None:
        rows = [r for r in rows if r.get("area_id") == area_id]
    if available_only:
        rows = [r for r in rows if r.get("available", True)]
    return [Resource(**r) for r in rows]


@router.post("/", response_model=Resource, status_code=201)
def add_resource(
    resource: ResourceBase,
    current_user: dict = Depends(require_role("volunteer", "authority")),
):
    """Register a new community resource. Volunteers and authorities only."""
    global _next_id
    db = get_db()

    new_resource = {"id": _next_id, **resource.model_dump()}

    if db:
        try:
            result = (
                db.table("resources")
                .insert({k: v for k, v in new_resource.items() if k != "id"})
                .execute()
            )
            new_resource["id"] = result.data[0]["id"]
        except Exception as exc:
            print(f"[resources] Supabase insert failed: {exc}")
            _resources.append(new_resource)
            _next_id += 1
    else:
        _resources.append(new_resource)
        _next_id += 1

    return Resource(**new_resource)


@router.patch("/{resource_id}/availability", response_model=Resource)
def update_availability(
    resource_id: int,
    available: bool,
    current_user: dict = Depends(require_role("volunteer", "authority")),
):
    """Mark a resource as available or unavailable."""
    db = get_db()

    if db:
        try:
            result = (
                db.table("resources")
                .update({"available": available})
                .eq("id", resource_id)
                .execute()
            )
            if result.data:
                return Resource(**result.data[0])
        except Exception as exc:
            print(f"[resources] Supabase update failed: {exc}")

    for r in _resources:
        if r["id"] == resource_id:
            r["available"] = available
            return Resource(**r)
    raise HTTPException(status_code=404, detail="Resource not found")
