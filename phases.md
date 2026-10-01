# Build Plan: Community Disaster Platform (Goa)

Key dates: cluster showcase Oct 5, mentor review Oct 13, submission check Oct 14, evaluation Oct 15-16, finale Oct 22-23.

| Phase | Focus | Dates |
|---|---|---|
| 1 | Foundation & Data | Oct 1-4 |
| 2 | AI Early Warning | Oct 3-8 |
| 3 | Live Hazard Map | Oct 6-10 |
| 4 | Recovery & Learning | Oct 9-12 |
| 5 | Polish, Demo & Submission | Oct 12-14 |

---

## Phase 1: Foundation & Data

**Goal:** Set up the project, pick the demo area, and get usable (synthetic/public) data.
**Timeline:** Oct 1-4 (before the Oct 5 cluster showcase)
**Judging link:** Prototype & feasibility (25), Responsible AI (10)

### Tasks
- [ ] Create GitHub repo with `/frontend`, `/backend`, `/ml`, `/data`, `/docs`
- [ ] Set up React + Leaflet/OpenStreetMap app shell
- [ ] Set up Supabase (or Firebase) project: tables for `areas`, `alerts`, `reports`, `households`, `resources`, `incidents`
- [ ] Set up FastAPI backend with a health-check endpoint
- [ ] Choose the demo areas (e.g. Patto-Panaji + one hill-slope or coastal village)
- [ ] Collect public data: Open-Meteo rainfall/forecast, OSM roads and terrain, past Goa flood/landslide/fire events (news, IMD, SDMA)
- [ ] Generate **synthetic** households, volunteers and resources for the demo area
- [ ] Write a one-page `DATA.md` listing every source and whether it is public, synthetic or anonymised

### Rules to follow from day one
- No real citizen data anywhere in the repo
- Keep a log of where generative AI tools were used (needed for submission)

### Done when
- Map loads with the demo area, backend responds, database has synthetic data, and the team can run everything locally.

### Suggested owners
Frontend: Person 1 | Backend/DB: Person 2 | Data: Person 5 | ML: Persons 3-4 (start exploring datasets)

---

## Phase 2: AI Early Warning (Layer 1)

**Goal:** Predict neighbourhood-level risk and deliver clear alerts.
**Timeline:** Oct 3-8
**Judging link:** Innovation & use of AI (20), Prototype (25)

### Tasks
#### Prediction models (build 2-3 hazards, not all)
- [ ] Flood/waterlogging risk: XGBoost/Random Forest on rainfall, elevation, past events
- [ ] Landslide risk: rainfall + slope + soil
- [ ] One of: forest fire risk (temp, humidity, wind, dry-spell) or heat/water shortage (rainfall deficit)
- [ ] Output per area: Low / Medium / High + a short reason
- [ ] Record accuracy, precision/recall and limitations in `ml/RESULTS.md` (be honest)

#### Serving
- [ ] FastAPI endpoint `/risk?area=...` that pulls live Open-Meteo forecast and returns risk
- [ ] Store risk results in the database for the map

#### Alerts
- [ ] Alert generator: personal, plain-language message per household type (low-lying home, shop, farmer, fisherman, tourist)
- [ ] Languages: English, Konkani, Marathi, Hindi (start with English + Konkani)
- [ ] Delivery: in-app alerts first; WhatsApp/SMS share link as a simple extra
- [ ] Admin approval step before an official alert is sent (human in the loop)

### Done when
- Changing the rainfall input changes the area's risk level, and a correct local-language alert appears for a chosen household.

---

## Phase 3: Live Hazard Map (Layer 2)

**Goal:** One live map showing what is happening on the ground, with safe routes.
**Timeline:** Oct 6-10
**Judging link:** Prototype & feasibility (25), Public-service relevance (25)

### Tasks
- [ ] Heat layers on the map: flood/waterlogging, landslide, fire, blocked roads
- [ ] Colour-coded risk areas from Phase 2 models
- [ ] Citizen report form: hazard type, photo, location pin (use sample/test photos only)
- [ ] Image classifier (CNN or pre-trained model) to verify flood / landslide / fire photos and flag fake or duplicate reports
- [ ] Duplicate merging: group reports from the same place and time
- [ ] Safe-route suggestion that avoids flooded/blocked roads (OSM routing + blocked-road overlay)
- [ ] Show shelters, hospitals and relief points on the map
- [ ] Authority dashboard: list of reports/requests with status Open -> Assigned -> Resolved
- [ ] Live updates (Supabase realtime or polling) so the map changes without refresh

### Done when
- Submitting a report shows up on the map, gets verified or flagged, a blocked road changes the suggested route, and the dashboard can resolve it.

---

## Phase 4: Recovery & Learning (Layer 3)

**Goal:** Help communities stand up again and learn from every disaster.
**Timeline:** Oct 9-12
**Judging link:** Scalability & adoption (15), Public-service relevance (25)

### Tasks
- [ ] Household plan page: where to go, what to carry, who to call, based on that household's risk
- [ ] Community resource map: neighbours list boats, vehicles, water tanks, spare rooms, first-aid skills (synthetic data for demo)
- [ ] Need-to-offer matching: match a household's need to a nearby resource/volunteer
- [ ] Recovery tracker: log damage and needs after an event; volunteers/NGOs pick up tasks
- [ ] Learning memory: save each incident (what flooded, what worked, what failed) to the `incidents` table
- [ ] Retraining hook: a script that uses saved incidents to retrain/update the risk model
- [ ] Simple "lessons learned" summary page for the authority

### Done when
- After a simulated event, damage is logged, volunteers are matched, the incident is stored, and the model can be retrained with it.

---

## Phase 5: Polish, Responsible AI, Demo & Submission

**Goal:** Turn the prototype into a clear, reliable demo and a complete submission pack.
**Timeline:** Oct 12-14 (mentor review Oct 13, compliance check Oct 14)
**Judging link:** Presentation (5), Responsible AI (10), everything else

### Tasks
#### Stabilise
- [ ] Freeze features; fix bugs only
- [ ] Prepare a fixed demo scenario for one area (see flow below)
- [ ] Record a backup demo video of 3 minutes or less

#### Responsible AI
- [ ] Privacy note: synthetic/public/anonymised data only
- [ ] Model accuracy and limitations stated honestly
- [ ] Human approval for official alerts
- [ ] List of generative AI tools used

#### Submission pack (all required items)
- [ ] Presentation of up to 10 slides covering: problem, users affected, solution, AI use, demo, impact, feasibility, responsible AI, implementation plan, team
- [ ] Working prototype link or demo video (3 min max)
- [ ] List of tools, datasets and libraries used
- [ ] Implementation plan: pilot with one village/municipality, then Goa SDMA, panchayats and IMD Goa

### Demo flow (5 minutes)
1. Forecast shows heavy rain; model flags Ward X as High risk
2. Personal alert in Konkani goes to a household
3. Citizen reports a flooded lane; map updates and route changes
4. Authority assigns a volunteer; household gets help
5. Incident is saved; model is retrained with the lesson

### Team roles for the pitch
One person per gap: Warning | Live map | Recovery and learning | Demo driver | Q&A and impact

### Done when
- The demo runs end to end twice without errors, the slides and video are ready, and the team can answer "how accurate is it?" and "what if the internet is down?"
