# Vercel Setup Guide

## Quick Setup Steps

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect Vite configuration

3. **Set Environment Variable:**
   - Go to Project Settings → Environment Variables
   - Add new variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-backend.onrender.com/api` (replace with your actual backend URL)
     - **Environments**: Check all (Production, Preview, Development)
   - Click Save

4. **Deploy:**
   - Click Deploy
   - Wait for build to complete
   - Your site is live! 🎉

## Environment Variables Format

```
VITE_API_URL=https://your-backend-api.com/api
```

**Important Notes:**
- Must start with `VITE_` (Vite requirement)
- Include full URL with protocol (https://)
- Include `/api` at the end if your backend uses that route
- The API client will auto-append `/api` if missing

## Troubleshooting

### Build Fails
- Check that `react` and `react-dom` are in dependencies (already fixed in package.json)
- Ensure all TypeScript errors are resolved
- Check Vercel build logs for specific errors

### API Not Working
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that your backend allows CORS from your Vercel domain
- Verify the API URL format (should end with `/api`)

### 404 Errors on Routes
- The `vercel.json` is configured to handle SPA routing
- All routes redirect to `index.html` for client-side routing

## File Structure

```
Gameswebsite-main/
├── .gitignore          # Git ignore file
├── .env.example        # Environment variables template
├── vercel.json         # Vercel configuration
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
└── src/                # Source code
```

## Build Configuration

The project uses:
- **Framework**: Vite (auto-detected by Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: Latest (auto-detected)

All configured in `vercel.json` and `package.json`.

