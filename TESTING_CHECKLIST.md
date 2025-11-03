# Testing Checklist

Use this checklist to verify your application is working correctly.

## ✅ Pre-Launch Checklist

### Prerequisites
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] pip installed (`pip --version`)
- [ ] npm installed (`npm --version`)

### Backend Setup
- [ ] Navigated to backend directory
- [ ] Installed dependencies (`pip install -r requirements.txt`)
- [ ] Model file exists (`best_model_weighted_loss.pth` in parent directory)
- [ ] No error messages during installation

### Frontend Setup
- [ ] Navigated to frontend directory
- [ ] Installed dependencies (`npm install`)
- [ ] Created `.env` file from `.env.example`
- [ ] No error messages during installation

---

## 🧪 Backend Testing

### 1. Start Backend Server
- [ ] Open terminal in `backend/` directory
- [ ] Run `python main.py`
- [ ] Wait for startup messages
- [ ] See: "Uvicorn running on http://0.0.0.0:8000"
- [ ] See: "Model loaded successfully"
- [ ] No error messages

### 2. Test Health Endpoint
- [ ] Open browser
- [ ] Visit: `http://localhost:8000/health`
- [ ] Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda" or "cpu"
}
```

### 3. Test Interactive API Docs
- [ ] Visit: `http://localhost:8000/docs`
- [ ] Page loads successfully
- [ ] See endpoints: GET /health, GET /classes, POST /predict
- [ ] Can expand each endpoint

### 4. Test Classes Endpoint
- [ ] Visit: `http://localhost:8000/classes`
- [ ] See list of 14 disease names
- [ ] Includes: Pneumonia, Cardiomegaly, etc.

### 5. Test Prediction Endpoint (Using Swagger UI)
- [ ] Go to `http://localhost:8000/docs`
- [ ] Click on POST `/predict`
- [ ] Click "Try it out"
- [ ] Upload a test X-ray image
- [ ] Click "Execute"
- [ ] Response code: 200
- [ ] Response includes:
  - [ ] `success: true`
  - [ ] `predictions` object with disease names and probabilities
  - [ ] `gradcam_images` object with base64 strings
  - [ ] `original_image` base64 string
  - [ ] `num_predictions` number

---

## 🎨 Frontend Testing

### 1. Start Frontend Server
- [ ] Open NEW terminal in `frontend/` directory
- [ ] Run `npm run dev`
- [ ] Wait for startup
- [ ] See: "Local: http://localhost:3000/"
- [ ] Browser opens automatically

### 2. Initial Page Load
- [ ] Page loads without errors
- [ ] See header: "Chest X-Ray Disease Prediction"
- [ ] See subtitle text
- [ ] See upload area with icon
- [ ] Footer visible at bottom
- [ ] Page styling looks correct (white background, purple gradient header)

### 3. Test Image Upload - Click Method
- [ ] Click on upload area
- [ ] File picker opens
- [ ] Select a chest X-ray image (JPG or PNG)
- [ ] Image preview appears
- [ ] "Click or drag to change image" text visible

### 4. Test Image Upload - Drag and Drop
- [ ] Refresh page
- [ ] Drag an image file over upload area
- [ ] Border changes color (drag active state)
- [ ] Drop the image
- [ ] Image preview appears

### 5. Test Prediction Flow
- [ ] Upload a test X-ray image
- [ ] Loading spinner appears
- [ ] Loading text: "Analyzing X-Ray Image"
- [ ] Wait 2-5 seconds
- [ ] Loading disappears
- [ ] Results section appears

### 6. Test Results Display
- [ ] "Analysis Results" header visible
- [ ] "New Analysis" button visible
- [ ] "Detected Conditions" section shows:
  - [ ] Disease name(s)
  - [ ] Confidence percentage badge
  - [ ] Confidence bar (visual representation)
- [ ] "Grad-CAM Visualization" section shows:
  - [ ] Original X-Ray image on left
  - [ ] Grad-CAM heatmap on right
  - [ ] Heatmap legend (gradient bar)
- [ ] Medical disclaimer banner at bottom

### 7. Test Interactive Features
- [ ] Click on different disease cards
- [ ] Grad-CAM visualization updates
- [ ] Selected card highlights
- [ ] Confidence percentage updates
- [ ] Smooth transitions

### 8. Test Reset Functionality
- [ ] Click "New Analysis" button
- [ ] Results disappear
- [ ] Upload area reappears
- [ ] Can upload new image
- [ ] Process repeats successfully

---

## 🐛 Error Testing

### 1. Test Wrong File Type
- [ ] Try uploading a non-image file (PDF, TXT, etc.)
- [ ] Error message appears
- [ ] Can retry with correct file

### 2. Test Backend Offline
- [ ] Stop backend server (Ctrl+C)
- [ ] Try uploading image from frontend
- [ ] Error message appears
- [ ] Error mentions connection issue
- [ ] Can retry

### 3. Test Large File
- [ ] Upload very large image (>10MB)
- [ ] Processing completes or shows appropriate error
- [ ] System doesn't crash

---

## 📱 Responsive Design Testing

### Desktop (1920x1080)
- [ ] All elements visible
- [ ] Images display side-by-side
- [ ] No horizontal scrolling
- [ ] Proper spacing

### Tablet (768px)
- [ ] Layout adjusts appropriately
- [ ] Images may stack vertically
- [ ] All text readable
- [ ] Buttons accessible

### Mobile (375px)
- [ ] Single column layout
- [ ] Images stack vertically
- [ ] Touch-friendly buttons
- [ ] No text cutoff

---

## 🌐 Browser Compatibility

### Chrome
- [ ] All features work
- [ ] Drag-and-drop functional
- [ ] Images display correctly

### Firefox
- [ ] All features work
- [ ] Drag-and-drop functional
- [ ] Images display correctly

### Edge
- [ ] All features work
- [ ] Drag-and-drop functional
- [ ] Images display correctly

### Safari (if available)
- [ ] All features work
- [ ] Drag-and-drop functional
- [ ] Images display correctly

---

## 🎯 Performance Testing

### Backend Performance
- [ ] Single prediction completes in <5 seconds
- [ ] Server remains responsive
- [ ] No memory leaks after multiple predictions
- [ ] CPU usage returns to normal after prediction

### Frontend Performance
- [ ] Page loads in <2 seconds
- [ ] Smooth animations (no lag)
- [ ] Image upload is responsive
- [ ] No console errors
- [ ] Memory usage stable

---

## 🔍 Detailed API Testing (Advanced)

### Using curl

#### Test Health
```bash
curl http://localhost:8000/health
```
- [ ] Returns JSON with "healthy" status

#### Test Classes
```bash
curl http://localhost:8000/classes
```
- [ ] Returns JSON with 14 disease names

#### Test Prediction
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/xray.jpg"
```
- [ ] Returns complete prediction JSON
- [ ] Includes base64 images
- [ ] No errors in response

---

## 📊 Console Checks

### Backend Console
- [ ] No Python errors
- [ ] See INFO logs for requests
- [ ] Model loads without warnings
- [ ] CUDA/CPU device detected correctly

### Browser Console (F12)
- [ ] No JavaScript errors (red messages)
- [ ] API calls shown in Network tab
- [ ] Successful responses (200 status)
- [ ] No CORS errors

---

## ✨ Final Verification

### Complete Flow
1. [ ] Backend starts without errors
2. [ ] Frontend starts and opens in browser
3. [ ] Can upload image successfully
4. [ ] Predictions display correctly
5. [ ] Grad-CAM visualizations appear
6. [ ] Can switch between different predictions
7. [ ] Can reset and upload new image
8. [ ] Multiple predictions work consecutively
9. [ ] No memory leaks or crashes
10. [ ] Can stop both servers cleanly (Ctrl+C)

---

## 🎓 Demo Preparation

For presenting your project:

- [ ] Have 3-5 test X-ray images ready
- [ ] Test with images showing different diseases
- [ ] Practice explaining the Grad-CAM visualization
- [ ] Know how to start/stop servers quickly
- [ ] Prepare for questions about:
  - [ ] Model architecture (DenseNet-121)
  - [ ] Training process
  - [ ] Grad-CAM technique
  - [ ] API design choices
  - [ ] Frontend framework (React)
  - [ ] Deployment possibilities

---

## 🚨 Common Issues & Solutions

| Issue | Check | Solution |
|-------|-------|----------|
| Backend won't start | Model file location | Move to parent directory |
| Frontend can't connect | Backend running? | Start backend first |
| No predictions | Valid X-ray image? | Use chest X-ray images |
| Slow predictions | GPU available? | Normal on CPU |
| Port conflicts | Other apps running? | Close or change port |
| npm errors | Node version | Update to 16+ |
| Python errors | Dependencies | Reinstall requirements |

---

## 📝 Testing Log Template

Copy this for your testing session:

```
Date: _____________
Tester: _____________

Backend Status: ☐ Pass ☐ Fail
Frontend Status: ☐ Pass ☐ Fail
Upload Functionality: ☐ Pass ☐ Fail
Prediction Accuracy: ☐ Pass ☐ Fail
Grad-CAM Visualization: ☐ Pass ☐ Fail
Error Handling: ☐ Pass ☐ Fail

Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

Overall Status: ☐ Ready for Demo ☐ Needs Work

Notes:
_____________________________________
_____________________________________
_____________________________________
```

---

**Remember**: Test thoroughly before your final presentation! 🎯
