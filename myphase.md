# Phases for Module 3: Risk Prediction Models

## Phase 1: Setup & Data Exploration
- **Goal**: Understand the data provided by Module 5.
- **Tasks**:
  - Receive historical data and synthetic events from Module 5.
  - Create `explore_data.py` to perform a quick check of the datasets (check shape, missing values).
  - Generate simple plots and save them as images.

## Phase 2: Feature Engineering & Live Data
- **Goal**: Prepare inputs for the machine learning models.
- **Tasks**:
  - Create `features.py` to build the required model inputs (e.g., rainfall, elevation, slope, soil, past events).
  - Create `fetch_weather.py` to pull live weather forecasts from Open-Meteo.

## Phase 3: Model Training
- **Goal**: Train the core risk prediction models and save them.
- **Tasks**:
  - Create `train_flood.py` to build a flood/waterlogging model (using XGBoost or Random Forest).
  - Create `train_landslide.py` to build a landslide model (using rainfall, slope, and soil).
  - *(Optional)* Create `train_fire_heat.py` for forest fire or heat/water shortage.
  - Save all trained models as `.joblib` in the `models/` directory.

## Phase 4: Prediction & Service Setup
- **Goal**: Serve the model predictions to the rest of the application.
- **Tasks**:
  - Create `predict.py` to output Low / Medium / High risk levels with a short reason per area.
  - Create `api.py` to expose a small `/risk` service endpoint that the backend (Module 2) can call.

## Phase 5: Evaluation & Iteration
- **Goal**: Document performance and handle future data.
- **Tasks**:
  - Record the model's accuracy, precision/recall, and limitations in `ml/RESULTS.md`.
  - Ensure that the requirement is met: Changing the rainfall input successfully changes an area's risk level.
  - *(Optional)* Create `retrain.py` for retraining the model as new incident data flows back from Module 5.
