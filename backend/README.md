# LensLink Backend

A clean, minimal FastAPI backend for LensLink - a LinkedIn-style platform for photographers.

## Tech Stack
- **Framework:** FastAPI
- **Database:** MongoDB (PyMongo)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt (passlib)

## Project Structure
```
backend/
├── main.py                 # FastAPI app entry point
├── database.py            # MongoDB connection
├── models.py              # Pydantic models
├── auth.py                # JWT & password handling
├── routes/
│   ├── auth_routes.py     # Signup & Login
│   ├── profile_routes.py  # Profile CRUD & image upload
│   └── discovery_routes.py # Browse & filter photographers
├── uploads/               # Image storage
├── requirements.txt       # Python dependencies
└── .env.example          # Environment variables template

```

## Setup Instructions

### 1. Setup MongoDB Atlas (Free Cloud Database)
Since local MongoDB isn't available, use MongoDB Atlas:
- **Detailed Guide:** See `../MONGODB_ATLAS_SETUP.md`
- **Quick:** Sign up at https://www.mongodb.com/cloud/atlas/register
- Create free M0 cluster
- Get connection string
- No local installation needed!

### 2. Create Environment File
Run the helper script:
```bash
python create_env.py
```

Then edit `.env` with your MongoDB Atlas connection string:
```
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lenslink?retryWrites=true&w=majority
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python main.py
```

The API will be available at: http://localhost:8000

### 5. API Documentation
Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new photographer
- `POST /auth/login` - Login and get JWT token

### Profile Management (Protected)
- `POST /profile` - Create profile
- `PUT /profile` - Update profile
- `GET /profile/me` - Get own profile
- `POST /profile/upload` - Upload work photos (max 5)

### Discovery (Public)
- `GET /photographers?city=&type=` - List photographers with filters
- `GET /photographer/{id}` - Get photographer details

## Database Collections

### users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "photographer",
  "created_at": "datetime"
}
```

### photographer_profiles
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "photography_type": "string",
  "city": "string",
  "experience_years": "number",
  "skills": ["string"],
  "work_photos": ["string"],
  "contact_number": "string",
  "available": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/
```

### 2. Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Create Profile (use token from login)
```bash
curl -X POST http://localhost:8000/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "photography_type": "Wedding",
    "city": "New York",
    "experience_years": 5,
    "skills": ["Portrait", "Landscape", "Event"],
    "contact_number": "+1234567890"
  }'
```

## Development Notes

- **Simple & Readable:** Code follows clean coding practices without over-engineering
- **No ODM:** Using PyMongo directly for database operations
- **JWT Authentication:** Token-based auth with bcrypt password hashing
- **File Upload:** Images stored locally in `uploads/` folder
- **CORS Enabled:** Configured for React frontend on port 3000

## Next Steps

1. ✅ Backend setup complete
2. ⏳ Frontend development (React)
3. ⏳ Integration testing
4. ⏳ Deployment

---

**Status:** Backend complete and ready for frontend integration

