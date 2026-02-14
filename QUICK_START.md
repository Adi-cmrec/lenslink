# ⚡ Quick Start Guide - LensLink Backend

## 🎯 Goal
Get the backend API running in ~10 minutes using MongoDB Atlas (free cloud database).

---

## ✅ Prerequisites
- Python 3.8+ installed
- Internet connection
- Code editor (VS Code, Cursor, etc.)

---

## 🚀 Steps (Follow in Order)

### 1️⃣ Setup MongoDB Atlas (5 mins)

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register

2. **Create cluster:**
   - Choose "M0 Sandbox" (FREE)
   - Click "Create"

3. **Add user:**
   - Database Access → Add New User
   - Username: `lenslink_user`
   - Password: Click "Autogenerate" (SAVE THIS!)
   - Privilege: "Read and write to any database"

4. **Allow access:**
   - Network Access → Add IP Address
   - Choose "Allow Access from Anywhere"

5. **Get connection string:**
   - Database → Connect → Connect your application
   - Copy the string (looks like: `mongodb+srv://...`)
   - Replace `<password>` with your actual password

**Example connection string:**
```
mongodb+srv://lenslink_user:MyPass123@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority
```

---

### 2️⃣ Setup Backend (5 mins)

```bash
# Navigate to backend
cd C:\Prsnlfiles\lenslink\backend

# Create .env file
python create_env.py

# Open .env and paste your Atlas connection string
# Update this line:
MONGODB_URL=mongodb+srv://lenslink_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lenslink?retryWrites=true&w=majority

# Install dependencies
pip install -r requirements.txt

# Test MongoDB connection
python test_db_connection.py

# Expected output:
# ✓ Connected to MongoDB: lenslink
# ✅ MongoDB connection is working perfectly!
```

---

### 3️⃣ Start the Server

```bash
python main.py
```

**Expected output:**
```
✓ Connected to MongoDB: lenslink
✓ LensLink API started successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### 4️⃣ Test the API

Open browser: **http://localhost:8000/docs**

You'll see the Swagger UI with all 8 endpoints! 🎉

---

## 🧪 Quick API Test (Optional)

### Test in Swagger UI:

1. **Signup:**
   - Go to `/auth/signup`
   - Click "Try it out"
   - Enter:
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "test123"
     }
     ```
   - Click "Execute"
   - Should get: `201 Created`

2. **Login:**
   - Go to `/auth/login`
   - Enter same email/password
   - Copy the `access_token` from response

3. **Create Profile:**
   - Go to `/profile` (POST)
   - Click the lock icon 🔒
   - Paste your token
   - Enter profile data
   - Execute!

---

## 📂 Project Structure

```
lenslink/
├── backend/
│   ├── main.py              ← Entry point
│   ├── database.py          ← MongoDB connection
│   ├── models.py            ← Data schemas
│   ├── auth.py              ← JWT & bcrypt
│   ├── routes/              ← API endpoints
│   ├── uploads/             ← Image storage
│   └── .env                 ← Your config (create this!)
├── MONGODB_ATLAS_SETUP.md   ← Detailed Atlas guide
├── SETUP_GUIDE.md           ← Full setup guide
└── QUICK_START.md           ← This file!
```

---

## ❌ Troubleshooting

### "MongoServerError: bad auth"
→ Check password in `.env` is correct (no `<>` brackets)

### "Connection timeout"
→ Check Network Access in Atlas (should allow 0.0.0.0/0)

### "Module not found"
→ Run `pip install -r requirements.txt`

### Port 8000 in use
→ Change `PORT=8001` in `.env`

---

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster is "Active"
- [ ] Database user created with password
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string copied and updated in `.env`
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Connection test passed (`python test_db_connection.py`)
- [ ] Server running (`python main.py`)
- [ ] Swagger UI accessible (http://localhost:8000/docs)

---

## 🎯 Next Step

Once backend is confirmed working:
→ **Say "backend working" to proceed with React frontend!**

---

## 📚 Need More Details?

- **MongoDB Atlas Setup:** See `MONGODB_ATLAS_SETUP.md`
- **Full Setup Guide:** See `SETUP_GUIDE.md`
- **Backend Docs:** See `backend/README.md`
- **API Reference:** http://localhost:8000/docs (when running)

---

**Questions?** Check the detailed guides or ask for help! 🚀

