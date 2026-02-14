# MongoDB Atlas Setup Guide (Free Cloud Database)

Since MongoDB can't be installed locally, we'll use **MongoDB Atlas** - a free cloud-hosted MongoDB service.

## ☁️ Why MongoDB Atlas?

✅ **Free Forever** - M0 Sandbox tier (512MB storage)  
✅ **No Installation** - Works from browser  
✅ **Cloud Hosted** - Access from anywhere  
✅ **Same Features** - Identical to local MongoDB  
✅ **5 Minutes Setup** - Super easy  

---

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**

2. Sign up with:
   - Email address, OR
   - Google account, OR
   - GitHub account

3. Click "Sign Up"

---

### Step 2: Create a Free Cluster

1. After login, you'll see "Create a Cluster"

2. Choose **"M0 Sandbox"** (FREE tier)
   - Provider: AWS, Google Cloud, or Azure (any works)
   - Region: Choose closest to you
   - Cluster Name: Leave as "Cluster0" or name it "LensLink"

3. Click **"Create Cluster"**
   - ⏱️ This takes 1-3 minutes to provision

---

### Step 3: Create Database User

1. On the left sidebar, click **"Database Access"**

2. Click **"Add New Database User"**

3. Choose **"Password"** authentication

4. Enter:
   - Username: `lenslink_user` (or any name you like)
   - Password: Click "Autogenerate Secure Password" OR create your own
   - **IMPORTANT:** Copy and save the password!

5. Under "Database User Privileges":
   - Select **"Read and write to any database"**

6. Click **"Add User"**

---

### Step 4: Setup Network Access

1. On the left sidebar, click **"Network Access"**

2. Click **"Add IP Address"**

3. For development, choose:
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (safe for development)

4. Click **"Confirm"**

---

### Step 5: Get Connection String

1. Go back to **"Database"** (left sidebar)

2. Your cluster should now show as "Active" ✅

3. Click **"Connect"** button on your cluster

4. Choose **"Connect your application"**

5. Select:
   - Driver: **Python**
   - Version: **3.12 or later**

6. Copy the connection string. It looks like:
   ```
   mongodb+srv://lenslink_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **IMPORTANT:** Replace `<password>` with your actual password from Step 3

---

### Step 6: Update Your `.env` File

1. Navigate to: `C:\Prsnlfiles\lenslink\backend`

2. Run the helper script:
   ```bash
   python create_env.py
   ```

3. Open the created `.env` file

4. Update the `MONGODB_URL` line with your connection string:
   ```env
   MONGODB_URL=mongodb+srv://lenslink_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lenslink?retryWrites=true&w=majority
   ```

5. **Example (with fake credentials):**
   ```env
   MONGODB_URL=mongodb+srv://lenslink_user:MySecurePass123@cluster0.ab1cd.mongodb.net/lenslink?retryWrites=true&w=majority
   DATABASE_NAME=lenslink
   SECRET_KEY=your-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   HOST=0.0.0.0
   PORT=8000
   ```

---

### Step 7: Test the Connection

1. Open terminal in `C:\Prsnlfiles\lenslink\backend`

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Test MongoDB connection:
   ```bash
   python test_db_connection.py
   ```

4. You should see:
   ```
   Testing MongoDB connection...
   ✓ Connected to MongoDB: lenslink
   ✓ Available collections: None (database is empty)
   ✓ Test insert successful: ...
   ✓ Test cleanup successful

   ✅ MongoDB connection is working perfectly!
   ✓ MongoDB connection closed
   ```

---

### Step 8: Start the Backend

```bash
python main.py
```

You should see:
```
✓ Connected to MongoDB: lenslink
✓ LensLink API started successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

🎉 **Success!** Open: http://localhost:8000/docs

---

## 🔍 View Your Data in Atlas

1. Go to **"Database"** in Atlas
2. Click **"Browse Collections"**
3. You'll see your `lenslink` database and collections (`users`, `photographer_profiles`)
4. You can view/edit data directly in the browser!

---

## 🛠️ Troubleshooting

### "Bad auth: Authentication failed"
- Check your password in `.env` is correct
- Make sure you replaced `<password>` with actual password
- No spaces before/after the password

### "Connection timeout"
- Check Network Access settings in Atlas
- Make sure "0.0.0.0/0" is added
- Check your internet connection

### "MongoServerError: user is not allowed"
- Go to Database Access
- Make sure user has "Read and write to any database" permission

### "Name or service not known"
- Check the connection string format
- Should start with `mongodb+srv://`
- Should include `?retryWrites=true&w=majority`

---

## 📊 Atlas Dashboard Features

Once you have data:
- **Charts:** Create visualizations of your data
- **Search:** Full-text search capabilities
- **Monitoring:** See queries and performance
- **Backups:** Automatic backups (even on free tier!)

---

## 💡 Connection String Format

**Full Format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/DATABASE_NAME?retryWrites=true&w=majority
```

**Parts:**
- `mongodb+srv://` - Protocol
- `USERNAME` - Database user from Step 3
- `PASSWORD` - User password (URL encode special chars)
- `CLUSTER_URL` - Your cluster URL (e.g., cluster0.ab1cd.mongodb.net)
- `DATABASE_NAME` - `lenslink`
- `?retryWrites=true&w=majority` - Connection options

---

## ✅ Quick Checklist

- [ ] Created Atlas account
- [ ] Created free M0 cluster
- [ ] Added database user with password
- [ ] Allowed network access (0.0.0.0/0)
- [ ] Got connection string
- [ ] Updated `.env` file with connection string
- [ ] Ran `pip install -r requirements.txt`
- [ ] Tested connection with `python test_db_connection.py`
- [ ] Started server with `python main.py`
- [ ] Opened http://localhost:8000/docs

---

## 🎯 Next Steps

Once backend is running successfully:
✅ Test API endpoints at http://localhost:8000/docs  
✅ Confirm you're ready for frontend development  
✅ We'll build the React frontend!  

---

**Need Help?** MongoDB Atlas has great docs: https://docs.atlas.mongodb.com/getting-started/

