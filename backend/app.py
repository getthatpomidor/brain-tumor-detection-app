from fastapi import FastAPI,UploadFile,File
from model import predict
from preprocess import preprocess_img,preprocess_dicom
import numpy as np

app=FastAPI()

class_names = ['glioma', 'meningioma', 'no_tumor', 'pituitary']

@app.get("/")
def home():
    return {"status":"API running"}

@app.post("/predict")
async def predict_tumor(file: UploadFile=File(...)):
    file_bytes=await file.read()

    if file.filename.endswith(".dcm"):
        image = preprocess_dicom(file_bytes)
    else:
        image = preprocess_img(file_bytes)

    preds=predict(image)[0]
    predicted_class=class_names[np.argmax(preds)]
    confidence=float(np.max(preds))

    return {
        "class": predicted_class,
        "confidence": confidence,
        "probabilities": preds.tolist()
    }
