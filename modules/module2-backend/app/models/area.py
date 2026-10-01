from pydantic import BaseModel, ConfigDict

class AreaBase(BaseModel):
    name: str
    risk_level: str
    reason: str

class Area(AreaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
