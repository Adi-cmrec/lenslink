# Fix MongoDB Atlas Authentication Error

## Problem
You're getting: `bad auth : authentication failed`

## Cause
The password in your `.env` file is incorrect or the user isn't set up properly in MongoDB Atlas.

---

## Solution: Update MongoDB Atlas Credentials

### Step 1: Go to MongoDB Atlas
1. Open: https://cloud.mongodb.com
2. Login with your account

### Step 2: Reset Database User Password
1. Click "Database Access" in the left sidebar
2. Find your user (`208r1a6761_db_user`)
3. Click "Edit" button
4. Click "Edit Password"
5. Choose one of these options:
   - **Autogenerate Secure Password** (recommended) - Click and COPY the password
   - **Create your own password** - Enter a new password (REMEMBER IT!)
6. Make sure privileges are set to: **"Atlas admin"** or **"Read and write to any database"**
7. Click "Update User"

### Step 3: Get New Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It looks like:
   ```
   mongodb+srv://208r1a6761_db_user:<password>@cluster0.vgzcl6j.mongodb.net/?appName=Cluster0
   ```

### Step 4: Update .env File
1. Open: `C:\Prsnlfiles\lenslink\backend\.env`
2. Update the MONGODB_URL line:
   ```
   MONGODB_URL=mongodb+srv://208r1a6761_db_user:YOUR_NEW_PASSWORD@cluster0.vgzcl6j.mongodb.net/lenslink?retryWrites=true&w=majority&appName=Cluster0
   ```
3. **Replace `YOUR_NEW_PASSWORD`** with the password from Step 2
4. **Make sure there are NO spaces** before/after
5. **Make sure to replace `<password>` placeholder**
6. Save the file

---

## Quick Example

**Before (WRONG):**
```
MONGODB_URL=mongodb+srv://208r1a6761_db_user:208r1a6761_db_user@cluster0...
```

**After (CORRECT):**
```
MONGODB_URL=mongodb+srv://208r1a6761_db_user:MyActualPass123@cluster0.vgzcl6j.mongodb.net/lenslink?retryWrites=true&w=majority&appName=Cluster0
```

---

## Step 5: Test Connection Again

```bash
cd C:\Prsnlfiles\lenslink\backend
python test_db_connection.py
```

**Expected output:**
```
Testing MongoDB connection...
SUCCESS: Connected to MongoDB: lenslink
SUCCESS: Available collections: None (database is empty)
SUCCESS: Test insert successful: ...
SUCCESS: Test cleanup successful

==> MongoDB connection is working perfectly!
SUCCESS: MongoDB connection closed
```

---

## Still Having Issues?

### Option A: Create New User
1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Username: `lenslink_admin`
4. Password: Autogenerate (copy it!)
5. Privileges: "Atlas admin"
6. Add User
7. Update `.env` with new username and password

### Option B: Check Network Access
1. Go to "Network Access" in Atlas
2. Make sure `0.0.0.0/0` is in the list
3. If not, click "Add IP Address" → "Allow Access from Anywhere"

### Option C: Verify Cluster is Running
1. Go to "Database"
2. Your cluster should show as "Active" (green)
3. If it's paused, click "Resume"

---

## Common Mistakes

❌ **Using username as password**
```
MONGODB_URL=mongodb+srv://user:user@cluster...
```

❌ **Leaving <password> placeholder**
```
MONGODB_URL=mongodb+srv://user:<password>@cluster...
```

❌ **Spaces in connection string**
```
MONGODB_URL= mongodb+srv://...
```

❌ **Wrong special characters in password**
- If password has special chars like `@`, `#`, `$`, they need to be URL-encoded
- Use "Autogenerate" to avoid this issue

✅ **Correct format:**
```
MONGODB_URL=mongodb+srv://username:actual_password@cluster0.xxxxx.mongodb.net/lenslink?retryWrites=true&w=majority
```

---

## Need the Manual .env Template?

Create `.env` file with this content:
```
# MongoDB Configuration (MongoDB Atlas)
# Replace YOUR_PASSWORD with your actual MongoDB Atlas password
MONGODB_URL=mongodb+srv://208r1a6761_db_user:YOUR_PASSWORD@cluster0.vgzcl6j.mongodb.net/lenslink?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=lenslink

# JWT Configuration
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

---

**Once fixed, the connection test should pass!** Then we can start the backend server and proceed with frontend development.

