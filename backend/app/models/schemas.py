from pydantic import BaseModel, Field
from typing import Optional

try:
    from pydantic import EmailStr
except ImportError:
    EmailStr = str

class LeadCreateSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=8, max_length=20)
    email: Optional[EmailStr] = None
    plot_size: Optional[float] = None
    budget_range: Optional[str] = None
    location: Optional[str] = None
    project_type: Optional[str] = None
    message: Optional[str] = None

class TestimonialCreateSchema(BaseModel):
    client_name: str = Field(..., min_length=2, max_length=100)
    rating: int = Field(..., ge=1, le=5)
    quote: str = Field(..., min_length=10, max_length=500)
    project_id: Optional[str] = None
