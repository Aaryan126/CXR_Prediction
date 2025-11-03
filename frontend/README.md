# Chest X-Ray Disease Prediction - Frontend

React-based web interface for chest X-ray disease prediction with Grad-CAM visualization.

## Features

- Clean, minimal white design
- Drag-and-drop image upload
- Real-time disease prediction display
- Interactive Grad-CAM visualizations
- Responsive layout for all devices
- Loading states and error handling
- Multi-disease prediction support

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **CSS3** - Custom styling (no external CSS frameworks needed)

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ImageUpload.jsx       # Image upload with drag-and-drop
│   │   ├── ResultsDisplay.jsx    # Display predictions and Grad-CAM
│   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   └── ErrorMessage.jsx      # Error display component
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Application styles
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Usage

1. **Upload Image**: Click or drag-and-drop a chest X-ray image (JPG/PNG)
2. **Wait for Analysis**: The app will send the image to the backend API
3. **View Results**: See predicted diseases with confidence scores
4. **Explore Visualizations**: Click on different disease predictions to view their Grad-CAM heatmaps
5. **Start New Analysis**: Click "New Analysis" to upload another image

## Features Breakdown

### Image Upload Component
- Drag-and-drop support
- Click to browse
- Image preview before upload
- File type validation

### Results Display
- Disease predictions with confidence scores
- Visual confidence bars
- Interactive disease selector
- Side-by-side image comparison (original vs Grad-CAM)
- Color-coded heatmap legend
- Medical disclaimer

### User Experience
- Smooth animations and transitions
- Loading indicators during API calls
- Clear error messages with retry option
- Responsive design for mobile and desktop
- Accessible color contrast

## API Integration

The frontend communicates with the FastAPI backend via REST API:

**Endpoint**: `POST /predict`

**Request**: FormData with image file

**Response**:
```json
{
  "success": true,
  "predictions": {
    "Pneumonia": 0.87,
    "Cardiomegaly": 0.62
  },
  "gradcam_images": {
    "Pneumonia": "base64_string",
    "Cardiomegaly": "base64_string"
  },
  "original_image": "base64_string",
  "num_predictions": 2
}
```

## Customization

### Change Theme Colors

Edit `src/App.css` and modify the gradient colors:

```css
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Confidence Threshold

The threshold is currently set to 0.5 in the backend. To use a custom threshold, modify the API call in `App.jsx`:

```javascript
const response = await fetch(`${API_BASE_URL}/predict-with-threshold?threshold=0.6`, {
  method: 'POST',
  body: formData,
});
```

## Troubleshooting

### CORS Errors
Ensure the backend has CORS enabled and the API URL is correctly configured in `.env`

### API Connection Failed
- Check that the backend is running on the specified port
- Verify the `VITE_API_URL` in `.env` is correct
- Check browser console for detailed error messages

### Images Not Displaying
- Ensure the backend is returning base64-encoded images
- Check browser console for any image loading errors
- Verify the image format is supported (PNG/JPG)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

- Images are displayed as base64 strings - for large images, consider using blob URLs
- Grad-CAM generation happens on the backend, so frontend performance is not affected
- React components are optimized to prevent unnecessary re-renders

## License

This project is part of a Final Year Project for educational purposes.
