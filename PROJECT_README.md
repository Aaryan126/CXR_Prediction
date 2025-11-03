# Chest X-Ray Disease Prediction System

Complete full-stack application for chest X-ray disease prediction with Grad-CAM visualization.

## Overview

This project combines deep learning, computer vision, and web development to create an interactive tool for analyzing chest X-ray images. The system can predict multiple diseases simultaneously and provides visual explanations using Grad-CAM heatmaps.

## Architecture

```
FYP_Website/
├── backend/                    # FastAPI server
│   ├── main.py                # API endpoints
│   ├── model_utils.py         # Model loading and Grad-CAM
│   ├── requirements.txt       # Python dependencies
│   └── README.md
│
├── frontend/                   # React web application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Styling
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── README.md
│
├── best_model_weighted_loss.pth   # Trained model weights
├── DenseNet-121 (MAIN).ipynb      # Training notebook
├── GradCAM (MAIN).ipynb           # Grad-CAM notebook
└── PROJECT_README.md               # This file
```

## Features

### Backend (FastAPI)
- Multi-label disease classification (14 diseases)
- Grad-CAM visualization generation
- RESTful API with CORS support
- Automatic model loading on startup
- Error handling and logging
- Base64 image encoding for easy frontend integration

### Frontend (React)
- Clean, minimal white design
- Drag-and-drop image upload
- Real-time predictions with confidence scores
- Interactive Grad-CAM visualizations
- Responsive layout
- Loading states and error handling

### Supported Diseases
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

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- CUDA-capable GPU (optional, but recommended)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Ensure model file is in parent directory
# FYP_Website/best_model_weighted_loss.pth

# Run the server
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set API URL (default: http://localhost:8000)

# Run development server
npm run dev
```

The web app will open at `http://localhost:3000`

## Usage Flow

1. **Start Backend**: Run the FastAPI server (loads model automatically)
2. **Start Frontend**: Run the React development server
3. **Upload Image**: Drag and drop or click to upload a chest X-ray image
4. **Wait**: The system processes the image (usually 2-5 seconds)
5. **View Results**: See predicted diseases with confidence scores
6. **Explore Visualizations**: Click different diseases to view their Grad-CAM heatmaps
7. **New Analysis**: Click "New Analysis" to upload another image

## API Documentation

Once the backend is running, visit:
- **Interactive Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### GET `/health`
Check if the API is running and model is loaded

#### GET `/classes`
Get list of disease classes

#### POST `/predict`
Upload image and get predictions with Grad-CAM visualizations

**Request**:
- Content-Type: multipart/form-data
- Body: file (image file)

**Response**:
```json
{
  "success": true,
  "predictions": {
    "Pneumonia": 0.87,
    "Cardiomegaly": 0.62
  },
  "gradcam_images": {
    "Pneumonia": "base64_encoded_image",
    "Cardiomegaly": "base64_encoded_image"
  },
  "original_image": "base64_encoded_image",
  "num_predictions": 2
}
```

## Model Details

- **Architecture**: DenseNet-121 (pre-trained on ImageNet)
- **Task**: Multi-label classification
- **Input**: Chest X-ray images (224x224 RGB)
- **Output**: 14 disease probabilities (sigmoid activation)
- **Training**: Weighted Binary Cross-Entropy Loss
- **Visualization**: Grad-CAM on final convolutional layer

## Technology Stack

### Backend
- FastAPI - Web framework
- PyTorch - Deep learning
- TorchVision - Model and transforms
- OpenCV - Image processing
- Pillow - Image handling
- NumPy - Numerical operations

### Frontend
- React 18 - UI framework
- Vite - Build tool
- CSS3 - Styling

## Development

### Running in Development Mode

**Backend** (with auto-reload):
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (with hot-reload):
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend**:
```bash
# Use gunicorn or uvicorn for production
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend**:
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx or any static server
```

## Testing

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction endpoint
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/xray.jpg"
```

### Frontend Testing
- Open `http://localhost:3000` in your browser
- Upload a chest X-ray image
- Verify predictions and visualizations display correctly

## Troubleshooting

### Model Not Loading
- Verify `best_model_weighted_loss.pth` is in the correct location
- Check file permissions
- Ensure PyTorch is installed correctly

### CORS Issues
- Backend has CORS enabled for all origins in development
- For production, update `allow_origins` in `backend/main.py`

### Performance Issues
- Use GPU if available (CUDA)
- Reduce image size before upload
- Consider batch processing for multiple images

## Future Enhancements

- [ ] Add user authentication
- [ ] Store analysis history
- [ ] Export reports as PDF
- [ ] Support DICOM format
- [ ] Add more visualization techniques (Attention maps, Saliency maps)
- [ ] Implement model ensemble
- [ ] Add confidence calibration
- [ ] Deploy to cloud (AWS, Azure, GCP)

## Credits

- **Model Architecture**: DenseNet-121 (Huang et al., 2017)
- **Visualization**: Grad-CAM (Selvaraju et al., 2017)
- **Dataset**: NIH Chest X-ray Dataset (Wang et al., 2017)

## License

This project is developed for educational purposes as part of a Final Year Project.

## Disclaimer

This tool is for educational and research purposes only. It should not be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare professionals for medical advice.

## Contact

For questions or issues, please open an issue in the project repository.
