from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ReportBase(BaseModel):
    type: str                          # flood | landslide | fire | other
    location: str                      # human-readable place name
    area_id: Optional[int] = None      # FK to areas table
    status: str = "Open"               # Open | Assigned | Resolved
    photo_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None


class Report(ReportBase):
    id: int
    created_at: Optional[datetime] = None
    verified: bool = False             # set to True after Module 4 AI verification

    model_config = ConfigDict(from_attributes=True)

