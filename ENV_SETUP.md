# Environment Variables Setup Guide

## Quick Setup

### Step 1: Create .env file

Copy `env.example` to `.env`:
```bash
cp env.example .env
```

Or manually create `.env` in the root directory:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Update .env with your backend URL

**For Local Development:**
```env
VITE_API_URL=http://localhost:5000/api
```

**For Production (Vercel):**
- Set `VITE_API_URL` in Vercel Dashboard → Settings → Environment Variables
- Value: `https://your-backend.onrender.com/api` (replace with your actual backend URL)

### Step 3: Restart Dev Server

After creating/updating `.env`, restart your dev server:
```bash
npm run dev
```

## Environment Variables Explained

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes (Production) | `http://localhost:5000/api` (Dev) | Backend API URL |
| `VITE_DEV_API_URL` | No | `http://localhost:5000/api` | Development API URL override |

## Connectivity Check

### Backend Requirements

Your backend needs to allow CORS from your frontend URL:

1. **Local Development:**
   - Backend should allow `http://localhost:5173` (Vite default port)
   - Or whatever port Vite uses (check console output)

2. **Production:**
   - Backend should allow your Vercel domain (e.g., `https://your-app.vercel.app`)
   - Set `FRONTEND_URL` in backend environment variables

### Testing Connectivity

1. **Start Backend:**
   ```bash
   cd Backend
   npm start
   ```
   Should see: `Server is running on port 5000`

2. **Start Frontend:**
   ```bash
   cd Gameswebsite-main
   npm run dev
   ```

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check Console tab
   - Should see: `API Base URL: http://localhost:5000/api`

4. **Test API Connection:**
   - Try to login/signup
   - Check Network tab for API calls
   - Should see successful requests to backend

## Troubleshooting

### API URL Not Loading
- **Check:** `.env` file exists in root directory
- **Check:** Variable name is exactly `VITE_API_URL` (case-sensitive)
- **Check:** Restarted dev server after creating/updating `.env`

### CORS Errors
- **Check:** Backend allows your frontend URL
- **Check:** `FRONTEND_URL` is set in backend `.env`
- **Check:** Backend is running

### 404 Errors on API Calls
- **Check:** API URL ends with `/api`
- **Check:** Backend routes are correct
- **Check:** Backend is running on correct port

## Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend.onrender.com/api`
   - **Environment:** Production, Preview, Development
3. Save and Redeploy

