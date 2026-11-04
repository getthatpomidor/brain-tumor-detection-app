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

## Running the application

To run OncoVision locally, you need to start the backend, frontend and desktop app separately (preferably in this exact order).

### Prerequisites
Make sure the following tools are installed:
- Python 3.x
- Node.js and npm

### Starting the backend
Open a terminal in the project's root directory and navigate to the backend folder:

```
cd backend
```

Start the backend server using Uvicorn:

```
uvicorn app:app --reload
```

The backend will be available at:

```
http://localhost:8000
```

You can access the FastAPI Swagger UI at:
```
http://localhost:8000/docs
```

### Starting the frontend
Open a new terminal in the project's root directory and navigate to the desktop app folder:

```
cd electron-app
```
Run:
```
npm install
npm run dev
```
The frontend will start in development mode.

### Starting the Desktop App
Open another terminal in the project's root directory and navigate to the desktop app folder:
```
cd electron-app
```
Run:
```
npm install
npm start
```

The OncoVision desktop application will start locally.

