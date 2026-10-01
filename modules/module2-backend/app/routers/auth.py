from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends

from ..core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from ..core.database import get_db

router = APIRouter()

# ── In-memory user store for demo/dev (replace with Supabase auth in prod) ───
_DEMO_USERS = {
    "citizen@demo.goa": {
        "id": "u1",
        "name": "Priya Naik",
        "role": "citizen",
        "hashed_password": None,   # set below
    },
    "volunteer@demo.goa": {
        "id": "u2",
        "name": "Ramesh Dessai",
        "role": "volunteer",
        "hashed_password": None,
    },
    "authority@demo.goa": {
        "id": "u3",
        "name": "Col. Souza",
        "role": "authority",
        "hashed_password": None,
    },
}

# Seed hashed passwords once at import time
_DEMO_PASSWORDS = {
    "citizen@demo.goa": "citizen123",
    "volunteer@demo.goa": "volunteer123",
    "authority@demo.goa": "authority123",
}
for _email, _pw in _DEMO_PASSWORDS.items():
    _DEMO_USERS[_email]["hashed_password"] = hash_password(_pw)


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Standard OAuth2 password flow.
    username = email address, password = demo password.
    Returns a JWT bearer token.
    """
    user = _DEMO_USERS.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    # In production: look up Supabase profiles table by current_user["user_id"]
    for email, u in _DEMO_USERS.items():
        if u["id"] == current_user["user_id"]:
            return {"id": u["id"], "email": email, "name": u["name"], "role": u["role"]}
    return current_user
