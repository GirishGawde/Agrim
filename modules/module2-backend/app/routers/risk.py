from fastapi import APIRouter, Depends
from ..models.area import Area
from ..services.ai_client import fetch_risk_from_module3
from ..core.security import get_current_user

router = APIRouter()

# In-memory area name map for demo (Supabase query in production)
_AREA_NAMES = {
    1: "Patto-Panaji",
    2: "Taleigao",
    3: "Calangute",
    4: "Margao",
    5: "Vasco da Gama",
}


@router.get("/{area_id}", response_model=Area)
def get_risk(area_id: int, _: dict = Depends(get_current_user)):
    """
    Fetch risk level for an area by calling Module 3.
    Falls back to "Unknown" if Module 3 is offline.
    """
    risk_data = fetch_risk_from_module3(area_id)
    area_name = _AREA_NAMES.get(area_id, f"Area {area_id}")
    return Area(
        id=area_id,
        name=area_name,
        risk_level=risk_data.get("risk_level", "Unknown"),
        reason=risk_data.get("reason", ""),
    )
