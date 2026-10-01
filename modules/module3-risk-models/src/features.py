import pandas as pd
import os

# Set paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DATA_DIR = os.path.join(BASE_DIR, 'data', 'raw')
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'data', 'processed')

def create_features(input_filename, output_filename):
    """
    Reads raw data and engineers features for the ML models.
    """
    input_path = os.path.join(RAW_DATA_DIR, input_filename)
    output_path = os.path.join(PROCESSED_DATA_DIR, output_filename)
    
    if not os.path.exists(input_path):
        print(f"Warning: Raw data file {input_path} not found. Skipping feature engineering.")
        return
        
    print(f"Building features from {input_filename}...")
    df = pd.read_csv(input_path)
    
    # ----------------------------------------------------
    # FEATURE ENGINEERING LOGIC GOES HERE
    # ----------------------------------------------------
    
    # 1. Handle missing values
    # e.g., df.fillna(0, inplace=True)
    
    # 2. Create new features (e.g., categorizing rainfall, combining slope and soil)
    # if 'rainfall_mm' in df.columns:
    #     df['heavy_rain'] = (df['rainfall_mm'] > 50).astype(int)
        
    # 3. Drop columns that shouldn't be used for training
    # df.drop(columns=['id', 'date'], inplace=True, errors='ignore')
    
    # Save the processed features
    df.to_csv(output_path, index=False)
    print(f"Successfully saved features to {output_path}")

def main():
    print("Running Feature Engineering (Phase 2)...")
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    
    # Example usage:
    # This expects a 'historical_events.csv' from Module 5
    create_features('historical_events.csv', 'training_features.csv')

if __name__ == "__main__":
    main()
