# LensLink Setup Guide

## Step 1: Backend Setup

### Prerequisites
1. **Python 3.8+** installed
2. **MongoDB Atlas account** (free cloud database)
3. **pip** (Python package manager)
4. **Internet connection**

### MongoDB Setup
Since local MongoDB installation isn't available, we're using **MongoDB Atlas** (free cloud database).

**📖 See detailed setup guide:** `MONGODB_ATLAS_SETUP.md`

**Quick steps:**
1. Sign up at: https://www.mongodb.com/cloud/atlas/register
2. Create a free M0 cluster
3. Add database user
4. Allow network access (0.0.0.0/0)
5. Get connection string
6. Update `.env` file

**No local installation needed!**

### Backend Installation

1. **Navigate to backend directory:**
```bash
cd C:\Prsnlfiles\lenslink\backend
```

2. **Create `.env` file:**
Run the helper script:
```bash
python create_env.py
```

Then update the `.env` file with your MongoDB Atlas connection string:
```
MONGODB_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lenslink?retryWrites=true&w=majority
DATABASE_NAME=lenslink
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
HOST=0.0.0.0
PORT=8000
```

**Get your connection string from MongoDB Atlas (see MONGODB_ATLAS_SETUP.md)**

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Test MongoDB connection:**
```bash
python test_db_connection.py
```
You should see: `✅ MongoDB connection is working perfectly!`

5. **Run the backend server:**
```bash
python main.py
```

The API will start at: http://localhost:8000

6. **Test the API:**
Open browser and visit: http://localhost:8000/docs

## Step 2: Frontend Setup (Coming Next)

Will be created after backend confirmation.

---

## Quick Start Commands

```bash
# 1. Setup MongoDB Atlas (one-time)
# Follow: MONGODB_ATLAS_SETUP.md

# 2. Create .env file
cd C:\Prsnlfiles\lenslink\backend
python create_env.py
# Then edit .env with your Atlas connection string

# 3. Install dependencies
pip install -r requirements.txt

# 4. Test connection
python test_db_connection.py

# 5. Start Backend
python main.py
```

## Troubleshooting

### MongoDB Connection Issues
- Verify `.env` has correct Atlas connection string
- Check username/password are correct (no `<>` brackets)
- Ensure Network Access allows 0.0.0.0/0 in Atlas
- Check internet connection
- See MONGODB_ATLAS_SETUP.md troubleshooting section

### Module Import Errors
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.8+)

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 8000

---

## What's Been Built

### ✅ Backend Complete
- FastAPI application structure
- MongoDB connection setup
- JWT authentication system
- Password hashing with bcrypt
- User signup & login APIs
- Photographer profile CRUD
- Image upload (max 5 photos)
- Discovery & filter APIs
- CORS configuration for React

### 📁 Files Created
```
backend/
├── main.py                 # FastAPI app
├── database.py            # MongoDB connection
├── models.py              # Pydantic schemas
├── auth.py                # JWT & bcrypt
├── routes/
│   ├── __init__.py
│   ├── auth_routes.py     # Signup/Login
│   ├── profile_routes.py  # Profile management
│   └── discovery_routes.py # Browse photographers
├── uploads/               # Image storage
├── requirements.txt       # Dependencies
├── .env.example          # Environment template
├── README.md             # Documentation
└── test_db_connection.py  # Connection test
```

### 🔌 API Endpoints Ready
- POST /auth/signup
- POST /auth/login
- POST /profile (protected)
- PUT /profile (protected)
- GET /profile/me (protected)
- POST /profile/upload (protected)
- GET /photographers?city=&type=
- GET /photographer/{id}

---

**Next Step:** Confirm backend is working, then proceed with React frontend development.

