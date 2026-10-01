from fastapi import APIRouter, Depends, Query
from typing import Optional, List

from ..services.routing_service import get_safe_route
from ..core.security import get_current_user
from .reports import get_active_hazard_points

router = APIRouter()


@router.get("/blocked-roads")
def list_blocked_roads(
    _: dict = Depends(get_current_user),
):
    """
    Get all active blocked roads and hazard points.
    Used by Module 1's live hazard map to render blocked road indicators.
    """
    return get_active_hazard_points()


@router.get("/")
def safe_route(
    start_lat: float = Query(..., description="Start latitude"),
    start_lon: float = Query(..., description="Start longitude"),
    end_lat: float = Query(..., description="Destination latitude"),
    end_lon: float = Query(..., description="Destination longitude"),
    blocked: Optional[str] = Query(
        None,
        description="Comma-separated list of blocked road point pairs: lat,lon;lat,lon",
    ),
    auto_avoid: bool = Query(
        True,
        description="Automatically avoid active hazards reported in Goa",
    ),
    _: dict = Depends(get_current_user),
):
    """
    Calculate a safe driving route from start to end, avoiding blocked roads.

    `blocked` format: `15.50,73.83;15.49,73.82`  (lat,lon pairs separated by ;)
    `auto_avoid`: If true, merges currently active reported road hazards.

    Returns GeoJSON geometry, distance in km, and duration in minutes.
    """
    blocked_roads = []
    if blocked:
        for pair in blocked.split(";"):
            parts = pair.strip().split(",")
            if len(parts) == 2:
                try:
                    blocked_roads.append({"lat": float(parts[0]), "lon": float(parts[1])})
                except ValueError:
                    pass

    if auto_avoid:
        active_hazards = get_active_hazard_points()
        for h in active_hazards:
            if h.get("latitude") and h.get("longitude"):
                point = {"lat": float(h["latitude"]), "lon": float(h["longitude"])}
                if point not in blocked_roads:
                    blocked_roads.append(point)

    return get_safe_route(start_lat, start_lon, end_lat, end_lon, blocked_roads)

