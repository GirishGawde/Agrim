def generate_action_plan(household_type: str, hazard_type: str, risk_level: str) -> dict:
    """
    Generate household action plans (where to go, what to carry, who to call).
    """
    plan = {
        "where_to_go": "Local community shelter",
        "what_to_carry": ["Emergency kit", "Important documents", "Water", "Flashlight"],
        "who_to_call": ["Local Emergency Services (112)", "Designated family contact"]
    }
    
    if "flood" in hazard_type.lower():
        plan["where_to_go"] = "Higher ground or designated high-altitude shelter"
        plan["what_to_carry"].append("Waterproof bags")
    elif "fire" in hazard_type.lower():
        plan["what_to_carry"].append("N95 Masks")
        
    return plan
