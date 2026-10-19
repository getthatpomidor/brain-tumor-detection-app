# OncoVision

Currently predicts tumor class from MRI and CT images.

TBA: MRI tumor segmentation.

## Tech stack

### Frontend (Desktop Application)

- Electron.js
- HTML, CSS, JavaScript
- Tailwind CSS (UI styling) **(TBA)**

### Backend (AI Inference API)

- FastAPI (Python)
- Uvicorn server
- Pillow (image processing)

### Machine Learning

- TensorFlow / Keras
- Models format: `.keras`

### Architecture

- Electron frontend communicates with FastAPI backend via REST API
- Image files are sent as multipart/form-data
- Backend returns JSON predictions (class + confidence)
