# Module 2 Backend API  
**Base URL (local):** `http://localhost:8000`  
**Base URL (deployed):** TBD (Render)

> All endpoints except `POST /auth/login` require a `Bearer <token>` header.  
> Obtain a token via `POST /auth/login`.

---

## Auth

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/auth/login` | — | OAuth2 password login → JWT token |
| GET  | `/auth/me` | all | Return current user profile |

**Demo credentials:**

| Role | Email | Password |
|------|-------|----------|
| citizen | citizen@demo.goa | citizen123 |
| volunteer | volunteer@demo.goa | volunteer123 |
| authority | authority@demo.goa | authority123 |

---

## Risk (calls Module 3)

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/risk/{area_id}` | all | Risk level (Low/Medium/High/Unknown) + reason for an area |

---

## Reports

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/reports/` | all | Submit a hazard report (type, location, lat, lon, photo_url) |
| POST | `/reports/upload-photo` | all | Upload hazard report photo (multipart file) → returns `photo_url` |
| GET | `/reports/` | all | List reports; filter by `?area_id=&status=` |
| PATCH | `/reports/{id}/status` | volunteer, authority | Update status: Open → Assigned → Resolved |

---

## Alerts

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/alerts/` | volunteer, authority | Generate alert; calls Module 4 if message is empty |
| GET | `/alerts/` | all | List approved alerts; filter by `?area_id=` |
| PATCH | `/alerts/{id}/approve` | authority | Approve alert → triggers in-app + WhatsApp delivery |

Response includes `whatsapp_link` (pre-filled `wa.me` URL).

---

## Resources & Matching

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/resources/` | all | List resources; filter by `?resource_type=&area_id=&available_only=true` |
| POST | `/resources/` | volunteer, authority | Add a resource |
| PATCH | `/resources/{id}/availability` | volunteer, authority | Toggle availability |

---

## Households

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/households/` | all | List households; filter by `?area_id=` |
| GET | `/households/{id}` | all | Get a single household |
| POST | `/households/` | all | Register a household |
| GET | `/households/{id}/plan` | all | Get personalised action plan (calls Module 4) |

---

## Incidents

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/incidents/` | all | List past incidents; filter by `?area_id=&hazard_type=` |
| GET | `/incidents/{id}` | all | Get a single incident |
| POST | `/incidents/` | volunteer, authority | Log a new incident for learning / retraining |

---

## Routing

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/route/` | all | Safe route; params: `start_lat`, `start_lon`, `end_lat`, `end_lon`, `blocked`, `auto_avoid` |
| GET | `/route/blocked-roads` | all | List currently active reported road hazards with coordinates for live map |

`blocked` format: `lat,lon;lat,lon` (semicolon-separated pairs)  
`auto_avoid`: `true` by default (automatically avoids active flood/landslide reports in Goa)  
Response includes GeoJSON geometry, distance (km), duration (min).

---


## Docs

Interactive docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
