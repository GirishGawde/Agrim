# Modules and Team Assignment

Five modules, one per team member. Each module has a clear owner, deliverables and a hand-off to the others, so the team can build in parallel and join at the end.

| # | Module | Owner | Main layer |
|---|---|---|---|
| 1 | Frontend & Live Hazard Map | _Name_ | Layer 2 |
| 2 | Backend, Database & Alert Delivery | _Name_ | Layers 1, 2, 3 |
| 3 | Risk Prediction Models | _Name_ | Layer 1 |
| 4 | AI Verification, Language & Matching | _Name_ | Layers 1, 2, 3 |
| 5 | Authority Dashboard, Recovery & Pitch | _Name_ | Layer 3 + submission |

---

## Module 1: Frontend & Live Hazard Map

**Owner:** _Name_
**Goal:** Everything a citizen sees: the live map, alerts, reports and safe routes.

### Responsibilities
- React app shell and navigation (mobile-first, lightweight pages)
- Live map with Leaflet/OpenStreetMap: risk heat layers, flooded areas, landslides, fires, blocked roads, shelters, hospitals
- Citizen report form: hazard type, photo upload, location pin
- Alert feed with language switch (English, Konkani, Marathi, Hindi)
- Safe-route view that avoids flooded or blocked roads
- Household plan page (display only; content comes from Module 4)

### Deliverables
- Working citizen web app connected to backend APIs
- Map updates live without refresh

### Needs from others
- APIs from Module 2, risk levels from Module 3, verified reports and alert text from Module 4

### Done when
A citizen can see their area's risk, submit a report, view it on the map, and get a safe route.

---

## Module 2: Backend, Database & Alert Delivery

**Owner:** _Name_
**Goal:** The engine that connects everything: data, APIs, login, realtime updates and alert delivery.

### Responsibilities
- Supabase/Firebase setup: tables for `areas`, `alerts`, `reports`, `households`, `resources`, `incidents`
- FastAPI backend and REST endpoints (risk, reports, alerts, resources, incidents)
- Auth and roles: citizen, volunteer, authority
- Realtime updates for map and dashboard
- Routing service using OpenStreetMap with a blocked-road overlay
- Alert delivery: in-app, WhatsApp/SMS share link, neighbour relay list
- Deployment (Vercel + Render) and environment setup

### Deliverables
- Documented API list (`API.md`) shared with the team by day 2
- Deployed backend the whole team can use

### Needs from others
- Model endpoints from Modules 3 and 4, data schema inputs from Module 5

### Done when
All modules talk to one deployed backend and role-based login works.

---

## Module 3: Risk Prediction Models

**Owner:** _Name_
**Goal:** Predict neighbourhood-level risk for the chosen hazards.

### Responsibilities
- Flood/waterlogging model (XGBoost or Random Forest) using rainfall, elevation and past events
- Landslide model using rainfall, slope and soil
- One more hazard: forest fire (temperature, humidity, wind, dry spell) or heat/water shortage (rainfall deficit)
- Pull live forecasts from Open-Meteo and combine with terrain data
- Output Low / Medium / High with a short reason per area
- Record accuracy, precision/recall and limitations in `ml/RESULTS.md`
- Retraining script that uses saved incidents (from Module 5)

### Deliverables
- Trained models and a `/risk` service
- Honest evaluation report

### Needs from others
- Historical data and synthetic events from Module 5, endpoint hosting from Module 2

### Done when
Changing the rainfall input changes an area's risk level, and accuracy is documented.

---

## Module 4: AI Verification, Language & Matching

**Owner:** _Name_
**Goal:** The AI that makes reports trustworthy and messages personal and local.

### Responsibilities
- Photo classifier (pre-trained CNN or fine-tuned model) to verify flood, landslide and fire images and flag fakes
- Duplicate merging of reports from the same place and time
- Alert generator: personal messages by household type (low-lying home, shop, farmer, fisherman, tourist) in English, Konkani, Marathi and Hindi
- Household action plan generator (where to go, what to carry, who to call)
- Need-to-offer matching: connect a household's need to nearby volunteers and resources (boat, vehicle, water tank, spare room)
- Human approval step before official alerts go out

### Deliverables
- Verification, alert and matching services with clear inputs and outputs
- Sample test photos and message examples

### Needs from others
- Risk levels from Module 3, resource and household data from Module 5, hosting from Module 2

### Done when
A report photo is verified or flagged, a correct local-language alert is generated, and a need is matched to a resource.

---

## Module 5: Authority Dashboard, Recovery & Pitch

**Owner:** _Name_
**Goal:** The authority and recovery side, plus the data, documents and presentation.

### Responsibilities
- Authority dashboard: requests and reports with status Open -> Assigned -> Resolved, shelter and resource view
- Volunteer task view
- Recovery tracker: households log damage and needs, volunteers and NGOs pick up tasks
- Learning memory: store each incident (what flooded, what worked, what failed) and a "lessons learned" page
- Data: collect public data, create synthetic households, volunteers and resources, maintain `DATA.md`
- Responsible AI note: privacy, accuracy, human oversight, generative AI tools used
- Submission pack: up to 10 slides, 3-minute demo video, tools/datasets list, implementation plan
- Demo script and rehearsal; Q&A preparation

### Deliverables
- Dashboard and recovery screens
- Complete submission pack by Oct 13

### Needs from others
- APIs from Module 2, screens/UI components from Module 1, results from Module 3

### Done when
The demo runs end to end twice without errors and the full submission pack is ready.

---

## How the modules connect

1. Module 3 predicts risk, Module 4 turns it into personal alerts, Module 2 delivers them.
2. Module 1 shows risk and reports on the live map; Module 4 verifies incoming reports.
3. Module 5's dashboard lets authorities act; recovery data and incidents flow back to Module 3 for retraining.

## Working rules
- Agree on API formats (Module 2) and data schema (Module 5) by **day 2**.
- Short daily check-in: what is done, what is blocked, what is needed from another module.
- Synthetic or public data only. No real citizen data.
- Feature freeze on **Oct 12**; only bug fixes after that.
