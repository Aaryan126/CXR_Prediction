# Render.com Deployment Guide

This guide will walk you through deploying your Chest X-Ray Disease Prediction application to Render.com.

## Prerequisites

- GitHub account
- Render.com account (free - sign up at https://render.com)
- Your code pushed to a GitHub repository

---

## Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

---

## Step 2: Sign Up for Render.com

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up using your GitHub account (recommended for easier deployment)
4. Authorize Render to access your GitHub repositories

---

## Step 3: Deploy the Backend (Python/FastAPI)

### 3.1 Create New Web Service

1. From your Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - If first time: Click "Configure account" and give Render access
   - Select your repository: `FYP_Website` (or whatever you named it)
4. Click "Connect"

### 3.2 Configure Backend Service

Fill in the following settings:

- **Name**: `xray-prediction-backend` (or any name you prefer)
- **Region**: Choose the closest region to you
- **Branch**: `master` (or your main branch)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan**: `Free`

### 3.3 Add Environment Variables

Click on **"Advanced"** and add these environment variables:

- **Key**: `PYTHON_VERSION`, **Value**: `3.11.0`

### 3.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the build and deployment (this will take 5-10 minutes)
3. Once deployed, you'll see "Your service is live" with a green checkmark
4. **IMPORTANT**: Copy your backend URL (e.g., `https://xray-prediction-backend.onrender.com`)

### 3.5 Important Notes About Model File

⚠️ **Critical**: The `best_model_weighted_loss.pth` file (28MB) must be in your GitHub repository root directory for the backend to access it. Make sure it's committed and pushed:

```bash
git add best_model_weighted_loss.pth
git commit -m "Add model file for deployment"
git push
```

If your model file is too large for GitHub (>100MB), you'll need to:
- Use Git LFS (Large File Storage), OR
- Upload it manually to Render using a different approach

---

## Step 4: Deploy the Frontend (React/Vite)

### 4.1 Create New Static Site

1. From Render dashboard, click **"New +"** button again
2. Select **"Static Site"**
3. Connect the same GitHub repository
4. Click "Connect"

### 4.2 Configure Frontend Service

Fill in the following settings:

- **Name**: `xray-prediction-frontend` (or any name you prefer)
- **Region**: Same region as your backend
- **Branch**: `master`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 4.3 Add Environment Variables

Click on **"Advanced"** and add:

- **Key**: `VITE_API_URL`
- **Value**: Your backend URL from Step 3.4 (e.g., `https://xray-prediction-backend.onrender.com`)

### 4.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for the build (3-5 minutes)
3. Once deployed, you'll get your frontend URL (e.g., `https://xray-prediction-frontend.onrender.com`)

---

## Step 5: Update Backend CORS Settings (Optional but Recommended)

To secure your backend, update CORS to only allow your frontend:

1. Go to your **backend service** in Render dashboard
2. Click on **"Environment"** tab
3. Add a new environment variable:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: Your frontend URL (e.g., `https://xray-prediction-frontend.onrender.com`)
4. Click **"Save Changes"**
5. Your backend will automatically redeploy

---

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Upload a chest X-ray image
3. Verify that predictions and Grad-CAM visualizations appear

**First Request Note**: Since you're on the free tier, services sleep after 15 minutes of inactivity. The first request after sleeping will take ~30 seconds to wake up the backend.

---

## Troubleshooting

### Backend Issues

**Problem**: Model file not found error

**Solution**:
- Ensure `best_model_weighted_loss.pth` is in the repository root
- Check Render logs: Go to backend service → "Logs" tab
- Verify the file path in backend code

**Problem**: Out of memory error

**Solution**:
- Free tier has 512MB RAM limit
- PyTorch CPU inference should work, but if you hit limits:
  - Consider upgrading to Starter plan ($7/month) with 2GB RAM
  - Or optimize model size

### Frontend Issues

**Problem**: Can't connect to backend / CORS errors

**Solution**:
- Verify `VITE_API_URL` environment variable is set correctly
- Check browser console for exact error
- Verify backend is running (visit backend URL directly)

**Problem**: Frontend shows old version

**Solution**:
- Trigger manual redeploy: Backend service → "Manual Deploy" → "Deploy latest commit"

---

## Free Tier Limitations

- **Services sleep after 15 minutes** of inactivity
- **750 hours/month** of runtime (plenty for testing/demo)
- **512MB RAM** for web services
- **100GB bandwidth/month**

These limitations are fine for:
- Personal projects
- Demos
- Portfolio projects
- Low-traffic applications

---

## Costs and Upgrades

If you need to upgrade later:

- **Starter Plan**: $7/month
  - No sleeping
  - 2GB RAM
  - Better for production use

---

## Your Deployed URLs

After completing the steps above, save your URLs:

- **Backend API**: `https://xray-prediction-backend.onrender.com`
- **Frontend App**: `https://xray-prediction-frontend.onrender.com`

Share your frontend URL with anyone to let them use your application!

---

## Monitoring Your Services

In the Render dashboard, you can:
- View logs (Backend service → "Logs")
- Check service health (green checkmark = healthy)
- Monitor resource usage
- View deployment history
- Trigger manual redeployments

---

## Need Help?

- Render Documentation: https://render.com/docs
- Check service logs in Render dashboard
- Verify all environment variables are set correctly
- Test backend endpoint directly: `https://your-backend.onrender.com/health`

---

## Summary Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend service deployed
- [ ] Backend URL copied
- [ ] Frontend service deployed with correct VITE_API_URL
- [ ] CORS settings updated on backend (optional)
- [ ] Application tested and working
- [ ] URLs saved for sharing

**Congratulations!** Your application is now live on the internet! 🎉
