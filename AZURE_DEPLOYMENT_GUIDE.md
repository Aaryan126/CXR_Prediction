# Azure Deployment Guide for Chest X-Ray Prediction App

This guide will walk you through deploying your chest X-ray disease prediction application to Microsoft Azure.

## Prerequisites

1. Azure account with active subscription ($200 free credit for new accounts)
2. Azure CLI installed on your machine
3. Git installed and repository ready

## Architecture Overview

- **Backend**: Azure App Service (Python 3.11)
- **Frontend**: Azure Static Web Apps
- **Model Storage**: Included in backend deployment

## Step-by-Step Deployment

### Step 1: Install Azure CLI

**Windows:**
1. Download from: https://aka.ms/installazurecliwindows
2. Run the MSI installer
3. Restart your terminal
4. Verify: `az --version`

**Or use PowerShell (as Administrator):**
```powershell
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
Remove-Item .\AzureCLI.msi
```

### Step 2: Login to Azure

```bash
az login
```

This will open a browser window for authentication. Sign in with your Azure account.

### Step 3: Set Configuration Variables

```bash
# Set your preferred names (must be globally unique for web apps)
RESOURCE_GROUP="xray-prediction-rg"
LOCATION="eastus"
APP_SERVICE_PLAN="xray-prediction-plan"
BACKEND_APP_NAME="xray-backend-$(openssl rand -hex 4)"  # Creates unique name
FRONTEND_APP_NAME="xray-frontend-$(openssl rand -hex 4)"  # Creates unique name

echo "Backend will be: ${BACKEND_APP_NAME}.azurewebsites.net"
echo "Frontend will be: ${FRONTEND_APP_NAME}.azurestaticapps.net"
```

### Step 4: Create Resource Group

A resource group is a container that holds related Azure resources.

```bash
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION
```

### Step 5: Create App Service Plan

The App Service Plan defines the compute resources for your backend.

**For Free Tier (F1):**
```bash
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku F1 \
    --is-linux
```

**For Better Performance (B1 - Basic):**
```bash
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku B1 \
    --is-linux
```

> **Note**: Free tier (F1) has limitations (60 minutes/day CPU time, 1GB RAM). For production, consider B1 or higher.

### Step 6: Create Backend Web App

```bash
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $BACKEND_APP_NAME \
    --runtime "PYTHON:3.11"
```

### Step 7: Configure Backend Environment Variables

```bash
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --settings \
        ALLOWED_ORIGINS="https://${FRONTEND_APP_NAME}.azurestaticapps.net,http://localhost:5173" \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true \
        PYTHON_VERSION="3.11"
```

### Step 8: Configure Startup Command

```bash
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --startup-file "startup.sh"
```

### Step 9: Deploy Backend Code

**Option A: Deploy from Local Git**

1. Configure local Git deployment:
```bash
az webapp deployment source config-local-git \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP
```

2. Get deployment credentials:
```bash
az webapp deployment list-publishing-credentials \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "{username:publishingUserName, password:publishingPassword}"
```

3. Add Azure remote and push:
```bash
cd backend
git init
git add .
git commit -m "Initial backend deployment"
git remote add azure <GIT_URL_FROM_STEP_1>
git push azure master
```

**Option B: Deploy from ZIP (Recommended)**

1. Create deployment package:
```bash
# Make sure you're in the project root
cd backend
zip -r ../backend-deploy.zip . ../best_model_weighted_loss.pth
cd ..
```

2. Deploy:
```bash
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --src backend-deploy.zip
```

### Step 10: Deploy Frontend to Azure Static Web Apps

**Option A: Using GitHub Actions (Recommended)**

1. Create Static Web App:
```bash
az staticwebapp create \
    --name $FRONTEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --source https://github.com/YOUR_USERNAME/YOUR_REPO \
    --branch master \
    --app-location "/frontend" \
    --output-location "dist" \
    --login-with-github
```

2. This will:
   - Create a GitHub Actions workflow
   - Automatically deploy on every push to master
   - Build your React app with Vite

**Option B: Manual Deployment with SWA CLI**

1. Install Static Web Apps CLI:
```bash
npm install -g @azure/static-web-apps-cli
```

2. Build frontend:
```bash
cd frontend
npm install
npm run build
```

3. Get deployment token:
```bash
az staticwebapp secrets list \
    --name $FRONTEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "properties.apiKey"
```

4. Deploy:
```bash
swa deploy ./dist \
    --deployment-token <TOKEN_FROM_STEP_3> \
    --app-name $FRONTEND_APP_NAME
```

### Step 11: Update Frontend Environment Variables

1. Create production environment file:
```bash
cd frontend
echo "VITE_API_URL=https://${BACKEND_APP_NAME}.azurewebsites.net" > .env.production
```

2. Rebuild and redeploy frontend:
```bash
npm run build
# Then deploy again using your chosen method
```

### Step 12: Configure CORS (If Needed)

If you encounter CORS issues:

```bash
az webapp cors add \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --allowed-origins "https://${FRONTEND_APP_NAME}.azurestaticapps.net"
```

### Step 13: Monitor and Test

1. **View Backend Logs**:
```bash
az webapp log tail \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME
```

2. **Test Backend Health**:
```bash
curl https://${BACKEND_APP_NAME}.azurewebsites.net/health
```

3. **View Application URLs**:
```bash
echo "Backend URL: https://${BACKEND_APP_NAME}.azurewebsites.net"
echo "Frontend URL: https://${FRONTEND_APP_NAME}.azurestaticapps.net"
```

## Troubleshooting

### Backend Issues

**Application not starting:**
```bash
# Check logs
az webapp log tail --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME

# Check app service status
az webapp show --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --query state
```

**Model not loading:**
- Ensure `best_model_weighted_loss.pth` is included in deployment
- Check file size limits (F1 tier has restrictions)
- Verify model path in `main.py`

**Timeout errors:**
- Increase timeout in startup.sh: `--timeout 600`
- Consider upgrading to B1 or higher tier

### Frontend Issues

**API calls failing:**
- Check CORS configuration
- Verify `.env.production` has correct backend URL
- Ensure backend is running: `curl https://YOUR-BACKEND.azurewebsites.net/health`

**Build failures:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs in Azure portal

### CORS Errors

```bash
# Add allowed origins
az webapp cors add \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --allowed-origins "https://YOUR-FRONTEND.azurestaticapps.net"
```

## Cost Management

### Free Tier Usage

**App Service F1:**
- 60 minutes/day compute time
- 1 GB RAM
- 1 GB storage

**Static Web Apps Free:**
- 100 GB bandwidth/month
- Unlimited static assets

### Monitoring Costs

```bash
# View current costs
az consumption usage list \
    --resource-group $RESOURCE_GROUP \
    --start-date 2024-01-01 \
    --end-date 2024-12-31
```

### Stopping Services

**Stop backend (to save costs):**
```bash
az webapp stop --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME
```

**Start backend:**
```bash
az webapp start --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME
```

## Scaling

### Horizontal Scaling (More Instances)

```bash
az appservice plan update \
    --resource-group $RESOURCE_GROUP \
    --name $APP_SERVICE_PLAN \
    --number-of-workers 2
```

### Vertical Scaling (Bigger Instance)

```bash
az appservice plan update \
    --resource-group $RESOURCE_GROUP \
    --name $APP_SERVICE_PLAN \
    --sku B2
```

## Cleanup

To delete all resources and stop billing:

```bash
az group delete \
    --name $RESOURCE_GROUP \
    --yes \
    --no-wait
```

## Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificate (free with Azure)
3. Set up Application Insights for monitoring
4. Configure auto-scaling rules
5. Set up CI/CD pipeline with GitHub Actions

## Useful Commands

```bash
# Restart backend
az webapp restart --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME

# View backend settings
az webapp config appsettings list --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME

# SSH into backend container
az webapp ssh --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME

# Download logs
az webapp log download --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME
```

## Resources

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
