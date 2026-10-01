"""
ai_client.py – thin HTTP wrappers around Module 3 (risk) and Module 4 (AI/NLP).

All calls degrade gracefully: if the downstream service is unreachable or returns
an error the functions return sensible fallback values so the rest of the system
keeps running.
"""

import httpx
from ..config import settings

_TIMEOUT = 5.0  # seconds


def fetch_risk_from_module3(area_id: int) -> dict:
    """
    GET {module3_url}/risk/{area_id}
    Expected response: {"risk_level": "High", "reason": "..."}
    Falls back to {"risk_level": "Unknown", "reason": "Module 3 unavailable"}.
    """
    try:
        url = f"{settings.module3_url}/risk/{area_id}"
        with httpx.Client(timeout=_TIMEOUT) as client:
            resp = client.get(url)
            resp.raise_for_status()
            return resp.json()
    except Exception:
        return {"risk_level": "Unknown", "reason": "Risk service unavailable."}


def fetch_alert_text_from_module4(
    household_type: str,
    language: str,
    hazard_type: str = "flood",
    risk_level: str = "High",
) -> str:
    """
    POST {module4_url}/alert-text
    Body: {"household_type": ..., "language": ..., "hazard_type": ..., "risk_level": ...}
    Expected response: {"message": "..."}
    """
    try:
        url = f"{settings.module4_url}/alert-text"
        payload = {
            "household_type": household_type,
            "language": language,
            "hazard_type": hazard_type,
            "risk_level": risk_level,
        }
        with httpx.Client(timeout=_TIMEOUT) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            return resp.json().get("message", "")
    except Exception:
        return (
            f"[{language.upper()}] {hazard_type.title()} risk is {risk_level}. "
            "Please follow local authority instructions."
        )


def fetch_household_plan_from_module4(household_id: int, household_type: str, language: str) -> dict:
    """
    POST {module4_url}/household-plan
    Returns the action plan dict for a household.
    """
    try:
        url = f"{settings.module4_url}/household-plan"
        payload = {
            "household_id": household_id,
            "household_type": household_type,
            "language": language,
        }
        with httpx.Client(timeout=_TIMEOUT) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            return resp.json()
    except Exception:
        return {
            "plan": "Move to the nearest shelter. Carry essentials.",
            "emergency_contacts": ["112", "Goa SDMA: 0832-2226955"],
            "nearest_shelter": "Panaji School",
        }
