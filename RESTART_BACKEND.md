# How to Restart Backend

## The Issue
The backend code has been updated, but the changes won't take effect until you restart the server.

## Solution

### 1. Find Your Backend Terminal
Look for the terminal window where you ran `python main.py`

### 2. Stop the Backend
Press **Ctrl+C** (hold Ctrl, then press C)

You should see it stop.

### 3. Start Backend Again
```bash
cd backend
python main.py
```

### 4. Wait for Confirmation
You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Model loaded successfully from ../best_model_weighted_loss.pth
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 5. Test in Browser
Go back to your browser (where the frontend is open) and:
1. Upload a NEW X-ray image (or click "New Analysis" and re-upload)
2. Check the console (F12)
3. You should now see:
   ```
   All predictions: {Atelectasis: 0.xx, Cardiomegaly: 0.xx, ...}
   ```
4. The "Show All Disease Probabilities (14)" button should appear!

---

## If It Still Doesn't Work

### Check the Backend Response Directly

Open your browser and go to:
```
http://localhost:8000/docs
```

1. Click on **POST /predict**
2. Click **"Try it out"**
3. Upload an image
4. Click **"Execute"**

**Look at the response - it should have:**
```json
{
  "success": true,
  "predictions": {...},
  "all_predictions": {...},    ← THIS SHOULD BE HERE!
  "gradcam_images": {...},
  "original_image": "...",
  "num_predictions": 2,
  "threshold_used": 0.5
}
```

If `all_predictions` is NOT there, the backend code might not have saved correctly.

---

## Quick Verification Command

Run this to verify the backend code is correct:

```bash
grep "all_predictions" backend/main.py
```

You should see 4 lines with `all_predictions` in them.

If you don't see them, the file wasn't saved properly.
