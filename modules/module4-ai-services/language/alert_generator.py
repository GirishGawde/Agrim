def generate_alert(household_type: str, hazard_type: str, risk_level: str, reason: str) -> str:
    """
    Generate personalized messages tailored by household type.
    """
    base_message = f"ALERT: {risk_level} {hazard_type} risk detected due to {reason}."
    
    specific_advice = ""
    household = household_type.lower()
    
    if "low-lying" in household or "home" in household:
        specific_advice = "Please move valuables to higher ground and prepare for possible evacuation."
    elif "shop" in household:
        specific_advice = "Secure your merchandise above ground level and switch off main electricals."
    elif "farmer" in household:
        specific_advice = "Move livestock to safe areas and secure farming equipment."
    elif "fisherman" in household:
        specific_advice = "Do not venture into the sea. Secure your boats and nets."
    elif "tourist" in household:
        specific_advice = "Stay indoors and follow local authority guidance. Do not visit affected areas."
    else:
        specific_advice = "Please stay alert and safe."

    return f"{base_message} {specific_advice}"
