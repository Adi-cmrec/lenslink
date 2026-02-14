# database.py - MongoDB connection setup
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "lenslink")

# MongoDB client instance
client = None
db = None

def connect_db():
    """Connect to MongoDB"""
    global client, db
    try:
        client = MongoClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        # Test connection
        client.admin.command('ping')
        print(f"SUCCESS: Connected to MongoDB: {DATABASE_NAME}")
        return db
    except Exception as e:
        print(f"ERROR: MongoDB connection failed: {e}")
        raise

def get_db():
    """Get database instance"""
    if db is None:
        connect_db()
    return db

def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("SUCCESS: MongoDB connection closed")

