from pydantic import BaseModel, ConfigDict
from typing import Optional


class ResourceBase(BaseModel):
    type: str               # boat | vehicle | water_tank | spare_room | medical
    provider_contact: str
    location: str
    area_id: Optional[int] = None
    available: bool = True
    capacity: Optional[int] = None  # e.g. number of people a boat can carry


class Resource(ResourceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

