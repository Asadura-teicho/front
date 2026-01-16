# Setup Checklist - Gameswebsite-main

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Created `.env` file in root directory
- [ ] Set `VITE_API_URL=http://localhost:5000/api` (for local dev)
- [ ] For Vercel: Set `VITE_API_URL` in project settings

### 2. Dependencies
- [ ] Ran `npm install` in Gameswebsite-main
- [ ] All dependencies installed without errors
- [ ] axios is installed (`npm list axios`)

### 3. Backend Connection
- [ ] Backend is running (`cd Backend && npm start`)
- [ ] Backend allows CORS from frontend URL
- [ ] Backend `.env` has `FRONTEND_URL` set (for production)

### 4. Testing
- [ ] Dev server starts: `npm run dev`
- [ ] Browser console shows: `API Base URL: http://localhost:5000/api`
- [ ] Login/Signup forms work
- [ ] API calls succeed (check Network tab)

### 5. Build Test
- [ ] Production build works: `npm run build`
- [ ] No build errors
- [ ] `dist/` folder created successfully

### 6. Vercel Deployment
- [ ] Code pushed to GitHub
- [ ] Project imported in Vercel
- [ ] Environment variable `VITE_API_URL` set in Vercel
- [ ] Deployed successfully
- [ ] Production site works

## 🔍 Troubleshooting

### If API calls fail:
1. Check `.env` file exists and has correct `VITE_API_URL`
2. Check backend is running
3. Check browser console for errors
4. Check Network tab for failed requests

### If CORS errors:
1. Check backend `FRONTEND_URL` environment variable
2. Verify frontend URL is in backend allowed origins
3. Restart backend after changing environment variables

### If build fails:
1. Check all dependencies installed: `npm install`
2. Check for TypeScript errors
3. Clear cache: `rm -rf node_modules/.vite`
4. Try: `npm run build` again

