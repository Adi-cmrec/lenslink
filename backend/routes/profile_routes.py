# routes/profile_routes.py - Profile management endpoints
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List
from models import ProfileCreate, ProfileUpdate, ProfileResponse
from auth import get_current_user
from database import get_db
from bson import ObjectId
import os
import uuid

router = APIRouter()

@router.post("", status_code=status.HTTP_201_CREATED)
def create_profile(profile_data: ProfileCreate, current_user: dict = Depends(get_current_user)):
    """Create photographer profile"""
    db = get_db()
    user_id = current_user["user_id"]
    
    # Check if profile already exists
    existing_profile = db.photographer_profiles.find_one({"user_id": ObjectId(user_id)})
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists. Use PUT to update."
        )
    
    # Create profile document
    profile_doc = {
        "user_id": ObjectId(user_id),
        "photography_type": profile_data.photography_type,
        "city": profile_data.city,
        "experience_years": profile_data.experience_years,
        "skills": profile_data.skills,
        "work_photos": [],
        "contact_number": profile_data.contact_number,
        "available": True,
        "created_at": None,
        "updated_at": None
    }
    
    result = db.photographer_profiles.insert_one(profile_doc)
    
    return {
        "message": "Profile created successfully",
        "profile_id": str(result.inserted_id)
    }

@router.put("", response_model=ProfileResponse)
def update_profile(profile_data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    """Update photographer profile"""
    db = get_db()
    user_id = current_user["user_id"]
    
    # Find profile
    profile = db.photographer_profiles.find_one({"user_id": ObjectId(user_id)})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Create one first."
        )
    
    # Build update document (only fields that are provided)
    update_doc = {}
    if profile_data.photography_type is not None:
        update_doc["photography_type"] = profile_data.photography_type
    if profile_data.city is not None:
        update_doc["city"] = profile_data.city
    if profile_data.experience_years is not None:
        update_doc["experience_years"] = profile_data.experience_years
    if profile_data.skills is not None:
        update_doc["skills"] = profile_data.skills
    if profile_data.contact_number is not None:
        update_doc["contact_number"] = profile_data.contact_number
    if profile_data.available is not None:
        update_doc["available"] = profile_data.available
    
    # Update profile
    db.photographer_profiles.update_one(
        {"user_id": ObjectId(user_id)},
        {"$set": update_doc}
    )
    
    # Get updated profile with user info
    updated_profile = db.photographer_profiles.find_one({"user_id": ObjectId(user_id)})
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    return ProfileResponse(
        id=str(updated_profile["_id"]),
        user_id=str(updated_profile["user_id"]),
        name=user["name"],
        email=user["email"],
        photography_type=updated_profile["photography_type"],
        city=updated_profile["city"],
        experience_years=updated_profile["experience_years"],
        skills=updated_profile["skills"],
        work_photos=updated_profile.get("work_photos", []),
        contact_number=updated_profile["contact_number"],
        available=updated_profile["available"],
        created_at=str(updated_profile.get("created_at", ""))
    )

@router.get("/me", response_model=ProfileResponse)
def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile"""
    db = get_db()
    user_id = current_user["user_id"]
    
    profile = db.photographer_profiles.find_one({"user_id": ObjectId(user_id)})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
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

@router.post("/upload")
def upload_images(files: List[UploadFile] = File(...), current_user: dict = Depends(get_current_user)):
    """Upload work photos (max 5)"""
    db = get_db()
    user_id = current_user["user_id"]
    
    # Get current profile
    profile = db.photographer_profiles.find_one({"user_id": ObjectId(user_id)})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    current_photos = profile.get("work_photos", [])
    
    # Check total photos limit
    if len(current_photos) + len(files) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum 5 photos allowed. You have {len(current_photos)} already."
        )
    
    # Save files
    uploaded_urls = []
    for file in files:
        # Generate unique filename
        ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join("uploads", filename)
        
        # Save file
        with open(filepath, "wb") as f:
            content = file.file.read()
            f.write(content)
        
        uploaded_urls.append(f"/uploads/{filename}")
    
    # Update profile with new photos
    new_photos = current_photos + uploaded_urls
    db.photographer_profiles.update_one(
        {"user_id": ObjectId(user_id)},
        {"$set": {"work_photos": new_photos}}
    )
    
    return {
        "message": "Images uploaded successfully",
        "file_urls": uploaded_urls
    }

