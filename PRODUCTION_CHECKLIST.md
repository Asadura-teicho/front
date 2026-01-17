# Production Deployment Checklist

## ✅ Pre-Deployment Checks

### Frontend (React + Vite)
- [x] Error boundaries implemented
- [x] Global error handlers configured
- [x] API error handling with user-friendly messages
- [x] Network error handling
- [x] Production build optimized
- [x] All routes work without page reloads
- [x] Games load and play correctly
- [x] Authentication flow works
- [x] Payment flow works
- [x] No console errors in production build

### Backend (Node.js + Express)
- [x] CORS configured with frontend URL
- [x] JWT authentication implemented
- [x] Error handling middleware
- [x] All game routes registered
- [x] Database connection secured
- [x] Environment variables validated
- [x] Sweet Bonanza game working
- [x] Gates of Olympus game working
- [x] Payment endpoints working
- [x] Auth endpoints working

### Connection
- [x] API URLs match between frontend and backend
- [x] CORS allows frontend origin
- [x] Authentication flow works end-to-end
- [x] All endpoints accessible
- [x] Error responses handled properly
- [x] Network errors handled gracefully

---

## 🔧 Required Environment Variables

### Frontend (Vercel/Netlify/etc.)

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

**⚠️ CRITICAL:** This must be set or the app won't connect to backend!

### Backend (Render/Railway/etc.)

```bash
# REQUIRED
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-minimum-32-characters-long
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000

# OPTIONAL
ALLOWED_ORIGINS=https://www.your-domain.com,https://admin.your-domain.com
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend

1. Push backend code to your repository
2. Connect to Render/Railway/your hosting
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (set after frontend is deployed)
4. Deploy and get backend URL (e.g., `https://your-app.onrender.com`)

### Step 2: Deploy Frontend

1. Push frontend code to your repository
2. Connect to Vercel/Netlify/your hosting
3. Set environment variable:
   - `VITE_API_URL=https://your-backend-url.com/api`
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Deploy and get frontend URL

### Step 3: Update Backend CORS

1. Go to backend environment variables
2. Update `FRONTEND_URL` with your frontend URL (from Step 2)
3. Redeploy backend

### Step 4: Verify Connection

1. Open frontend in browser
2. Open DevTools → Console
3. Check for: `API Base URL: https://your-backend-url.com/api`
4. If empty or wrong, check `VITE_API_URL` environment variable
5. Try logging in - check Network tab for API calls

---

## 🧪 Testing Checklist

### Authentication
- [ ] Can register new account
- [ ] Can login with email/username
- [ ] Can logout
- [ ] Token stored correctly
- [ ] Protected routes require auth
- [ ] 401 errors redirect to login

### Games
- [ ] Sweet Bonanza loads
- [ ] Sweet Bonanza can play (spin works)
- [ ] Gates of Olympus loads
- [ ] Gates of Olympus can play (spin works)
- [ ] Balance updates after games
- [ ] Win/loss animations work
- [ ] Game history works

### Payments
- [ ] Can view deposit page
- [ ] Can create deposit request
- [ ] Can view deposit requests
- [ ] Can view withdrawal requests
- [ ] Balance displays correctly

### General
- [ ] Navigation works (no page reloads)
- [ ] Games switch correctly
- [ ] Modals open/close correctly
- [ ] Error messages display properly
- [ ] Loading states show correctly
- [ ] Mobile responsive

---

## 🐛 Troubleshooting

### Issue: API calls fail with CORS error

**Solution:**
1. Check `FRONTEND_URL` in backend environment variables
2. Make sure it matches your frontend domain exactly
3. Check backend logs for CORS warnings
4. Verify backend allows your frontend origin

### Issue: "VITE_API_URL is not set"

**Solution:**
1. Add `VITE_API_URL` in frontend hosting platform
2. Format: `https://your-backend.com/api`
3. Redeploy frontend after adding variable

### Issue: Games don't play

**Solution:**
1. Check browser console for errors
2. Verify backend `/api/sweet-bonanza/play` endpoint works
3. Verify backend `/api/gates-of-olympus/play` endpoint works
4. Check if user is authenticated (token in localStorage)
5. Verify balance is sufficient

### Issue: Login doesn't work

**Solution:**
1. Check if backend is running
2. Verify `JWT_SECRET` is set in backend
3. Check browser console for API errors
4. Verify email/username format
5. Check backend logs for authentication errors

---

## 📋 Final Production Checklist

### Before Going Live:
- [ ] All environment variables set correctly
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Database connected
- [ ] Authentication tested
- [ ] Games tested and working
- [ ] Payment flow tested
- [ ] Error handling tested
- [ ] Mobile responsiveness checked
- [ ] Performance checked (lighthouse score)
- [ ] Security headers verified
- [ ] No console errors
- [ ] No linter errors

---

## 🔐 Security Checklist

- [x] JWT_SECRET is secure (min 32 chars, random)
- [x] CORS only allows frontend origin
- [x] Error messages don't expose sensitive info
- [x] API endpoints protected with auth middleware
- [x] Passwords hashed (bcrypt)
- [x] HTTPS enabled (production requirement)
- [x] Environment variables not in code
- [x] Rate limiting considered (if needed)

---

## 📊 Monitoring

After deployment, monitor:
- API response times
- Error rates
- Failed login attempts
- Game play frequency
- Payment transaction success rate
- Server logs for errors

---

## 🎉 You're Production Ready!

If all checkboxes are checked, your app is ready for production!
