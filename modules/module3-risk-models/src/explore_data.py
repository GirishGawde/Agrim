import pandas as pd
import matplotlib.pyplot as plt
import os
import seaborn as sns

# Set paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data', 'raw')
OUTPUT_DIR = os.path.join(BASE_DIR, 'data', 'processed')

def check_dataset(file_path):
    print(f"--- Exploring: {os.path.basename(file_path)} ---")
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    print("Shape:", df.shape)
    print("\nMissing values:\n", df.isnull().sum())
    print("\nFirst 5 rows:\n", df.head())
    print("-" * 40)
    return df

def generate_plots(df, filename_prefix):
    # Example plot: check distribution of numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns
    for col in numeric_cols:
        plt.figure(figsize=(8, 5))
        sns.histplot(df[col], kde=True)
        plt.title(f'Distribution of {col}')
        plt.xlabel(col)
        plt.ylabel('Frequency')
        
        output_file = os.path.join(OUTPUT_DIR, f"{filename_prefix}_{col}_dist.png")
        plt.savefig(output_file)
        plt.close()
        print(f"Saved plot: {output_file}")

def main():
    # Create directories if they don't exist
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Setup & Data Exploration for Module 3 (Phase 1)")
    
    # Check if there are any CSV files in the raw data directory
    csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]
    
    if not csv_files:
        print(f"No CSV files found in {DATA_DIR}.")
        print("Please place historical and synthetic datasets from Module 5 here.")
        return

    for csv_file in csv_files:
        file_path = os.path.join(DATA_DIR, csv_file)
        df = check_dataset(file_path)
        if df is not None:
            # Generate plots prefixing with filename without extension
            generate_plots(df, os.path.splitext(csv_file)[0])

if __name__ == "__main__":
    main()
