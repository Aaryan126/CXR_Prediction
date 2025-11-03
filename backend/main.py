from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
import logging
import os
from model_utils import (
    load_model,
    preprocess_image,
    predict_diseases,
    generate_gradcam_visualizations,
    image_to_base64,
    CLASS_NAMES
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Chest X-Ray Disease Prediction API",
    description="API for predicting chest diseases from X-ray images with Grad-CAM visualization",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model
MODEL = None
DEVICE = None
MODEL_PATH = "../best_model_weighted_loss.pth"


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    global MODEL, DEVICE
    try:
        DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {DEVICE}")

        # Check if model file exists
        if not os.path.exists(MODEL_PATH):
            logger.error(f"Model file not found at {MODEL_PATH}")
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

        MODEL = load_model(MODEL_PATH, DEVICE)
        logger.info("Model loaded successfully on startup")
    except Exception as e:
        logger.error(f"Failed to load model on startup: {str(e)}")
        raise


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Chest X-Ray Disease Prediction API",
        "status": "running",
        "device": str(DEVICE),
        "model_loaded": MODEL is not None
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": MODEL is not None,
        "device": str(DEVICE)
    }


@app.get("/classes")
async def get_classes():
    """Get list of disease classes"""
    return {
        "classes": CLASS_NAMES,
        "num_classes": len(CLASS_NAMES)
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict diseases from uploaded chest X-ray image and generate Grad-CAM visualizations

    Args:
        file: Uploaded image file (JPG/PNG)

    Returns:
        JSON response containing:
        - predictions: Dictionary of disease names and probabilities
        - gradcam_images: Dictionary of disease names and base64-encoded Grad-CAM images
        - original_image: Base64-encoded original image
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image (JPG/PNG)"
            )

        logger.info(f"Processing file: {file.filename}")

        # Check if model is loaded
        if MODEL is None:
            raise HTTPException(
                status_code=500,
                detail="Model not loaded. Please check server logs."
            )

        # Read image file
        image_bytes = await file.read()

        # Preprocess image
        input_tensor, original_image = preprocess_image(image_bytes)

        # Get predictions
        predictions, all_probs = predict_diseases(MODEL, input_tensor, DEVICE, threshold=0.5)

        # Generate Grad-CAM visualizations for predicted diseases
        gradcam_images = generate_gradcam_visualizations(
            MODEL, input_tensor, original_image, predictions, DEVICE
        )

        # Convert original image to base64
        original_image_base64 = image_to_base64(original_image)

        # Prepare response
        response = {
            "success": True,
            "predictions": predictions,
            "gradcam_images": gradcam_images,
            "original_image": original_image_base64,
            "num_predictions": len(predictions)
        }

        logger.info(f"Successfully processed {file.filename} with {len(predictions)} predictions")

        return JSONResponse(content=response)

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.post("/predict-with-threshold")
async def predict_with_threshold(file: UploadFile = File(...), threshold: float = 0.5):
    """
    Predict diseases with custom threshold

    Args:
        file: Uploaded image file (JPG/PNG)
        threshold: Confidence threshold (0.0 - 1.0)

    Returns:
        JSON response with predictions and Grad-CAM visualizations
    """
    try:
        # Validate threshold
        if not 0.0 <= threshold <= 1.0:
            raise HTTPException(
                status_code=400,
                detail="Threshold must be between 0.0 and 1.0"
            )

        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image (JPG/PNG)"
            )

        logger.info(f"Processing file: {file.filename} with threshold: {threshold}")

        # Check if model is loaded
        if MODEL is None:
            raise HTTPException(
                status_code=500,
                detail="Model not loaded. Please check server logs."
            )

        # Read image file
        image_bytes = await file.read()

        # Preprocess image
        input_tensor, original_image = preprocess_image(image_bytes)

        # Get predictions with custom threshold
        predictions, all_probs = predict_diseases(MODEL, input_tensor, DEVICE, threshold=threshold)

        # Generate Grad-CAM visualizations
        gradcam_images = generate_gradcam_visualizations(
            MODEL, input_tensor, original_image, predictions, DEVICE
        )

        # Convert original image to base64
        original_image_base64 = image_to_base64(original_image)

        # Prepare response
        response = {
            "success": True,
            "predictions": predictions,
            "gradcam_images": gradcam_images,
            "original_image": original_image_base64,
            "threshold_used": threshold,
            "num_predictions": len(predictions)
        }

        return JSONResponse(content=response)

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
