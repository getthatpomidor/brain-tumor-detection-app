from PIL import Image
import numpy as np
import io
from tensorflow.keras.applications.efficientnet import preprocess_input
import pydicom


def preprocess_img(file):
    img=Image.open(io.BytesIO(file))
    img=img.convert("RGB")
    img=img.resize((224,224))

    img_array=np.array(img)
    img_array=np.expand_dims(img_array,axis=0)

    img_array=preprocess_input(img_array)
    return img_array


def preprocess_dicom(file):
    dicom = pydicom.dcmread(io.BytesIO(file_bytes))
    img = dicom.pixel_array

    # normalize image
    img = img - np.min(img)
    img = img / np.max(img) * 255.0
    img = img.astype(np.uint8)

    img = Image.fromarray(img).convert("RGB")
    img = img.resize((224, 224))

    img = np.array(img)
    img = np.expand_dims(img, axis=0)

    return preprocess_input(img)