# Getting Started Guide

Follow these steps to set up and run your Chest X-Ray Disease Prediction System.

## Prerequisites

Before you begin, make sure you have installed:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
- **pip** (comes with Python)
- **npm** (comes with Node.js)

## Step 1: Verify Prerequisites

Open a terminal/command prompt and verify installations:

```bash
python --version
pip --version
node --version
npm --version
```

## Step 2: Set Up Backend

### Option A: Using Command Line

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Verify model file exists
# Should see: best_model_weighted_loss.pth in parent directory
```

### Option B: Using Double-Click (Windows)

1. Open the `backend` folder
2. Right-click on `requirements.txt`
3. Open terminal here
4. Run: `pip install -r requirements.txt`

## Step 3: Set Up Frontend

### Open a NEW terminal (keep backend terminal open)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies (this may take a few minutes)
npm install

# Create environment file
copy .env.example .env   # Windows
# or
cp .env.example .env     # Mac/Linux
```

## Step 4: Start the Backend Server

### Terminal 1 - Backend

```bash
cd backend
python main.py
```

**You should see:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Or on Windows, double-click:** `start_backend.bat`

## Step 5: Start the Frontend Server

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Your browser should automatically open to `http://localhost:3000`

**Or on Windows, double-click:** `start_frontend.bat`

## Step 6: Test the Application

1. **Open your browser** to `http://localhost:3000`
2. **Upload a test image**:
   - Click the upload area or drag-and-drop
   - Select a chest X-ray image (JPG or PNG)
3. **Wait for processing** (2-5 seconds)
4. **View results**:
   - See predicted diseases with confidence scores
   - Click different diseases to view Grad-CAM visualizations

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
```bash
pip install -r backend/requirements.txt
```

**Problem**: `FileNotFoundError: Model file not found`
- Ensure `best_model_weighted_loss.pth` is in the main directory
- Check the path in `backend/main.py` line 28

**Problem**: `CUDA out of memory`
- Your GPU doesn't have enough memory
- The code will automatically fall back to CPU
- If still issues, restart the backend

### Frontend Issues

**Problem**: `npm: command not found`
- Install Node.js from nodejs.org
- Restart your terminal

**Problem**: `Port 3000 is already in use`
- Close other applications using port 3000
- Or change port in `frontend/vite.config.js`

**Problem**: `CORS error` in browser console
- Ensure backend is running
- Check `.env` file has correct API URL
- Verify backend shows: `INFO: Application startup complete`

**Problem**: Frontend shows "Network Error"
- Verify backend is running on port 8000
- Check `http://localhost:8000/health` in browser
- Ensure no firewall is blocking connections

## Verifying Everything Works

### Test Backend API

Open browser and visit: `http://localhost:8000/docs`

You should see the interactive API documentation (Swagger UI)

### Test Frontend

1. Visit: `http://localhost:3000`
2. Should see: "Chest X-Ray Disease Prediction" header
3. Upload area should be visible and interactive

## Stopping the Servers

- **Backend**: Press `Ctrl+C` in the backend terminal
- **Frontend**: Press `Ctrl+C` in the frontend terminal

## Next Steps

Once everything is running:

1. **Upload X-ray images** and test predictions
2. **Explore Grad-CAM visualizations** for different diseases
3. **Review the code** to understand how it works
4. **Customize the UI** by editing `frontend/src/App.css`
5. **Add features** as needed for your project

## Useful Commands

### Backend
```bash
# Start backend
cd backend && python main.py

# Start with auto-reload (development)
cd backend && uvicorn main:app --reload

# Check if API is running
curl http://localhost:8000/health
```

### Frontend
```bash
# Start development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

## File Structure Quick Reference

```
FYP_Website/
├── backend/
│   ├── main.py              ← API endpoints
│   ├── model_utils.py       ← Model & Grad-CAM logic
│   └── requirements.txt     ← Python packages
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         ← Main app
│   │   ├── components/     ← React components
│   │   └── App.css         ← Styles
│   └── package.json        ← Node packages
│
├── best_model_weighted_loss.pth  ← Trained model
├── PROJECT_README.md               ← Full documentation
└── GETTING_STARTED.md             ← This file
```

## Need Help?

1. Check `PROJECT_README.md` for detailed documentation
2. Check `backend/README.md` for backend-specific help
3. Check `frontend/README.md` for frontend-specific help
4. Review error messages in terminal carefully
5. Check browser console (F12) for frontend errors

## Important Notes

- **Keep both terminals open** while using the app
- **Backend must start first** before frontend can connect
- **Model file** must be in the correct location
- **Don't commit** the model file to git (it's large)
- **Always test** with valid chest X-ray images

## Production Deployment

For production deployment, refer to:
- `PROJECT_README.md` - Section: "Building for Production"
- Consider using: Docker, AWS, Azure, or Heroku

---

Good luck with your Final Year Project! 🚀
