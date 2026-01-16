# Deployment Guide for Vercel

## Environment Variables Setup

### Required Environment Variables

For Vercel deployment, you need to set the following environment variable:

1. **VITE_API_URL** - Your backend API URL
   - Example for production: `https://your-backend.onrender.com/api`
   - Example for local: `http://localhost:5000/api`

### How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application for changes to take effect

### Local Development Setup

1. Create a `.env` file in the root directory:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Vercel Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Vercel will automatically detect it as a Vite project
4. Add the `VITE_API_URL` environment variable in project settings
5. Deploy!

The `vercel.json` file is already configured for optimal deployment.

## Important Notes

- **Environment Variables**: In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client
- **API URL Format**: Make sure your API URL ends with `/api` or the API client will automatically append it
- **CORS**: Ensure your backend allows requests from your Vercel domain
- **HTTPS**: Production API should use HTTPS for security

