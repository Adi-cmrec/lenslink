# routes/auth_routes.py - Authentication endpoints (Signup & Login)
from fastapi import APIRouter, HTTPException, status
from models import UserSignup, UserLogin, Token, UserResponse
from auth import hash_password, verify_password, create_access_token
from database import get_db
from bson import ObjectId

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup):
    """Register a new photographer"""
    db = get_db()
    
    # Check if email already exists
    existing_user = db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "role": "photographer",
        "created_at": None  # Will be set by MongoDB
    }
    
    # Insert user into database
    result = db.users.insert_one(user_doc)
    
    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin):
    """Login and get access token"""
    db = get_db()
    
    # Find user by email
    user = db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    token_data = {
        "user_id": str(user["_id"]),
        "email": user["email"]
    }
    access_token = create_access_token(token_data)
    
    # Prepare user response
    user_response = UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        role=user["role"]
    )
    
    return Token(access_token=access_token, user=user_response)

