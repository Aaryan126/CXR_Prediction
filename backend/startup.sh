#!/bin/bash

# Azure App Service Startup Script for FastAPI Backend

echo "Starting Chest X-Ray Prediction API..."

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Start the application with gunicorn (production-ready WSGI server)
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000 --timeout 300
