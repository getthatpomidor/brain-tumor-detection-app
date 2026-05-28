from fastapi import FastAPI,UploadFile,File
from model import predict_mri,predict_ct
from preprocess import preprocess_img,preprocess_dicom
import numpy as np

app=FastAPI()

class_names_mri = ['glioma', 'meningioma', 'no_tumor', 'pituitary']
class_names_ct=['tumor','healthy']

@app.get("/")
def home():
    return {"status":"API running"}

@app.post("/predict/mri")
async def predict_tumor(file: UploadFile=File(...)):
    file_bytes=await file.read()

    if file.filename.endswith(".dcm"):
        image = preprocess_dicom(file_bytes)
    else:
        image = preprocess_img(file_bytes)

    preds=predict_mri(image)[0]
    predicted_class=class_names_mri[np.argmax(preds)]
    confidence=float(np.max(preds))

    return {
        "class": predicted_class,
        "confidence": confidence,
        "probabilities": preds.tolist()
    }

@app.post("/predict/ct")
async def predict_tumor(file: UploadFile=File(...)):
    file_bytes=await file.read()

    if file.filename.endswith(".dcm"):
        image = preprocess_dicom(file_bytes)
    else:
        image = preprocess_img(file_bytes)

    prob=predict_ct(image)[0][0].tolist()
    predicted_class=class_names_ct[int(prob >= 0.5)]
    confidence = prob if prob >= 0.5 else 1 - prob

    return {
        "class": predicted_class,
        "confidence": confidence,
    }