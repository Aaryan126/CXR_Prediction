# Chest X-Ray Disease Prediction API

FastAPI backend for chest X-ray disease prediction with Grad-CAM visualization.

## Features

- Multi-label disease classification (14 disease classes)
- Grad-CAM visualization generation
- RESTful API with CORS support
- Automatic model loading on startup
- Error handling and logging

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Model File

Ensure the trained model file `best_model_weighted_loss.pth` is in the parent directory:

```
FYP_Website/
├── backend/
│   ├── main.py
│   ├── model_utils.py
│   └── requirements.txt
└── best_model_weighted_loss.pth
```

### 3. Run the Server

```bash
cd backend
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### GET `/`
Root endpoint - returns API status

### GET `/health`
Health check endpoint

### GET `/classes`
Returns list of disease classes

### POST `/predict`
Upload X-ray image and get predictions with Grad-CAM visualizations

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (image file - JPG/PNG)

**Response:**
```json
{
  "success": true,
  "predictions": {
    "Pneumonia": 0.87,
    "Cardiomegaly": 0.62
  },
  "gradcam_images": {
    "Pneumonia": "base64_encoded_string",
    "Cardiomegaly": "base64_encoded_string"
  },
  "original_image": "base64_encoded_string",
  "num_predictions": 2
}
```

### POST `/predict-with-threshold`
Same as `/predict` but with custom confidence threshold

**Parameters:**
- file: Image file
- threshold: Float (0.0 - 1.0)

## Testing

You can test the API using curl:

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/xray.jpg"
```

Or visit the auto-generated docs at `http://localhost:8000/docs`

## Disease Classes

1. Atelectasis
2. Cardiomegaly
3. Effusion
4. Infiltration
5. Mass
6. Nodule
7. Pneumonia
8. Pneumothorax
9. Consolidation
10. Edema
11. Emphysema
12. Fibrosis
13. Pleural_Thickening
14. Hernia
