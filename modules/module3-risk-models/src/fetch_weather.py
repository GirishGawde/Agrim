import requests
import json
import os
from datetime import datetime

# Set paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'data', 'processed')

# Goa coordinates (Panaji as default)
LATITUDE = 15.4909
LONGITUDE = 73.8278

def fetch_live_weather(lat=LATITUDE, lon=LONGITUDE):
    """
    Fetches live weather data from Open-Meteo API.
    Does not require an API key.
    """
    print(f"Fetching weather forecast for lat: {lat}, lon: {lon}...")
    
    # API Endpoint for Open-Meteo
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation&timezone=auto"
    
    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an exception for bad status codes
        
        data = response.json()
        
        # Save to processed directory for the risk model to use
        output_file = os.path.join(PROCESSED_DATA_DIR, 'live_weather.json')
        os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=4)
            
        print(f"Successfully fetched weather data and saved to {output_file}")
        
        # Display current weather
        current = data.get('current', {})
        print("\nCurrent Weather:")
        print(f"Temperature: {current.get('temperature_2m')}°C")
        print(f"Precipitation: {current.get('precipitation')} mm")
        print(f"Wind Speed: {current.get('wind_speed_10m')} km/h")
        
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch weather data: {e}")
        return None

def main():
    print("Running Live Weather Fetch (Phase 2)...")
    fetch_live_weather()

if __name__ == "__main__":
    main()
