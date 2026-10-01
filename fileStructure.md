# File Structure

One monorepo, one folder per module, plus shared folders. Each member works mainly inside their own module folder, so merge conflicts stay low.

| Module | Owner folder(s) |
|---|---|
| 1. Frontend & Live Hazard Map | `modules/module1-frontend/` |
| 2. Backend, Database & Alert Delivery | `modules/module2-backend/` |
| 3. Risk Prediction Models | `modules/module3-risk-models/` |
| 4. AI Verification, Language & Matching | `modules/module4-ai-services/` |
| 5. Authority Dashboard, Recovery & Pitch | `modules/module5-dashboard-recovery/` and `docs/`, `data/` |

## Complete tree

```
goa-community-resilience/
│
├── README.md                     # project overview, how to run everything
├── modules.md                    # team and module assignment
├── phases.md                     # build plan and dates
├── fileStructure.md              # this file
├── .gitignore
├── .env.example                  # template for keys (never commit real keys)
├── docker-compose.yml            # optional: run all services together
│
├── modules/
│   │
│   ├── module1-frontend/                     # MODULE 1: Frontend & Live Hazard Map
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── icons/                        # hazard and shelter icons
│   │   └── src/
│   │       ├── main.jsx
│   │       ├── App.jsx
│   │       ├── routes.jsx
│   │       ├── pages/
│   │       │   ├── Home.jsx                  # area risk summary + latest alerts
│   │       │   ├── LiveMap.jsx               # live hazard map
│   │       │   ├── ReportHazard.jsx          # citizen report form
│   │       │   ├── Alerts.jsx                # alert feed
│   │       │   ├── SafeRoute.jsx             # route avoiding flooded/blocked roads
│   │       │   └── HouseholdPlan.jsx         # shows the personal action plan
│   │       ├── components/
│   │       │   ├── Map/
│   │       │   │   ├── MapView.jsx
│   │       │   │   ├── RiskLayer.jsx         # heat layer for risk
│   │       │   │   ├── HazardMarkers.jsx     # flood, landslide, fire markers
│   │       │   │   ├── BlockedRoads.jsx
│   │       │   │   └── SheltersLayer.jsx
│   │       │   ├── AlertCard.jsx
│   │       │   ├── LanguageSwitcher.jsx
│   │       │   ├── PhotoUpload.jsx
│   │       │   └── Navbar.jsx
│   │       ├── hooks/
│   │       │   ├── useRealtime.js            # live updates
│   │       │   └── useLocation.js
│   │       ├── services/
│   │       │   └── api.js                    # calls Module 2 backend
│   │       ├── i18n/
│   │       │   ├── en.json
│   │       │   ├── kok.json                  # Konkani
│   │       │   ├── mr.json                   # Marathi
│   │       │   └── hi.json                   # Hindi
│   │       └── styles/
│   │           └── global.css
│   │
│   ├── module2-backend/                      # MODULE 2: Backend, DB & Alert Delivery
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── app/
│   │   │   ├── main.py                       # FastAPI entry point
│   │   │   ├── config.py
│   │   │   ├── routers/
│   │   │   │   ├── risk.py                   # /risk (calls Module 3)
│   │   │   │   ├── reports.py                # /reports
│   │   │   │   ├── alerts.py                 # /alerts
│   │   │   │   ├── routing.py                # /route
│   │   │   │   ├── resources.py              # /resources
│   │   │   │   ├── households.py             # /households
│   │   │   │   ├── incidents.py              # /incidents
│   │   │   │   └── auth.py
│   │   │   ├── services/
│   │   │   │   ├── alert_delivery.py         # in-app, WhatsApp/SMS link, relay
│   │   │   │   ├── routing_service.py        # OSM routing + blocked-road overlay
│   │   │   │   ├── realtime.py
│   │   │   │   └── ai_client.py              # calls Modules 3 and 4
│   │   │   ├── models/                       # database models/schemas
│   │   │   │   ├── area.py
│   │   │   │   ├── report.py
│   │   │   │   ├── alert.py
│   │   │   │   ├── household.py
│   │   │   │   ├── resource.py
│   │   │   │   └── incident.py
│   │   │   └── core/
│   │   │       ├── security.py               # roles: citizen, volunteer, authority
│   │   │       └── database.py
│   │   ├── supabase/
│   │   │   ├── schema.sql                    # all tables
│   │   │   └── seed.sql                      # synthetic starter data
│   │   ├── tests/
│   │   │   └── test_api.py
│   │   └── API.md                            # API list shared with the team
│   │
│   ├── module3-risk-models/                  # MODULE 3: Risk Prediction Models
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── data/
│   │   │   ├── raw/                          # downloaded public datasets
│   │   │   ├── processed/                    # cleaned training data
│   │   │   └── README.md                     # source of every dataset
│   │   ├── notebooks/
│   │   │   ├── 01_explore_data.ipynb
│   │   │   ├── 02_flood_model.ipynb
│   │   │   ├── 03_landslide_model.ipynb
│   │   │   └── 04_fire_or_heat_model.ipynb
│   │   ├── src/
│   │   │   ├── features.py                   # feature building
│   │   │   ├── fetch_weather.py              # Open-Meteo live forecast
│   │   │   ├── train_flood.py
│   │   │   ├── train_landslide.py
│   │   │   ├── train_fire_heat.py
│   │   │   ├── predict.py                    # returns Low/Medium/High + reason
│   │   │   ├── retrain.py                    # retrain using saved incidents
│   │   │   └── api.py                        # /risk service
│   │   ├── models/                           # saved trained models (.pkl/.joblib)
│   │   ├── RESULTS.md                        # accuracy, precision/recall, limits
│   │   └── tests/
│   │
│   ├── module4-ai-services/                  # MODULE 4: AI Verification, Language & Matching
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── vision/
│   │   │   ├── classify_photo.py             # flood / landslide / fire / fake
│   │   │   ├── train_classifier.py
│   │   │   ├── duplicate_merge.py            # merge reports by place and time
│   │   │   └── sample_photos/                # test images only
│   │   ├── language/
│   │   │   ├── alert_generator.py            # personal alerts by household type
│   │   │   ├── translate.py                  # English, Konkani, Marathi, Hindi
│   │   │   ├── plan_generator.py             # household action plan
│   │   │   └── prompts/                      # prompt templates (disclose gen-AI use)
│   │   ├── matching/
│   │   │   └── need_offer_match.py           # match needs to nearby resources
│   │   ├── approval/
│   │   │   └── human_approval.py             # authority approves official alerts
│   │   ├── api.py                            # service endpoints
│   │   ├── tests/
│   │   └── README.md
│   │
│   └── module5-dashboard-recovery/           # MODULE 5: Authority Dashboard, Recovery & Pitch
│       ├── package.json
│       └── src/
│           ├── pages/
│           │   ├── AuthorityDashboard.jsx    # requests: Open → Assigned → Resolved
│           │   ├── VolunteerTasks.jsx
│           │   ├── ShelterResources.jsx
│           │   ├── RecoveryTracker.jsx       # damage and needs after event
│           │   ├── LessonsLearned.jsx        # learning memory
│           │   └── AlertApproval.jsx
│           ├── components/
│           │   ├── StatusBoard.jsx
│           │   ├── RequestTable.jsx
│           │   └── IncidentTimeline.jsx
│           └── services/
│               └── api.js
│
├── data/                                     # shared data (MODULE 5)
│   ├── synthetic/
│   │   ├── households.csv                    # fake households, no real people
│   │   ├── volunteers.csv
│   │   ├── resources.csv                     # boats, vehicles, tanks, rooms
│   │   └── past_incidents.csv
│   ├── public/
│   │   ├── goa_areas.geojson                 # wards/villages for demo areas
│   │   ├── shelters.geojson
│   │   └── roads_osm.geojson
│   └── DATA.md                               # every source: public / synthetic / anonymised
│
├── docs/                                     # MODULE 5: documents and submission
│   ├── problem_statement.docx
│   ├── proposed_solution.docx
│   ├── responsible_ai.md                     # privacy, accuracy, human oversight
│   ├── ai_tools_used.md                      # disclose generative AI use
│   ├── implementation_plan.md                # pilot → SDMA, panchayats, IMD Goa
│   ├── architecture.png                      # system diagram
│   ├── slides/
│   │   └── submission_10_slides.pptx
│   ├── demo/
│   │   ├── demo_script.md
│   │   ├── demo_video.mp4                    # 3 minutes or less
│   │   └── qa_prep.md                        # likely judge questions
│   └── tools_datasets_list.md
│
├── shared/
│   ├── api_contract.md                       # request/response formats all modules follow
│   └── constants.json                        # hazard types, risk levels, languages
│
└── scripts/
    ├── setup.sh                              # install everything
    ├── run_all.sh                            # start all services
    └── seed_demo.sh                          # load synthetic demo data
```

## Ownership rules
- Edit only your own module folder. If you need a change elsewhere, ask the owner or raise a pull request.
- Shared files (`shared/`, `data/`, `docs/`) are owned by Module 5, but everyone can add to `api_contract.md` and `DATA.md`.
- Agree on `shared/api_contract.md` and `supabase/schema.sql` by day 2.

## Git workflow
- Branches: `main` (always working demo), `dev`, and one branch per module, e.g. `module3/flood-model`.
- Merge to `dev` daily; merge `dev` to `main` only after a quick demo check.
- Never commit `.env` files, real keys, large raw datasets, or any real personal data.

## How services talk to each other
```
Module 1 frontend ──┐
Module 5 dashboard ─┼──► Module 2 backend ──► Module 3 risk models
                    │            │
                    │            └──────────► Module 4 AI services
                    └──── realtime updates ◄── Supabase database
```
