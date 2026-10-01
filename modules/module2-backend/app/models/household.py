from pydantic import BaseModel, ConfigDict
from typing import Optional


class HouseholdBase(BaseModel):
    address: str
    type: str              # low-lying | farmer | fisherman | shop | tourist
    contact: str           # primary phone / WhatsApp number
    area_id: Optional[int] = None
    language: str = "en"   # preferred alert language


class Household(HouseholdBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

