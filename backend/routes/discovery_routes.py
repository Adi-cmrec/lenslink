# routes/discovery_routes.py - Discovery and search endpoints
from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional, List
from models import ProfileResponse
from database import get_db
from bson import ObjectId

router = APIRouter()

@router.get("/photographers", response_model=List[ProfileResponse])
def get_photographers(
    city: Optional[str] = Query(None, description="Filter by city"),
    type: Optional[str] = Query(None, description="Filter by photography type")
):
    """Get list of all photographers with optional filters"""
    db = get_db()
    
    # Build filter query
    query = {}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}  # Case-insensitive search
    if type:
        query["photography_type"] = {"$regex": type, "$options": "i"}
    
    # Get profiles
    profiles = list(db.photographer_profiles.find(query))
    
    # Enrich with user data
    photographers = []
    for profile in profiles:
        user = db.users.find_one({"_id": profile["user_id"]})
        if user:
            photographers.append(ProfileResponse(
                id=str(profile["_id"]),
                user_id=str(profile["user_id"]),
                name=user["name"],
                email=user["email"],
                photography_type=profile["photography_type"],
                city=profile["city"],
                experience_years=profile["experience_years"],
                skills=profile["skills"],
                work_photos=profile.get("work_photos", []),
                contact_number=profile["contact_number"],
                available=profile["available"],
                created_at=str(profile.get("created_at", ""))
            ))
    
    return photographers

@router.get("/photographer/{photographer_id}", response_model=ProfileResponse)
def get_photographer_detail(photographer_id: str):
    """Get detailed photographer profile by ID"""
    db = get_db()
    
    try:
        profile = db.photographer_profiles.find_one({"_id": ObjectId(photographer_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid photographer ID"
        )
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photographer not found"
        )
    
    user = db.users.find_one({"_id": profile["user_id"]})
    
    return ProfileResponse(
        id=str(profile["_id"]),
        user_id=str(profile["user_id"]),
        name=user["name"],
        email=user["email"],
        photography_type=profile["photography_type"],
        city=profile["city"],
        experience_years=profile["experience_years"],
        skills=profile["skills"],
        work_photos=profile.get("work_photos", []),
        contact_number=profile["contact_number"],
        available=profile["available"],
        created_at=str(profile.get("created_at", ""))
    )

