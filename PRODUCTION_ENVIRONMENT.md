# Production Environment Setup Guide

## Required Environment Variables

### Frontend (Vercel/Netlify/Other Hosting)

#### **REQUIRED Environment Variables:**

```bash
# Backend API URL (MUST be set for production)
VITE_API_URL=https://your-backend-domain.com/api
```

**Important Notes:**
- URL must include `/api` at the end
- Example: `https://your-backend.onrender.com/api`
- Do NOT use trailing slash after `/api`

#### **OPTIONAL Environment Variables:**

```bash
# Development API URL (optional, only for local dev)
VITE_DEV_API_URL=http://localhost:5000/api
```

---

### Backend (Render/Railway/Other Hosting)

#### **REQUIRED Environment Variables:**

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret (MUST be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Node Environment
NODE_ENV=production

# Server Port (usually auto-set by hosting platform)
PORT=5000
```

#### **OPTIONAL Environment Variables:**

```bash
# Additional CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://www.your-domain.com,https://admin.your-domain.com

# Database connection options
DB_CONNECT_TIMEOUT=30000

# Session secret (if using sessions)
SESSION_SECRET=your-session-secret-here
```

---

## Frontend-Backend Connection Checklist

### ✅ Connection Status

1. **API URL Configuration**
   - ✅ Frontend reads `VITE_API_URL` from environment
   - ✅ Backend serves API at `/api` prefix
   - ✅ CORS configured on backend

2. **API Endpoints Verified**
   - ✅ `/api/auth/login` - Login
   - ✅ `/api/auth/register` - Registration
   - ✅ `/api/auth/me` - Get current user
   - ✅ `/api/auth/logout` - Logout
   - ✅ `/api/payment/iban-deposit` - Create deposit
   - ✅ `/api/payment/deposit-requests` - Get deposits
   - ✅ `/api/sweet-bonanza/play` - Play Sweet Bonanza
   - ✅ `/api/gates-of-olympus/play` - Play Gates of Olympus

3. **Authentication**
   - ✅ JWT token stored in localStorage
   - ✅ Token sent in Authorization header
   - ✅ Automatic token refresh on 401 errors
   - ✅ Token cleared on logout

4. **Error Handling**
   - ✅ Network errors handled gracefully
   - ✅ API errors show user-friendly messages
   - ✅ 401 errors redirect to login
   - ✅ 404 errors logged for debugging

---

## Deployment Platforms

### Vercel (Frontend)

1. **Add Environment Variable:**
   - Go to: Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Select: Production, Preview, Development
   - Save and redeploy

2. **Build Command:**
   ```bash
   npm run build
   ```

3. **Output Directory:**
   ```
   dist
   ```

4. **Install Command:**
   ```bash
   npm install
   ```

### Render (Backend)

1. **Add Environment Variables:**
   - Go to: Dashboard → Your Service → Environment
   - Add all required variables listed above
   - Make sure `FRONTEND_URL` matches your Vercel deployment URL

2. **Build Command:**
   ```bash
   npm install
   ```

3. **Start Command:**
   ```bash
   node server.js
   ```

---

## Testing Connection

### 1. Check API URL in Browser Console

Open browser console and look for:
```
API Base URL: https://your-backend-url.com/api
```

If you see `API Base URL: ` (empty), the environment variable is not set!

### 2. Test Authentication Endpoint

```javascript
// In browser console
fetch('https://your-backend-url.com/api/auth/me', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(r => r.json())
.then(console.log)
```

### 3. Check Network Tab

- Open DevTools → Network
- Try to play a game or login
- Check if requests go to correct URL
- Verify CORS headers are present

---

## Common Issues & Solutions

### Issue: "Network Error" or CORS errors

**Solution:**
1. Check `FRONTEND_URL` in backend environment variables
2. Make sure it matches your frontend domain exactly
3. Check backend logs for CORS warnings
4. Verify backend allows your frontend origin

### Issue: "VITE_API_URL is not set"

**Solution:**
1. Add `VITE_API_URL` in your hosting platform's environment variables
2. Format: `https://your-backend.com/api`
3. Redeploy frontend after adding variable

### Issue: API calls return 404

**Solution:**
1. Verify backend is running
2. Check if URL ends with `/api`
3. Verify route exists in backend
4. Check backend logs for route registration

### Issue: 401 Unauthorized errors

**Solution:**
1. Check if user is logged in (token in localStorage)
2. Verify JWT_SECRET matches between frontend/backend
3. Check token expiration
4. Try logging out and back in

---

## Production Readiness Checklist

### Frontend ✅
- [x] Error boundaries implemented
- [x] Global error handlers configured
- [x] API error handling with user-friendly messages
- [x] Network error handling
- [x] Production build optimized
- [x] Environment variables documented
- [x] No console errors in production
- [x] Loading states for all async operations
- [x] Proper routing without page reloads

### Backend ✅
- [x] CORS configured with frontend URL
- [x] JWT authentication implemented
- [x] Error handling middleware
- [x] All game routes registered
- [x] Database connection secured
- [x] Environment variables validated
- [x] Production error logging

### Connection ✅
- [x] API URLs match between frontend and backend
- [x] CORS allows frontend origin
- [x] Authentication flow works
- [x] All endpoints accessible
- [x] Error responses handled properly

---

## Quick Start for Production

### Step 1: Backend Setup
```bash
# Set in your backend hosting platform:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_min_32_chars
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Step 2: Frontend Setup
```bash
# Set in your frontend hosting platform:
VITE_API_URL=https://your-backend-url.com/api
```

### Step 3: Deploy
1. Deploy backend first
2. Update frontend `VITE_API_URL` with backend URL
3. Deploy frontend
4. Test connection

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for CORS/API errors
3. Verify environment variables are set correctly
4. Test API endpoints with Postman/curl
5. Check network tab for failed requests
