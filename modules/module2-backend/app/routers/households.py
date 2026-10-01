from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from ..models.household import Household, HouseholdBase
from ..core.security import get_current_user
from ..core.database import get_db
from ..services.ai_client import fetch_household_plan_from_module4

router = APIRouter()

# ── In-memory store ───────────────────────────────────────────────────────────
_households: list[dict] = [
    {
        "id": 1,
        "address": "House 1, Patto",
        "type": "low-lying",
        "contact": "555-0101",
        "area_id": 1,
        "language": "en",
    },
    {
        "id": 2,
        "address": "Farm 5, Taleigao",
        "type": "farmer",
        "contact": "555-0102",
        "area_id": 2,
        "language": "kok",
    },
    {
        "id": 3,
        "address": "Shack 3, Calangute Beach",
        "type": "fisherman",
        "contact": "555-0103",
        "area_id": 3,
        "language": "en",
    },
]
_next_id = 4


@router.get("/", response_model=List[Household])
def get_households(
    area_id: Optional[int] = None,
    _: dict = Depends(get_current_user),
):
    """List households, optionally filtered by area."""
    db = get_db()

    if db:
        try:
            query = db.table("households").select("*")
            if area_id is not None:
                query = query.eq("area_id", area_id)
            result = query.execute()
            return [Household(**h) for h in result.data]
        except Exception as exc:
            print(f"[households] Supabase query failed: {exc}")

    rows = _households
    if area_id is not None:
        rows = [h for h in rows if h.get("area_id") == area_id]
    return [Household(**h) for h in rows]


@router.get("/{household_id}", response_model=Household)
def get_household(household_id: int, _: dict = Depends(get_current_user)):
    """Get a single household by ID."""
    db = get_db()

    if db:
        try:
            result = db.table("households").select("*").eq("id", household_id).execute()
            if result.data:
                return Household(**result.data[0])
        except Exception as exc:
            print(f"[households] Supabase query failed: {exc}")

    for h in _households:
        if h["id"] == household_id:
            return Household(**h)
    raise HTTPException(status_code=404, detail="Household not found")


@router.get("/{household_id}/plan")
def get_household_plan(household_id: int, _: dict = Depends(get_current_user)):
    """
    Get the action plan for a household.
    Calls Module 4 for a personalised plan; falls back to a generic plan.
    """
    # Resolve household for type and language
    household = None
    for h in _households:
        if h["id"] == household_id:
            household = h
            break

    if household is None:
        raise HTTPException(status_code=404, detail="Household not found")

    plan = fetch_household_plan_from_module4(
        household_id=household_id,
        household_type=household.get("type", "general"),
        language=household.get("language", "en"),
    )
    return {"household_id": household_id, **plan}


@router.post("/", response_model=Household, status_code=201)
def create_household(
    household: HouseholdBase,
    _: dict = Depends(get_current_user),
):
    """Register a new household."""
    global _next_id
    db = get_db()

    new_household = {"id": _next_id, **household.model_dump()}

    if db:
        try:
            result = (
                db.table("households")
                .insert({k: v for k, v in new_household.items() if k != "id"})
                .execute()
            )
            new_household["id"] = result.data[0]["id"]
        except Exception as exc:
            print(f"[households] Supabase insert failed: {exc}")
            _households.append(new_household)
            _next_id += 1
    else:
        _households.append(new_household)
        _next_id += 1

    return Household(**new_household)
