# Quick Deployment Reference

## Files Created for Deployment

1. `render.yaml` - Main Render configuration (optional)
2. `backend/render.yaml` - Backend-specific config
3. `backend/runtime.txt` - Python version specification
4. `frontend/.env.production` - Production environment variables
5. `RENDER_DEPLOYMENT_GUIDE.md` - Full step-by-step guide

## Quick Steps

### 1. Commit and Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

### 2. Deploy Backend on Render.com
- Sign up at https://render.com
- New → Web Service
- Connect GitHub repo
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Save the backend URL!**

### 3. Deploy Frontend on Render.com
- New → Static Site
- Connect same GitHub repo
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variable: `VITE_API_URL` = your backend URL

### 4. Test
Visit your frontend URL and upload an X-ray image!

## Important Notes

- ⚠️ Make sure `best_model_weighted_loss.pth` is in your GitHub repo
- ⏱️ Free tier services sleep after 15 min (first request takes ~30s)
- 🆓 Completely free for testing and demos
- 🔗 Share your frontend URL with anyone!

## Quick Fix Commands

If you need to update and redeploy:
```bash
git add .
git commit -m "Update deployment"
git push
```
Render will automatically redeploy!
