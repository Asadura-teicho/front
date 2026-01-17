# ⚠️ CRITICAL: Environment Variables Required for Production

## 🔴 FRONTEND - MUST SET BEFORE DEPLOYMENT

### Required Environment Variable:

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

**⚠️ WITHOUT THIS, YOUR APP WILL NOT CONNECT TO THE BACKEND!**

**Where to set:**
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Other**: Check your hosting platform's documentation

**Format:**
- ✅ Correct: `https://your-backend.onrender.com/api`
- ✅ Correct: `https://your-backend.railway.app/api`
- ❌ Wrong: `https://your-backend.com` (missing `/api`)
- ❌ Wrong: `https://your-backend.com/api/` (trailing slash)

**Example for Render backend:**
```bash
VITE_API_URL=https://garbet-backend.onrender.com/api
```

---

## 🔴 BACKEND - MUST SET BEFORE DEPLOYMENT

### Required Environment Variables:

```bash
# 1. MongoDB Connection String (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# 2. JWT Secret (REQUIRED - must be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-minimum-32-characters-long

# 3. Frontend URL for CORS (REQUIRED)
FRONTEND_URL=https://your-frontend.vercel.app

# 4. Node Environment (REQUIRED)
NODE_ENV=production

# 5. Server Port (usually auto-set by hosting, but can specify)
PORT=5000
```

### Optional Environment Variables:

```bash
# Additional allowed origins (comma-separated)
ALLOWED_ORIGINS=https://www.your-domain.com,https://admin.your-domain.com

# Cookie domain (if using cross-subdomain cookies)
COOKIE_DOMAIN=.your-domain.com

# JWT expiration (optional, defaults to 15m)
JWT_EXPIRES_IN=15m
```

---

## 🚀 Deployment Order

### 1️⃣ Deploy Backend First

**Why?** Because frontend needs the backend URL to set `VITE_API_URL`.

**Steps:**
1. Deploy backend to Render/Railway/etc.
2. Get your backend URL (e.g., `https://garbet-backend.onrender.com`)
3. Note this URL - you'll need it for frontend

**Backend Environment Variables:**
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_min_32_chars
NODE_ENV=production
PORT=5000
# Note: Set FRONTEND_URL after frontend is deployed
```

### 2️⃣ Deploy Frontend

**Steps:**
1. Deploy frontend to Vercel/Netlify/etc.
2. Set `VITE_API_URL` to your backend URL + `/api`
3. Get your frontend URL (e.g., `https://garbet-casino.vercel.app`)

**Frontend Environment Variable:**
```bash
VITE_API_URL=https://garbet-backend.onrender.com/api
```

### 3️⃣ Update Backend CORS

**Steps:**
1. Go to backend environment variables
2. Add/Update `FRONTEND_URL` with your frontend URL
3. Redeploy backend

**Updated Backend Environment Variable:**
```bash
FRONTEND_URL=https://garbet-casino.vercel.app
```

---

## ✅ Verification

### Check Frontend Connection:

1. Open your deployed frontend
2. Open browser DevTools → Console
3. Look for: `API Base URL: https://your-backend-url.com/api`
4. If you see `API Base URL: ` (empty), environment variable is NOT set!

### Check Backend CORS:

1. Open browser DevTools → Network tab
2. Try to login or play a game
3. Check if requests succeed
4. If CORS error appears, check `FRONTEND_URL` in backend

---

## 🆘 Troubleshooting

### Problem: "VITE_API_URL is not set" error

**Solution:**
1. Check environment variables in your hosting platform
2. Verify variable name is exactly: `VITE_API_URL`
3. Verify value ends with `/api`
4. Redeploy frontend after setting variable

### Problem: CORS errors in browser

**Solution:**
1. Check `FRONTEND_URL` in backend environment variables
2. Make sure it matches your frontend domain exactly
3. No trailing slash at the end
4. Check backend logs for CORS warnings
5. Redeploy backend after updating

### Problem: API calls return 404

**Solution:**
1. Verify backend is running
2. Check if URL includes `/api` at the end
3. Verify route exists in backend
4. Check backend logs for route registration

---

## 📋 Quick Reference

### Vercel (Frontend)
```
Project → Settings → Environment Variables
Add: VITE_API_URL = https://your-backend.com/api
Select: Production, Preview, Development
Save → Redeploy
```

### Render (Backend)
```
Dashboard → Your Service → Environment
Add all required variables
Make sure FRONTEND_URL matches your Vercel URL
Save → Redeploy
```

---

## ⚠️ IMPORTANT NOTES

1. **Environment variables are case-sensitive**
   - ✅ `VITE_API_URL` (correct)
   - ❌ `vite_api_url` (wrong)
   - ❌ `Vite_Api_Url` (wrong)

2. **No trailing slashes**
   - ✅ `https://backend.com/api`
   - ❌ `https://backend.com/api/`

3. **Must include /api**
   - ✅ `https://backend.com/api`
   - ❌ `https://backend.com`

4. **Use HTTPS in production**
   - ✅ `https://backend.com/api`
   - ❌ `http://backend.com/api`

5. **Redeploy after changing environment variables**
   - Variables are baked in at build time (frontend)
   - Variables are loaded at runtime (backend)
   - Always redeploy after changes

---

**🎯 Remember: Set `VITE_API_URL` in frontend BEFORE deployment!**
