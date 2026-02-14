# models.py - Pydantic models for request/response validation
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# User models
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str

# Profile models
class ProfileCreate(BaseModel):
    photography_type: str
    city: str
    experience_years: int
    skills: List[str]
    contact_number: str

class ProfileUpdate(BaseModel):
    photography_type: Optional[str] = None
    city: Optional[str] = None
    experience_years: Optional[int] = None
    skills: Optional[List[str]] = None
    contact_number: Optional[str] = None
    available: Optional[bool] = None

class ProfileResponse(BaseModel):
    id: str
    user_id: str
    name: str
    email: str
    photography_type: str
    city: str
    experience_years: int
    skills: List[str]
    work_photos: List[str]
    contact_number: str
    available: bool
    created_at: str

# Token models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

