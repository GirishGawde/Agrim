import random

def classify_image(image_path: str) -> dict:
    """
    Mock classifier to verify flood, landslide, fire images, and flag fakes.
    """
    categories = ["flood", "landslide", "fire", "fake", "unrelated"]
    
    if "flood" in image_path.lower():
        predicted = "flood"
        confidence = 0.92
    elif "land" in image_path.lower() or "slide" in image_path.lower():
        predicted = "landslide"
        confidence = 0.88
    elif "fire" in image_path.lower():
        predicted = "fire"
        confidence = 0.95
    else:
        predicted = random.choice(categories)
        confidence = round(random.uniform(0.6, 0.99), 2)
        
    is_valid = predicted in ["flood", "landslide", "fire"]
    
    return {
        "category": predicted,
        "confidence": confidence,
        "is_valid": is_valid
    }
