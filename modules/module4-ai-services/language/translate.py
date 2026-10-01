def translate_message(message: str, target_language: str) -> str:
    """
    Translate the alert message into the target language.
    Supported: en, kok, mr, hi
    """
    target = target_language.lower()
    if target == "en":
        return message
    elif target == "kok":
        return f"[Konkani Translation] {message}"
    elif target == "mr":
        return f"[Marathi Translation] {message}"
    elif target == "hi":
        return f"[Hindi Translation] {message}"
    
    return message
