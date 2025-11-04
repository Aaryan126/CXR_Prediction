# Deployment Guide

This guide covers two deployment scenarios:
1. **Full-Stack Deployment** - Deploy both frontend and backend for a complete web application
2. **API-Only Deployment** - Deploy only the backend API for integration with other systems

---

# Option 1: Full-Stack Deployment (Website + API)

Deploy both the React frontend and FastAPI backend so users can access your website.

## Recommended Platforms

### A. **Render** (Easiest - Free Tier Available)

#### Step 1: Prepare Your Project

1. **Create a `render.yaml` file in your project root:**

```yaml
# C:\Users\aarya\Desktop\FYP_Website\render.yaml
services:
  # Backend Service
  - type: web
    name: xray-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0

  # Frontend Service
  - type: web
    name: xray-frontend
    env: static
    buildCommand: "cd frontend && npm install && npm run build"
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://xray-backend.onrender.com
```

2. **Update frontend `.env` to use environment variable:**

Already done - your `App.jsx` uses:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

#### Step 2: Deploy to Render

1. **Sign up**: Go to [render.com](https://render.com) and sign up (free)
2. **Connect GitHub**: Push your code to GitHub first
3. **Create New Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create both services
4. **Upload Model File**:
   - Since `best_model_weighted_loss.pth` is large (~30MB), use Render Disk or environment variable
   - Or upload to cloud storage (S3, Google Cloud Storage)

#### Step 3: Configure Model Storage

**Option A: Use Render Disk (Recommended)**
```yaml
# Add to backend service in render.yaml
disk:
  name: model-storage
  mountPath: /opt/render/project/models
  sizeGB: 1
```

**Option B: Download from Cloud Storage on Startup**

Create `backend/download_model.py`:
```python
import requests
import os

def download_model():
    if not os.path.exists('best_model_weighted_loss.pth'):
        # Upload your model to Google Drive, Dropbox, or S3
        # Get a direct download link
        model_url = "YOUR_MODEL_DOWNLOAD_URL"

        print("Downloading model...")
        response = requests.get(model_url)
        with open('best_model_weighted_loss.pth', 'wb') as f:
            f.write(response.content)
        print("Model downloaded!")

if __name__ == "__main__":
    download_model()
```

Update `render.yaml`:
```yaml
buildCommand: "cd backend && pip install -r requirements.txt && python download_model.py"
```

#### Costs:
- **Free Tier**: Available (with limitations - services sleep after inactivity)
- **Paid**: ~$7/month per service for always-on

---

### B. **Railway** (Simple, Auto-deploys from Git)

#### Step 1: Prepare Project

1. **Create `railway.json`:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Create `Procfile` for backend:**

```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Step 2: Deploy

1. **Sign up**: [railway.app](https://railway.app)
2. **New Project**: Click "New Project" → "Deploy from GitHub"
3. **Add Services**:
   - Backend: Auto-detected (Python)
   - Frontend: Add new service → Static site
4. **Set Environment Variables**:
   - Frontend: `VITE_API_URL=https://your-backend.railway.app`

#### Costs:
- **Free**: $5 credit/month
- **Paid**: Pay-as-you-go (~$5-20/month depending on usage)

---

### C. **Vercel (Frontend) + Render/Railway (Backend)**

Best for production-grade deployment.

#### Frontend on Vercel:

1. **Sign up**: [vercel.com](https://vercel.com)
2. **Import Project**: Connect GitHub repo
3. **Configure**:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: Your backend URL

#### Backend on Render/Railway:
Follow steps above for backend only.

#### Costs:
- **Vercel**: Free for hobby projects
- **Backend**: ~$7/month (Render) or pay-as-you-go (Railway)

---

### D. **AWS (Most Flexible, Scalable)**

For production applications with high traffic.

#### Architecture:
- **Frontend**: S3 + CloudFront (CDN)
- **Backend**: EC2 or ECS (Docker container)
- **Model Storage**: S3 bucket

#### Quick Setup:

**Backend on EC2:**

1. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t2.medium or larger (model needs ~4GB RAM)
   - Open ports: 22 (SSH), 8000 (API)

2. **SSH into instance and setup**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3-pip python3-venv -y

# Clone your repo
git clone YOUR_REPO_URL
cd FYP_Website

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Download model (upload to S3 first)
aws s3 cp s3://your-bucket/best_model_weighted_loss.pth .

# Install PM2 for process management
sudo npm install -g pm2

# Start backend
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name xray-api
pm2 save
pm2 startup
```

3. **Configure Nginx as reverse proxy**:
```bash
sudo apt install nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/xray-api
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/xray-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Frontend on S3:**

```bash
# Build frontend
cd frontend
npm install
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --acl public-read

# Setup CloudFront for CDN (optional but recommended)
```

#### Costs:
- **EC2 t2.medium**: ~$30/month
- **S3 + CloudFront**: ~$1-5/month
- **Total**: ~$35-40/month

---

# Option 2: API-Only Deployment

Deploy only the backend for others to integrate with their systems.

## Best Options for API Deployment

### A. **Render (Recommended for API)**

#### Step 1: Create `render.yaml`

```yaml
services:
  - type: web
    name: xray-disease-api
    env: python
    region: oregon
    plan: starter
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: MODEL_PATH
        value: ../best_model_weighted_loss.pth
```

#### Step 2: Deploy

1. Push to GitHub
2. Go to Render → New Web Service
3. Connect repository
4. Render auto-detects settings
5. Add model file to Render Disk

**Your API will be at**: `https://xray-disease-api.onrender.com`

#### Step 3: API Documentation

Users can access:
- **API Docs**: `https://xray-disease-api.onrender.com/docs`
- **Health Check**: `https://xray-disease-api.onrender.com/health`
- **Endpoints**: All your FastAPI endpoints

---

### B. **AWS Lambda + API Gateway (Serverless)**

Best for sporadic usage (only pay when API is called).

#### Setup:

1. **Create Lambda function**:
```bash
# Package your application
pip install -t ./package -r requirements.txt
cd package
zip -r ../deployment-package.zip .
cd ..
zip -g deployment-package.zip backend/*.py
```

2. **Deploy using AWS SAM or Serverless Framework**:

**serverless.yml:**
```yaml
service: xray-disease-api

provider:
  name: aws
  runtime: python3.11
  region: us-east-1
  timeout: 60
  memorySize: 3008

functions:
  api:
    handler: backend.main.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

#### Costs:
- **Free Tier**: 1M requests/month
- **After**: ~$0.20 per 1M requests
- **Cold start**: 2-5 seconds (first request)

---

### C. **DigitalOcean App Platform**

Simple, affordable API hosting.

#### Step 1: Create `app.yaml`

```yaml
name: xray-disease-api
services:
  - name: api
    github:
      repo: your-username/your-repo
      branch: main
      deploy_on_push: true
    source_dir: /backend
    run_command: uvicorn main:app --host 0.0.0.0 --port 8080
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xs
    envs:
      - key: MODEL_PATH
        value: ../best_model_weighted_loss.pth
```

#### Costs:
- **Basic**: $5/month
- **Professional**: $12/month (better performance)

---

### D. **Google Cloud Run (Containerized)**

Deploy as Docker container, auto-scales to zero.

#### Step 1: Create `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY backend/ .
COPY best_model_weighted_loss.pth /app/

# Expose port
EXPOSE 8080

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

#### Step 2: Deploy

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/xray-api

# Deploy to Cloud Run
gcloud run deploy xray-api \
  --image gcr.io/PROJECT_ID/xray-api \
  --platform managed \
  --region us-central1 \
  --memory 4Gi \
  --allow-unauthenticated
```

#### Costs:
- **Free Tier**: 2M requests/month
- **After**: Pay per request (~$0.40 per 1M requests)
- **Idle**: $0 (scales to zero)

---

## API Documentation for Users

Once deployed, provide users with:

### 1. **Base URL**
```
https://your-api-domain.com
```

### 2. **Authentication** (if you add it later)
```python
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
```

### 3. **Usage Example**

**Python:**
```python
import requests

# Health check
response = requests.get("https://your-api-domain.com/health")
print(response.json())

# Predict
with open("xray.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post(
        "https://your-api-domain.com/predict",
        files=files
    )

predictions = response.json()
print(predictions["predictions"])
print(predictions["all_predictions"])
```

**cURL:**
```bash
curl -X POST "https://your-api-domain.com/predict" \
  -H "accept: application/json" \
  -F "file=@xray.jpg"
```

**JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('https://your-api-domain.com/predict', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data.predictions));
```

### 4. **Interactive Docs**
Direct users to: `https://your-api-domain.com/docs`

---

## Comparison Table

| Platform | Type | Cost | Best For | Effort |
|----------|------|------|----------|--------|
| **Render** | Full/API | Free-$7/mo | Small projects | ⭐ Easy |
| **Railway** | Full/API | $5-20/mo | Auto-deploy | ⭐ Easy |
| **Vercel+Render** | Full | $0-7/mo | Production web | ⭐⭐ Medium |
| **AWS EC2** | Full/API | $35+/mo | High traffic | ⭐⭐⭐ Hard |
| **DigitalOcean** | API | $5-12/mo | Simple API | ⭐ Easy |
| **Google Cloud Run** | API | Pay-per-use | Variable traffic | ⭐⭐ Medium |
| **AWS Lambda** | API | Pay-per-use | Sporadic usage | ⭐⭐⭐ Hard |

---

## Recommendations

### For Learning/FYP Demo:
✅ **Render** (free tier) or **Railway** ($5/month)
- Easy setup
- Auto-deploys from GitHub
- Free/cheap
- Good for demos

### For Production Web App:
✅ **Vercel (Frontend) + Render (Backend)**
- Professional
- Fast CDN
- Reliable
- Affordable

### For API-Only (Integration):
✅ **Render** or **Google Cloud Run**
- Good documentation
- Auto-scaling
- Cost-effective
- Easy to use

### For High-Traffic Production:
✅ **AWS (EC2 + S3 + CloudFront)**
- Most scalable
- Full control
- Best performance
- Worth the complexity

---

## Security Considerations

Before deploying to production:

1. **Add API Rate Limiting**:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/predict")
@limiter.limit("10/minute")
async def predict(...):
    ...
```

2. **Add API Key Authentication**:
```python
from fastapi import Security, HTTPException
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key")

def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != os.getenv("API_KEY"):
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key
```

3. **Use HTTPS** (automatically provided by most platforms)

4. **Set CORS properly**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Not "*"
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)
```

5. **Add input validation and file size limits**

---

## Next Steps

1. **Choose your deployment option** based on your needs
2. **Set up GitHub repository** (if not already done)
3. **Follow the specific guide** for your chosen platform
4. **Test the deployed API/website**
5. **Share the URL** with your users/evaluators

Need help with a specific platform? Let me know which one you'd like to use!
