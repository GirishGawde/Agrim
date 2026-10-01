from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, risk, reports, alerts, routing, resources, households, incidents

app = FastAPI(
    title="Goa Community Resilience API",
    description="Backend API for Disaster Warning and Hazard Mapping",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(risk.router, prefix="/risk", tags=["Risk"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(routing.router, prefix="/route", tags=["Routing"])
app.include_router(resources.router, prefix="/resources", tags=["Resources"])
app.include_router(households.router, prefix="/households", tags=["Households"])
app.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Goa Community Resilience API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
