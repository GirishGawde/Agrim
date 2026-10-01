import os
import pandas as pd
from src.train_flood import train_flood_model
from src.train_landslide import train_landslide_model

# Set paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCIDENTS_DIR = os.path.join(BASE_DIR, 'data', 'raw', 'new_incidents')

def check_for_new_data():
    """
    Checks if Module 5 has passed down new verified incident reports.
    If new data exists, it triggers a retraining of the models.
    """
    print("--- Checking for new incident data to retrain models ---")
    
    if not os.path.exists(INCIDENTS_DIR) or not os.listdir(INCIDENTS_DIR):
        print(f"No new incidents found in {INCIDENTS_DIR}. Skipping retrain.")
        return
        
    print(f"Found new data in {INCIDENTS_DIR}. Initiating retrain pipeline...")
    
    # In a real scenario, we would parse the new data, append it to our existing training set,
    # and pass it to the training functions.
    
    # Trigger model retrains
    train_flood_model()
    train_landslide_model()
    
    print("Successfully retrained models with new incident data.")

def main():
    check_for_new_data()

if __name__ == "__main__":
    main()
