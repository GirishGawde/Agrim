from typing import List, Dict, Any

def match_needs(need: str, location_lat: float, location_lng: float, available_resources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Connect a household's specific needs to nearby volunteers and resources.
    """
    matched = []
    
    for resource in available_resources:
        # Simplistic keyword matching
        res_type = resource.get("type", "").lower()
        res_desc = resource.get("description", "").lower()
        
        if need.lower() in res_type or need.lower() in res_desc:
            # Mock distance calculation
            resource_copy = resource.copy()
            resource_copy["estimated_distance_km"] = 1.2
            matched.append(resource_copy)
            
    return matched
