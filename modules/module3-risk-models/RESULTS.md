# Model Results & Limitations

This document captures the baseline performance of the Module 3 risk prediction models on synthetic datasets. These metrics should be updated whenever real datasets from Module 5 are integrated and the models are retrained.

## 1. Flood/Waterlogging Risk Model (Random Forest)
- **Features**: Rainfall (mm), Elevation (m), Drainage Capacity (index)
- **Baseline Accuracy**: 91.00%
- **Performance by Class (Precision/Recall)**:
  - **Low Risk**: 0.93 / 0.99
  - **Medium Risk**: 0.81 / 0.46
  - **High Risk**: 0.88 / 0.93
- **Current Limitations**: 
  - Medium risk is currently under-predicted (low recall).
  - Assumes continuous uniform soil drainage capacity which isn't always accurate in real-world scenarios.

## 2. Landslide Risk Model (Random Forest)
- **Features**: Rainfall (mm), Slope (degrees), Soil Type (categorical)
- **Baseline Accuracy**: 97.00%
- **Performance by Class (Precision/Recall)**:
  - **Low Risk**: 0.96 / 1.00
  - **Medium Risk**: 1.00 / 0.89
  - **High Risk**: 1.00 / 1.00
- **Current Limitations**: 
  - Highly dependent on accurate soil type indexing.
  - Does not currently factor in vegetative cover or historical sliding events (needs to be added if Module 5 provides it).

## Core Requirements Check
- [x] **Dynamic Prediction**: Verified that changing the rainfall input dynamically updates the predicted risk level from Low -> Medium -> High in both models. (Confirmed via `predict.py` tests).
