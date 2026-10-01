from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class AlertBase(BaseModel):
    area_id: int
    message: str
    language: str = "en"               # en | kok | mr | hi
    hazard_type: Optional[str] = None  # flood | landslide | fire
    status: str = "Pending"            # Pending | Approved | Sent


class Alert(AlertBase):
    id: int
    created_at: Optional[datetime] = None
    whatsapp_link: Optional[str] = None  # generated share link

    model_config = ConfigDict(from_attributes=True)

