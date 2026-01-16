# Frontend-Backend Connectivity Guide

## Prerequisites

### Backend Setup
1. Backend must be running on port 5000 (or port specified in `.env`)
2. Backend CORS must allow your frontend origin
3. Backend must have proper environment variables configured

### Frontend Setup
1. Frontend `.env` file must have `VITE_API_URL` set
2. Frontend dev server must be running

## Environment Variables

### Frontend (Gameswebsite-main/.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
FRONTEND_URL=http://localhost:5173
PORT=5000
```

## Connection Flow

1. **Frontend makes API request**
   - Uses `VITE_API_URL` from environment variables
   - Defaults to `http://localhost:5000/api` in development

2. **Request includes authentication**
   - Token from `localStorage.getItem('token')`
   - Added to `Authorization: Bearer <token>` header

3. **Backend validates request**
   - Checks CORS origin
   - Validates JWT token (if authenticated)
   - Processes request

4. **Response returned**
   - Success: Data returned
   - Error: Error message returned with status code

## Testing Connectivity

### 1. Check Backend is Running
```bash
cd Backend
npm start
# Should see: Server is running on port 5000
```

### 2. Check Frontend Configuration
```bash
cd Gameswebsite-main
cat .env
# Should see: VITE_API_URL=http://localhost:5000/api
```

### 3. Check Browser Console
Open DevTools (F12) → Console:
- Should see: `API Base URL: http://localhost:5000/api`

### 4. Test API Call
1. Open your app in browser
2. Try to login or signup
3. Open DevTools → Network tab
4. Look for requests to `/api/auth/login` or `/api/auth/register`
5. Check if request succeeds (Status 200) or fails

## Common Issues

### CORS Errors
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check backend `FRONTEND_URL` environment variable
2. Ensure backend allows your frontend origin
3. For local: `FRONTEND_URL=http://localhost:5173`
4. For production: `FRONTEND_URL=https://your-app.vercel.app`

### 401 Unauthorized
**Error:** `401 Unauthorized`

**Solution:**
1. Token may be expired or invalid
2. Clear localStorage and login again
3. Check backend JWT_SECRET is set

### 404 Not Found
**Error:** `404 Not Found` on API calls

**Solution:**
1. Check `VITE_API_URL` is correct
2. Ensure URL ends with `/api`
3. Check backend routes match frontend API calls
4. Verify backend is running

### Network Error
**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
1. Backend is not running - start it with `npm start`
2. Wrong port - check `VITE_API_URL` port matches backend port
3. Backend crashed - check backend logs

## Production Deployment

### Frontend (Vercel)
Set environment variable:
- `VITE_API_URL` = `https://your-backend.onrender.com/api`

### Backend (Render/Railway/etc)
Set environment variables:
- `FRONTEND_URL` = `https://your-app.vercel.app`
- `PORT` = `5000` (or your platform's assigned port)
- `JWT_SECRET` = your secret key
- `MONGO_URI` = your MongoDB connection string

### CORS Configuration
Backend must allow requests from:
- `https://your-app.vercel.app`
- `https://www.your-app.vercel.app` (if using www)

