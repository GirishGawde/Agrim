"""
test_api.py – integration tests for Module 2 backend.

Run with:
    cd modules/module2-backend
    pytest tests/ -v

All tests use the FastAPI TestClient (no real network calls, no Supabase needed).
Authenticated endpoints are tested with a real JWT generated from the demo users.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def get_token(role: str = "citizen") -> str:
    """Login as one of the demo users and return a JWT token."""
    credentials = {
        "citizen":   ("citizen@demo.goa",   "citizen123"),
        "volunteer": ("volunteer@demo.goa",  "volunteer123"),
        "authority": ("authority@demo.goa",  "authority123"),
    }
    email, password = credentials[role]
    resp = client.post(
        "/auth/login",
        data={"username": email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed for role '{role}': {resp.text}"
    return resp.json()["access_token"]


def auth_headers(role: str = "citizen") -> dict:
    return {"Authorization": f"Bearer {get_token(role)}"}


# ─────────────────────────────────────────────────────────────────────────────
# 1. Health & Root
# ─────────────────────────────────────────────────────────────────────────────

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Goa Community Resilience API"}


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


# ─────────────────────────────────────────────────────────────────────────────
# 2. Auth
# ─────────────────────────────────────────────────────────────────────────────

def test_login_citizen():
    resp = client.post(
        "/auth/login",
        data={"username": "citizen@demo.goa", "password": "citizen123"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert body["role"] == "citizen"


def test_login_volunteer():
    resp = client.post(
        "/auth/login",
        data={"username": "volunteer@demo.goa", "password": "volunteer123"},
    )
    assert resp.status_code == 200
    assert resp.json()["role"] == "volunteer"


def test_login_authority():
    resp = client.post(
        "/auth/login",
        data={"username": "authority@demo.goa", "password": "authority123"},
    )
    assert resp.status_code == 200
    assert resp.json()["role"] == "authority"


def test_login_wrong_password():
    resp = client.post(
        "/auth/login",
        data={"username": "citizen@demo.goa", "password": "wrongpassword"},
    )
    assert resp.status_code == 401


def test_get_me_citizen():
    resp = client.get("/auth/me", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    body = resp.json()
    assert body["role"] == "citizen"
    assert "id" in body


def test_get_me_unauthenticated():
    resp = client.get("/auth/me")
    assert resp.status_code == 401


# ─────────────────────────────────────────────────────────────────────────────
# 3. Risk
# ─────────────────────────────────────────────────────────────────────────────

def test_get_risk_authenticated():
    resp = client.get("/risk/1", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    body = resp.json()
    assert "risk_level" in body
    assert "name" in body


def test_get_risk_unauthenticated():
    resp = client.get("/risk/1")
    assert resp.status_code == 401


# ─────────────────────────────────────────────────────────────────────────────
# 4. Reports
# ─────────────────────────────────────────────────────────────────────────────

def test_get_reports():
    resp = client.get("/reports/", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_create_report():
    payload = {
        "type": "flood",
        "location": "Calangute Beach Road",
        "area_id": 3,
        "status": "Open",
        "latitude": 15.5438,
        "longitude": 73.7524,
        "description": "Water logging on main road.",
    }
    resp = client.post("/reports/", json=payload, headers=auth_headers("citizen"))
    assert resp.status_code == 201
    body = resp.json()
    assert body["type"] == "flood"
    assert body["location"] == "Calangute Beach Road"
    assert "id" in body


def test_create_report_unauthenticated():
    payload = {"type": "flood", "location": "Test", "status": "Open"}
    resp = client.post("/reports/", json=payload)
    assert resp.status_code == 401


def test_update_report_status_as_volunteer():
    # First create a report
    payload = {
        "type": "landslide",
        "location": "Borim",
        "area_id": 2,
        "status": "Open",
    }
    create_resp = client.post("/reports/", json=payload, headers=auth_headers("citizen"))
    assert create_resp.status_code == 201
    report_id = create_resp.json()["id"]

    # Update status as volunteer
    resp = client.patch(
        f"/reports/{report_id}/status",
        params={"status": "Assigned"},
        headers=auth_headers("volunteer"),
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "Assigned"


def test_update_report_status_forbidden_for_citizen():
    resp = client.patch(
        "/reports/1/status",
        params={"status": "Resolved"},
        headers=auth_headers("citizen"),
    )
    assert resp.status_code == 403


# ─────────────────────────────────────────────────────────────────────────────
# 5. Alerts
# ─────────────────────────────────────────────────────────────────────────────

def test_get_alerts():
    resp = client.get("/alerts/", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_create_alert_as_volunteer():
    payload = {
        "area_id": 1,
        "message": "Test flood alert for Patto.",
        "language": "en",
        "hazard_type": "flood",
        "status": "Pending",
    }
    resp = client.post("/alerts/", json=payload, headers=auth_headers("volunteer"))
    assert resp.status_code == 201
    body = resp.json()
    assert body["area_id"] == 1
    assert "whatsapp_link" in body
    assert body["whatsapp_link"].startswith("https://wa.me")


def test_create_alert_forbidden_for_citizen():
    payload = {"area_id": 1, "message": "Test", "status": "Pending"}
    resp = client.post("/alerts/", json=payload, headers=auth_headers("citizen"))
    assert resp.status_code == 403


def test_approve_alert_as_authority():
    # Create an alert first
    payload = {
        "area_id": 2,
        "message": "Heavy rain expected in Taleigao. Stay indoors.",
        "language": "en",
        "hazard_type": "flood",
        "status": "Pending",
    }
    create_resp = client.post("/alerts/", json=payload, headers=auth_headers("volunteer"))
    assert create_resp.status_code == 201
    alert_id = create_resp.json()["id"]

    # Approve as authority
    resp = client.patch(f"/alerts/{alert_id}/approve", headers=auth_headers("authority"))
    assert resp.status_code == 200
    assert resp.json()["status"] == "Approved"


def test_approve_alert_forbidden_for_volunteer():
    resp = client.patch("/alerts/1/approve", headers=auth_headers("volunteer"))
    assert resp.status_code == 403


# ─────────────────────────────────────────────────────────────────────────────
# 6. Resources
# ─────────────────────────────────────────────────────────────────────────────

def test_get_resources():
    resp = client.get("/resources/", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert len(resp.json()) > 0


def test_get_resources_filter_by_type():
    resp = client.get("/resources/?resource_type=boat", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    for r in resp.json():
        assert r["type"] == "boat"


def test_add_resource_as_volunteer():
    payload = {
        "type": "spare_room",
        "provider_contact": "555-9999",
        "location": "Margao Church Square",
        "area_id": 4,
        "available": True,
        "capacity": 4,
    }
    resp = client.post("/resources/", json=payload, headers=auth_headers("volunteer"))
    assert resp.status_code == 201
    assert resp.json()["type"] == "spare_room"


def test_add_resource_forbidden_for_citizen():
    payload = {
        "type": "boat",
        "provider_contact": "555-1111",
        "location": "Somewhere",
        "available": True,
    }
    resp = client.post("/resources/", json=payload, headers=auth_headers("citizen"))
    assert resp.status_code == 403


# ─────────────────────────────────────────────────────────────────────────────
# 7. Households
# ─────────────────────────────────────────────────────────────────────────────

def test_get_households():
    resp = client.get("/households/", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_get_household_by_id():
    resp = client.get("/households/1", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    assert resp.json()["id"] == 1


def test_get_household_not_found():
    resp = client.get("/households/9999", headers=auth_headers("citizen"))
    assert resp.status_code == 404


def test_get_household_plan():
    resp = client.get("/households/1/plan", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    body = resp.json()
    assert "household_id" in body
    assert "plan" in body


def test_create_household():
    payload = {
        "address": "Shop 7, Margao Market",
        "type": "shop",
        "contact": "555-7777",
        "area_id": 4,
        "language": "mr",
    }
    resp = client.post("/households/", json=payload, headers=auth_headers("citizen"))
    assert resp.status_code == 201
    assert resp.json()["type"] == "shop"


# ─────────────────────────────────────────────────────────────────────────────
# 8. Incidents
# ─────────────────────────────────────────────────────────────────────────────

def test_get_incidents():
    resp = client.get("/incidents/", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert len(resp.json()) >= 2  # seed data


def test_get_incidents_filter():
    resp = client.get("/incidents/?hazard_type=flood", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    for i in resp.json():
        assert i["hazard_type"] == "flood"


def test_log_incident_as_volunteer():
    payload = {
        "description": "Forest fire near Bondla Wildlife Sanctuary.",
        "lessons_learned": "Early warning system needed in forested areas.",
        "area_id": 5,
        "hazard_type": "fire",
        "date": "2026-09-15",
    }
    resp = client.post("/incidents/", json=payload, headers=auth_headers("volunteer"))
    assert resp.status_code == 201
    body = resp.json()
    assert body["hazard_type"] == "fire"


def test_log_incident_forbidden_for_citizen():
    payload = {
        "description": "Small landslide.",
        "hazard_type": "landslide",
    }
    resp = client.post("/incidents/", json=payload, headers=auth_headers("citizen"))
    assert resp.status_code == 403


def test_get_incident_by_id():
    resp = client.get("/incidents/1", headers=auth_headers("citizen"))
    assert resp.status_code == 200
    assert resp.json()["id"] == 1


# ─────────────────────────────────────────────────────────────────────────────
# 9. Routing
# ─────────────────────────────────────────────────────────────────────────────

def test_get_route_returns_geometry():
    resp = client.get(
        "/route/",
        params={
            "start_lat": 15.4989,
            "start_lon": 73.8278,
            "end_lat": 15.5007,
            "end_lon": 73.8250,
        },
        headers=auth_headers("citizen"),
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "geometry" in body
    assert body["geometry"]["type"] == "LineString"


def test_get_route_with_blocked_roads():
    resp = client.get(
        "/route/",
        params={
            "start_lat": 15.4989,
            "start_lon": 73.8278,
            "end_lat": 15.5007,
            "end_lon": 73.8250,
            "blocked": "15.499,73.828",
        },
        headers=auth_headers("citizen"),
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "blocked_roads_avoided" in body


def test_get_route_unauthenticated():
    resp = client.get(
        "/route/",
        params={"start_lat": 15.5, "start_lon": 73.8, "end_lat": 15.51, "end_lon": 73.81},
    )
    assert resp.status_code == 401


def test_get_blocked_roads():
    # Create an active hazard report
    client.post(
        "/reports/",
        json={
            "type": "flood",
            "location": "Patto Bridge",
            "latitude": 15.4989,
            "longitude": 73.8278,
            "status": "Open",
        },
        headers=auth_headers("citizen"),
    )
    resp = client.get(
        "/route/blocked-roads",
        headers=auth_headers("citizen"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "latitude" in data[0]
    assert "longitude" in data[0]


def test_get_route_auto_avoid():
    # Create an active hazard report
    client.post(
        "/reports/",
        json={
            "type": "landslide",
            "location": "Panaji Hill",
            "latitude": 15.4995,
            "longitude": 73.8260,
            "status": "Open",
        },
        headers=auth_headers("citizen"),
    )
    resp = client.get(
        "/route/",
        params={
            "start_lat": 15.4989,
            "start_lon": 73.8278,
            "end_lat": 15.5007,
            "end_lon": 73.8250,
            "auto_avoid": "true",
        },
        headers=auth_headers("citizen"),
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "geometry" in body
    assert len(body.get("blocked_roads_avoided", [])) >= 1



# ─────────────────────────────────────────────────────────────────────────────
# 10. Photo Upload
# ─────────────────────────────────────────────────────────────────────────────

def test_upload_photo():
    import io
    fake_image = io.BytesIO(b"dummy image data")
    resp = client.post(
        "/reports/upload-photo",
        files={"file": ("test.jpg", fake_image, "image/jpeg")},
        headers=auth_headers("citizen"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "photo_url" in data
    assert "filename" in data


def test_upload_photo_unauthenticated():
    import io
    fake_image = io.BytesIO(b"dummy image data")
    resp = client.post(
        "/reports/upload-photo",
        files={"file": ("test.jpg", fake_image, "image/jpeg")},
    )
    assert resp.status_code == 401

