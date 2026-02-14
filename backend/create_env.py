# create_env.py - Helper script to create .env file
import os

env_content = """# MongoDB Configuration (MongoDB Atlas - Cloud)
# Your MongoDB Atlas connection string is already configured!
MONGODB_URL=mongodb+srv://208r1a6761_db_user:208r1a6761_db_user@cluster0.vgzcl6j.mongodb.net/lenslink?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=lenslink

# JWT Configuration
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Server Configuration
HOST=0.0.0.0
PORT=8000
"""

def create_env():
    """Create .env file if it doesn't exist"""
    env_path = ".env"
    
    if os.path.exists(env_path):
        print("WARNING: .env file already exists")
        response = input("Do you want to overwrite it? (y/n): ")
        if response.lower() != 'y':
            print("CANCELLED")
            return
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print("SUCCESS: .env file created successfully!")
    print("REMINDER: Change SECRET_KEY in production!")

if __name__ == "__main__":
    create_env()

