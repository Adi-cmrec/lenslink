# main.py - FastAPI application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import connect_db, close_db
from routes import auth_routes, profile_routes, discovery_routes
import os

app = FastAPI(title="LensLink API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for image uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Register routes
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(profile_routes.router, prefix="/profile", tags=["Profile"])
app.include_router(discovery_routes.router, tags=["Discovery"])

@app.on_event("startup")
def startup_event():
    """Run on application startup"""
    connect_db()
    print("SUCCESS: LensLink API started successfully")

@app.on_event("shutdown")
def shutdown_event():
    """Run on application shutdown"""
    close_db()
    print("SUCCESS: LensLink API shut down")

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "message": "LensLink API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

