# Quick Reference Card

## 🚀 Start Application

### Backend (Terminal 1)
```bash
cd backend
python main.py
```
**Wait for**: `Uvicorn running on http://0.0.0.0:8000`

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
**Wait for**: `Local: http://localhost:3000/`

---

## 📋 Installation Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Backend dependencies: `pip install -r backend/requirements.txt`
- [ ] Frontend dependencies: `cd frontend && npm install`
- [ ] Model file exists: `best_model_weighted_loss.pth`
- [ ] Environment file: Copy `frontend/.env.example` to `frontend/.env`

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web application |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Interactive API docs |
| Health Check | http://localhost:8000/health | Server status |

---

## 📁 File Organization

```
FYP_Website/
├── backend/              # Python + FastAPI
│   ├── main.py          # ⭐ API endpoints
│   ├── model_utils.py   # ⭐ Model & Grad-CAM
│   └── requirements.txt
│
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── App.jsx     # ⭐ Main component
│   │   └── components/  # ⭐ UI components
│   └── package.json
│
└── best_model_weighted_loss.pth  # ⭐ Model
```

---

## 🛠️ Common Commands

### Backend
```bash
# Start server
python backend/main.py

# Start with reload (development)
uvicorn main:app --reload

# Test API
curl http://localhost:8000/health
```

### Frontend
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `Module not found` | Run `pip install -r requirements.txt` |
| `Model file not found` | Check `best_model_weighted_loss.pth` exists |
| `Port already in use` | Close other app or change port |
| `CORS error` | Verify backend is running |
| `npm command not found` | Install Node.js |

---

## 📊 API Endpoints

### GET /health
Check server status
```bash
curl http://localhost:8000/health
```

### POST /predict
Upload image and get predictions
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@xray.jpg"
```

---

## 🎨 Key Components

### Backend
- `DenseNet121MultiLabel` - Model class
- `GradCAM` - Visualization class
- `predict_diseases()` - Inference function
- `generate_gradcam_visualizations()` - Grad-CAM function

### Frontend
- `ImageUpload` - Drag-and-drop upload
- `ResultsDisplay` - Show predictions
- `LoadingSpinner` - Loading state
- `ErrorMessage` - Error handling

---

## 💡 Tips

1. **Keep both terminals open** while using the app
2. **Start backend first**, then frontend
3. **Use Chrome DevTools** (F12) for debugging
4. **Check terminal logs** for errors
5. **Test with valid X-ray images** for best results

---

## 📚 Documentation

- `PROJECT_README.md` - Complete documentation
- `GETTING_STARTED.md` - Step-by-step setup
- `backend/README.md` - Backend details
- `frontend/README.md` - Frontend details
- `FILES_CREATED.md` - All created files

---

## 🎯 Workflow

1. Upload X-ray image
2. API processes image
3. Model predicts diseases
4. Grad-CAM generates visualizations
5. Frontend displays results

---

## ⚙️ Configuration

### Change API URL (Frontend)
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Change Ports
**Backend**: Edit `backend/main.py` line 247
```python
uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Frontend**: Edit `frontend/vite.config.js`
```javascript
server: { port: 3000 }
```

---

## 🔐 Security Notes

- For production: Update CORS settings in `backend/main.py`
- Never commit `.env` files
- Model file is ~30MB, use `.gitignore`

---

## 📞 Need Help?

1. Check error message in terminal
2. Check browser console (F12)
3. Review relevant README file
4. Verify all prerequisites are installed

---

**Made for**: Final Year Project
**Tech Stack**: FastAPI + PyTorch + React
**Model**: DenseNet-121 with Grad-CAM
