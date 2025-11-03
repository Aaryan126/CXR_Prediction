import torch
from torchvision import models, transforms
from torch import nn
import numpy as np
import cv2
from PIL import Image
import base64
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Disease class names (14 classes)
CLASS_NAMES = [
    'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration', 'Mass',
    'Nodule', 'Pneumonia', 'Pneumothorax', 'Consolidation', 'Edema',
    'Emphysema', 'Fibrosis', 'Pleural_Thickening', 'Hernia'
]


class DenseNet121MultiLabel(nn.Module):
    """DenseNet-121 model for multi-label chest X-ray classification"""

    def __init__(self, num_labels=14, dropout_rate=0.2):
        super(DenseNet121MultiLabel, self).__init__()
        self.densenet = models.densenet121(weights=models.DenseNet121_Weights.DEFAULT)
        in_features = self.densenet.classifier.in_features
        self.densenet.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(in_features, num_labels),
        )

    def forward(self, x):
        x = self.densenet(x)
        x = torch.sigmoid(x)
        return x


class GradCAM:
    """Grad-CAM implementation for visualization"""

    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self._register_hooks()

    def _register_hooks(self):
        """Register forward and backward hooks for gradient capture"""
        def forward_hook(module, input, output):
            self.activations = output.detach()

        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0].detach()

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_backward_hook(backward_hook)

    def generate(self, input_tensor, target_class):
        """Generate Grad-CAM heatmap for a specific class"""
        self.model.zero_grad()
        output = self.model(input_tensor)

        # Backward pass for the target class
        output[0, target_class].backward(retain_graph=True)

        # Generate heatmap
        pooled_gradients = torch.mean(self.gradients, dim=[0, 2, 3])
        activations = self.activations.squeeze(0)

        for i in range(pooled_gradients.shape[0]):
            activations[i, :, :] *= pooled_gradients[i]

        heatmap = torch.mean(activations, dim=0).cpu().numpy()
        heatmap = np.maximum(heatmap, 0)
        heatmap /= np.max(heatmap) if np.max(heatmap) != 0 else 1
        return heatmap


def load_model(model_path, device):
    """Load the trained model from disk"""
    try:
        model = DenseNet121MultiLabel(num_labels=14, dropout_rate=0.2)
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.to(device)
        model.eval()
        logger.info(f"Model loaded successfully from {model_path}")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise


def preprocess_image(image_bytes):
    """Preprocess image for model input"""
    try:
        # Open image from bytes
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        # Transform: Resize to 224x224 and convert to tensor
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])

        input_tensor = transform(image).unsqueeze(0)
        return input_tensor, image
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise


def predict_diseases(model, input_tensor, device, threshold=0.5):
    """Run inference and return predictions with probabilities"""
    try:
        input_tensor = input_tensor.to(device)

        with torch.no_grad():
            output = model(input_tensor)
            probs = output[0].cpu().numpy()

        # Create predictions dictionary with all classes above threshold
        predictions = {}
        for idx, prob in enumerate(probs):
            if prob >= threshold:
                predictions[CLASS_NAMES[idx]] = float(prob)

        # If no predictions above threshold, return top prediction
        if not predictions:
            top_idx = np.argmax(probs)
            predictions[CLASS_NAMES[top_idx]] = float(probs[top_idx])

        logger.info(f"Predictions: {predictions}")
        return predictions, probs
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise


def apply_heatmap(heatmap, image):
    """Apply heatmap overlay on the original image"""
    # Resize heatmap to match image size
    heatmap_resized = cv2.resize(heatmap, (image.size[0], image.size[1]))

    # Invert heatmap
    heatmap_resized = 1.0 - heatmap_resized
    heatmap_uint8 = np.uint8(255 * heatmap_resized)

    # Apply colormap (JET)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)

    # Convert PIL image to numpy array
    image_np = np.array(image.convert("RGB"))

    # Blend images
    superimposed = cv2.addWeighted(image_np, 0.6, heatmap_color, 0.4, 0)

    return superimposed


def generate_gradcam_visualizations(model, input_tensor, original_image, predictions, device):
    """Generate Grad-CAM visualizations for predicted classes"""
    try:
        input_tensor = input_tensor.to(device)
        input_tensor.requires_grad = True

        # Get the target layer for Grad-CAM
        target_layer = model.densenet.features[-1]
        cam = GradCAM(model, target_layer)

        gradcam_images = {}

        # Generate Grad-CAM for each predicted disease
        for disease_name in predictions.keys():
            class_idx = CLASS_NAMES.index(disease_name)

            # Generate heatmap
            heatmap = cam.generate(input_tensor, class_idx)

            # Apply heatmap to original image
            result_image = apply_heatmap(heatmap, original_image)

            # Convert to base64
            result_pil = Image.fromarray(cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB))
            buffered = io.BytesIO()
            result_pil.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()

            gradcam_images[disease_name] = img_str
            logger.info(f"Generated Grad-CAM for {disease_name}")

        return gradcam_images
    except Exception as e:
        logger.error(f"Error generating Grad-CAM: {str(e)}")
        raise


def image_to_base64(image):
    """Convert PIL Image to base64 string"""
    buffered = io.BytesIO()
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()
