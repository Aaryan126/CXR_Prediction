#!/bin/bash

# Azure Deployment Script for Chest X-Ray Prediction App
# This script automates the deployment of both backend and frontend to Azure

# Configuration Variables
RESOURCE_GROUP="xray-prediction-rg"
LOCATION="eastus"
APP_SERVICE_PLAN="xray-prediction-plan"
BACKEND_APP_NAME="xray-prediction-backend"
FRONTEND_APP_NAME="xray-prediction-frontend"
PYTHON_VERSION="3.11"

echo "==================================="
echo "Azure Deployment Script"
echo "==================================="
echo ""

# Step 1: Login to Azure
echo "Step 1: Logging in to Azure..."
az login
if [ $? -ne 0 ]; then
    echo "Error: Azure login failed"
    exit 1
fi

# Step 2: Create Resource Group
echo ""
echo "Step 2: Creating Resource Group..."
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION
if [ $? -ne 0 ]; then
    echo "Error: Failed to create resource group"
    exit 1
fi

# Step 3: Create App Service Plan (Free tier)
echo ""
echo "Step 3: Creating App Service Plan..."
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku F1 \
    --is-linux
if [ $? -ne 0 ]; then
    echo "Error: Failed to create app service plan"
    exit 1
fi

# Step 4: Create Backend Web App
echo ""
echo "Step 4: Creating Backend Web App..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $BACKEND_APP_NAME \
    --runtime "PYTHON:$PYTHON_VERSION"
if [ $? -ne 0 ]; then
    echo "Error: Failed to create backend web app"
    exit 1
fi

# Step 5: Configure Backend App Settings
echo ""
echo "Step 5: Configuring Backend App Settings..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --settings \
        ALLOWED_ORIGINS="https://${FRONTEND_APP_NAME}.azurewebsites.net" \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true \
        PYTHON_VERSION=$PYTHON_VERSION
if [ $? -ne 0 ]; then
    echo "Error: Failed to configure backend app settings"
    exit 1
fi

# Step 6: Deploy Backend Code
echo ""
echo "Step 6: Deploying Backend Code..."
cd backend
zip -r ../backend.zip .
cd ..
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --src backend.zip
if [ $? -ne 0 ]; then
    echo "Error: Failed to deploy backend"
    exit 1
fi

# Step 7: Create Static Web App for Frontend
echo ""
echo "Step 7: Creating Static Web App for Frontend..."
az staticwebapp create \
    --name $FRONTEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION
if [ $? -ne 0 ]; then
    echo "Error: Failed to create static web app"
    exit 1
fi

echo ""
echo "==================================="
echo "Deployment Complete!"
echo "==================================="
echo ""
echo "Backend URL: https://${BACKEND_APP_NAME}.azurewebsites.net"
echo "Frontend URL: https://${FRONTEND_APP_NAME}.azurewebsites.net"
echo ""
echo "Next Steps:"
echo "1. Update frontend environment variables with backend URL"
echo "2. Deploy frontend code to Static Web App"
echo "3. Test the application"
