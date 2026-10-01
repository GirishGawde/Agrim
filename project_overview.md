# [Project Name]: AI Platform for Disaster Warning, Live Hazard Mapping and Community Resilience in Goa

**Hackathon:** Sankalp Setu, Student AI Hackathon (Goa University)
**Theme:** Safety, Disaster Management & Community Resilience

---

## 1. Problem Statement

Goa is exposed to many kinds of disasters: floods and waterlogging, landslides, forest and scrub fires, cyclones and storm surges, sea erosion, lightning, heat and water shortage in dry years, along with fires and accidents in dense towns and tourist areas. These events often overlap, and as the monsoon becomes more erratic, from the heavy rain of 2023 and 2024 to the weak monsoon of 2026, they are harder to predict. Yet the systems meant to handle them fall short at three stages.

### 1.1 Early warning does not reach people in time
Warnings are issued for a whole district or taluka, not for a village, ward or street. Residents cannot tell whether their own area is at risk, how serious it is, or what to do about it. Even when an alert exists, there is no dependable way to deliver it quickly to every person, including fishermen, farmers, shopkeepers, tourists and families in remote or low-connectivity areas. Many people learn about a disaster only when it has already reached them.

### 1.2 There is no live picture of what is happening on the ground
During a disaster there is no single live map or heatmap showing which areas are flooded or waterlogged, where a landslide has blocked a road, where a forest fire is spreading, or which routes are still safe. People and responders rely on scattered phone calls, social media posts and guesswork, so they often drive into flooded roads, take blocked routes, or cannot tell where help is needed first.

### 1.3 Communities are not able to recover and learn
After a disaster, there is little structured effort to help affected families and neighbourhoods stand up again. What happened, which areas were hit, what worked, and what failed is rarely recorded in one place. Local knowledge such as which lanes flood first, which slopes are unstable, and who has boats, vehicles or shelter space stays in people's memories and fades, so the same damage and confusion repeat in the next disaster and communities do not become stronger over time.

Together, these gaps mean Goa's communities face every disaster with late and generic warnings, no live view of the situation, and no lasting memory of what they have been through.

---

## 2. Proposed Solution

One platform with three layers, each built to fix one of the three gaps above.

### 2.1 Layer 1: AI Early Warning (fixes gap 1.1)

**Prediction**
Models forecast risk for each village or ward and each hazard, using rainfall forecasts, river and tide levels, terrain and slope, soil, and past incidents.
- Flood and waterlogging, landslide: XGBoost or Random Forest
- Forest fire: model on temperature, humidity, wind and length of dry spell
- Heat and water shortage: rainfall deficit and temperature trends

Each area gets a Low, Medium or High level with a short reason, for example "200 mm forecast in 24 hours, low-lying ward".

**Delivery**
- Alerts in English, Konkani, Marathi and Hindi through the web app and WhatsApp or SMS share links
- Messages are written per person: "Your street: High flood risk. Move vehicles. Nearest shelter: X, 1.2 km."
- Fishermen get sea alerts; farmers get crop and cattle advice; tourists get simple area guidance
- Low connectivity: lightweight pages, plus a neighbour relay where volunteers forward alerts to households without signal
- A human authority approves official alerts before they go out

### 2.2 Layer 2: Live Hazard Map (fixes gap 1.2)
- **Live map** with heat layers for flooding and waterlogging, landslides, fires and blocked roads
- **Data sources:** AI-predicted risk, weather and satellite feeds (for example NASA FIRMS for fires), and citizen photo reports
- **Photo verification:** an image classifier checks whether an uploaded photo really shows flooding, a landslide or fire, and duplicate reports are merged, which filters fake and repeated reports
- **Safe routes:** route suggestions avoid flooded or blocked roads and show shelters, hospitals and relief points
- **Authority dashboard:** one view of requests, resources and status (Open, Assigned, Resolved)

### 2.3 Layer 3: Recovery and Learning (fixes gap 1.3)
- **Household plan:** each household gets a personal action plan (where to go, what to carry, who to call) based on its risk
- **Community resource map:** neighbours list what they can offer, such as a boat, vehicle, water tank, spare room or first-aid skills, and the system matches offers to needs
- **Recovery tracker:** affected households log damage and needs, and volunteers and NGOs pick up tasks
- **Learning memory:** after every event the system stores what flooded, what worked and what failed. This data retrains the models so predictions improve each season

### 2.4 How it flows
1. Forecast shows heavy rain and the model flags Ward X as High risk.
2. Alerts go out in the local language with a personal plan.
3. The live map shows a flooded lane and a blocked road, and suggests a safe route.
4. Volunteers are matched to households that need help.
5. After the event, damage and lessons are saved and the model is retrained.

### 2.5 Use of AI (why AI is needed)
| Task | AI used | Why not a simple rule |
|---|---|---|
| Neighbourhood risk prediction | Gradient boosting / Random Forest | Risk depends on many interacting factors (rain, terrain, soil, history) |
| Photo verification | Image classification (CNN) | Filters fake and irrelevant reports at scale |
| Personal local-language alerts and plans | Language model with strict templates | One message cannot fit every household type and language |
| Need-to-resource matching | Matching algorithm | Fast pairing of needs to the nearest suitable help |
| Learning from incidents | Model retraining | Predictions improve with each event |

### 2.6 Responsible AI
- **Privacy:** only public, synthetic or anonymised data; no real citizen data
- **Honest accuracy:** model accuracy, precision/recall and limitations are reported openly
- **Human oversight:** official alerts need authority approval; AI supports, it does not replace decisions
- **Fairness and access:** multi-language alerts and a low-bandwidth mode so remote and less digitally connected people are not left out
- **Disclosure:** use of generative AI tools is stated in the submission

### 2.7 Impact
- Earlier, area-specific warnings people can act on
- Fewer people entering flooded or blocked routes, and faster response to real needs
- Neighbours and local resources become the first line of help
- Each disaster leaves the community and the models better prepared for the next

### 2.8 Feasibility and Scalability
- **Prototype scope:** two or three hazards end to end (flood and waterlogging, landslide, and one of fire or heat) for one or two real Goa areas, such as Patto-Panaji. Other hazards are shown as the roadmap.
- **Pilot:** one village or municipality
- **Scale-up:** integrate with the Goa State Disaster Management Authority, panchayats and IMD Goa, then extend to all talukas and other hazards
- **Low cost:** built on open-source tools and free data sources

---

## 3. Tech Stack

### 3.1 Frontend (citizen app and dashboards)
| Purpose | Technology |
|---|---|
| Framework | React with Vite |
| Maps | Leaflet with OpenStreetMap tiles |
| Styling | Tailwind CSS |
| Languages | i18n (English, Konkani, Marathi, Hindi) |
| Realtime updates | Supabase Realtime (or Firebase) |
| Hosting | Vercel |

### 3.2 Backend and database
| Purpose | Technology |
|---|---|
| API | Python FastAPI |
| Database and auth | Supabase (PostgreSQL) or Firebase |
| Geospatial queries | PostGIS (Supabase extension) |
| Routing | OpenStreetMap data with OSRM or OpenRouteService, plus blocked-road overlay |
| Alert delivery | In-app, WhatsApp/SMS share links (Twilio optional) |
| Hosting | Render |

### 3.3 AI and machine learning
| Purpose | Technology |
|---|---|
| Risk models | scikit-learn, XGBoost |
| Data handling | pandas, NumPy, GeoPandas |
| Photo verification | PyTorch or TensorFlow with a pre-trained CNN (e.g. MobileNet/ResNet) fine-tuned on flood, landslide and fire images |
| Language alerts and plans | LLM API with strict templates, or open-source models, with translation support |
| Model saving | joblib |
| Experiments | Jupyter notebooks |

### 3.4 Data sources
| Data | Source |
|---|---|
| Rainfall and weather forecast | Open-Meteo API |
| Rainfall and past events | IMD data, Goa SDMA reports, news archives |
| River and water levels | India-WRIS (where available) |
| Terrain, roads, shelters | OpenStreetMap, SRTM elevation data |
| Fire hotspots | NASA FIRMS |
| Photos for classifier | Public datasets (e.g. Kaggle) |
| Households, volunteers, resources | **Synthetic data only** |

### 3.5 DevOps and tools
| Purpose | Technology |
|---|---|
| Version control | Git and GitHub (monorepo) |
| Containers (optional) | Docker |
| Testing | pytest (backend and models), React Testing Library |
| Design | Figma |
| Docs | Markdown, Word, PowerPoint |

### 3.6 Architecture overview
```
Citizen app (React)      Authority dashboard (React)
        \                       /
         \                     /
          ──►  FastAPI backend  ◄──►  Supabase (DB, auth, realtime)
                  |        |
                  |        └──►  AI services (photo check, alerts, matching)
                  |
                  └──►  Risk models (flood, landslide, fire/heat)
                               ▲
              Open-Meteo, IMD, OSM, NASA FIRMS, synthetic data
```

---

## 4. Team and Modules

| # | Module |
|---|---|
| 1 | Frontend and Live Hazard Map |
| 2 | Backend, Database and Alert Delivery |
| 3 | Risk Prediction Models |
| 4 | AI Verification, Language and Matching |
| 5 | Authority Dashboard, Recovery and Pitch |

See `modules.md`, `phases.md` and `fileStructure.md` for details.
