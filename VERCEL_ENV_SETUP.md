# Vercel Environment Variables Setup Guide

## Quick Setup for Vercel

### Step 1: Set Environment Variables in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New**

### Step 2: Add Required Variables

#### Required Variable: `VITE_API_URL`

- **Key:** `VITE_API_URL`
- **Value:** `https://your-backend-url.com/api`
  - Replace with your actual backend URL
  - Examples:
    - `https://garbet-backend.onrender.com/api`
    - `https://your-app.railway.app/api`
    - `https://api.yourdomain.com/api`
- **Environment:** Select **ALL** (Production, Preview, Development)
- Click **Save**

### Step 3: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeployment

## Verification

After deployment, verify your environment variables are working:

1. Open your deployed site
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. You should see: `API Base URL configured: https://...`

If you see errors about `VITE_API_URL`, check:
- ✅ Variable name is exactly `VITE_API_URL` (case-sensitive)
- ✅ Variable is set for all environments
- ✅ Value is correct and includes `/api` at the end
- ✅ You've redeployed after setting the variable

## Environment Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API base URL | `https://backend.onrender.com/api` |
| `VITE_DEV_API_URL` | ❌ No | Development API URL override | `http://localhost:5000/api` |

## Important Notes

- **VITE_ Prefix:** All environment variables must start with `VITE_` to be exposed to the client-side code
- **API URL Format:** The URL should end with `/api`. If it doesn't, the app will auto-append it
- **CORS:** Make sure your backend allows requests from your Vercel domain
- **HTTPS:** Production API URLs must use HTTPS for security

## Troubleshooting

### API calls failing with CORS errors

**Solution:** Update backend CORS settings to allow your Vercel domain:
```
https://your-app.vercel.app
```

### API calls returning 404

**Solution:** 
1. Check `VITE_API_URL` ends with `/api`
2. Verify your backend is running and accessible
3. Test the backend URL directly in browser

### Environment variables not updating

**Solution:**
1. Verify variable is set for the correct environment (Production/Preview/Development)
2. Redeploy your application after changing environment variables
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

## Need Help?

Check these files for more details:
- `env.example` - Template for local development
- `.env` - Your local environment variables (don't commit this)
- `DEPLOYMENT.md` - Full deployment guide
- `CONNECTIVITY.md` - API connectivity troubleshooting

