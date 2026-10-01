"""
alert_delivery.py – multi-channel alert delivery helpers.

Channels:
  1. In-app  – broadcast via Supabase Realtime (see realtime.py)
  2. WhatsApp share link – opens wa.me with pre-filled text (no API key needed)
  3. Neighbour relay list – placeholder for future SMS/IVRS integration
"""

import urllib.parse
from .realtime import broadcast_update


def send_in_app_alert(area_id: int, alert_id: int, message: str) -> None:
    """Push an in-app alert update to all subscribers of the area channel."""
    broadcast_update(
        channel=f"area:{area_id}:alerts",
        payload={"alert_id": alert_id, "message": message, "event": "new_alert"},
    )


def build_whatsapp_link(message: str, phone_number: str = "") -> str:
    """
    Build a WhatsApp share URL.
    - If phone_number is given: opens a direct chat with that contact.
    - Otherwise: opens the generic share sheet (user picks the contact).
    """
    encoded = urllib.parse.quote(message)
    if phone_number:
        # Remove non-digit chars and ensure country code
        digits = "".join(c for c in phone_number if c.isdigit())
        return f"https://wa.me/{digits}?text={encoded}"
    return f"https://wa.me/?text={encoded}"


def send_neighbour_relay(area_id: int, message: str, contacts: list[str]) -> list[str]:
    """
    Stub for neighbour-relay SMS/IVRS.
    Returns the list of WhatsApp share links, one per contact.
    In production this would call an SMS gateway (e.g. Twilio / MSG91).
    """
    links = []
    for contact in contacts:
        link = build_whatsapp_link(message, contact)
        links.append(link)
        print(f"[relay] Would send to {contact}: {link}")
    return links
