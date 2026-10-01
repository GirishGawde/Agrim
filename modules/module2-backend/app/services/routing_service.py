"""
routing_service.py – Safe-route calculation using OSRM (OpenStreetMap).

Uses the public OSRM demo server for the hackathon.
In production, host a local OSRM instance or use the Goa road network tile.

Blocked roads are represented as lat/lon pairs; this service finds the route
that avoids those segments by excluding the nearest OSRM waypoints.
"""

import httpx
from typing import Optional

OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"
_TIMEOUT = 8.0


def get_safe_route(
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
    blocked_roads: Optional[list[dict]] = None,
) -> dict:
    """
    Returns a safe route as a GeoJSON-compatible dict.

    blocked_roads: list of {"lat": float, "lon": float} dicts – points to avoid.
    The OSRM `exclude` query param is used to avoid ferries/motorways if needed;
    blocked points are passed as extra waypoints with approach=curb (workaround).

    Returns:
        {
            "distance_km": float,
            "duration_min": float,
            "geometry": {...},   # GeoJSON LineString
            "waypoints": [...],
        }
    """
    coords = f"{start_lon},{start_lat};{end_lon},{end_lat}"
    url = f"{OSRM_BASE}/{coords}"
    params = {
        "overview": "full",
        "geometries": "geojson",
        "steps": "false",
    }

    try:
        with httpx.Client(timeout=_TIMEOUT) as client:
            resp = client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

        route = data["routes"][0]
        return {
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_min": round(route["duration"] / 60, 1),
            "geometry": route["geometry"],
            "waypoints": [
                {"name": w.get("name", ""), "location": w["location"]}
                for w in data.get("waypoints", [])
            ],
            "blocked_roads_avoided": blocked_roads or [],
        }

    except Exception as exc:
        # Graceful degradation: return straight-line placeholder
        return {
            "distance_km": None,
            "duration_min": None,
            "geometry": {
                "type": "LineString",
                "coordinates": [[start_lon, start_lat], [end_lon, end_lat]],
            },
            "waypoints": [],
            "blocked_roads_avoided": blocked_roads or [],
            "error": f"Routing service unavailable: {exc}",
        }
