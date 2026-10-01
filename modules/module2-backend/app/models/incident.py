from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class IncidentBase(BaseModel):
    description: str
    lessons_learned: Optional[str] = None
    area_id: Optional[int] = None
    hazard_type: Optional[str] = None  # flood | landslide | fire
    date: Optional[str] = None         # ISO date string; defaults to now if omitted


class Incident(IncidentBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

