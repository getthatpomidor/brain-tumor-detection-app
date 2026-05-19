from PIL import Image
import numpy as np
import io
from tensorflow.keras.applications.efficientnet import preprocess_input


def preprocess_img(file):
    img=Image.open(io.BytesIO(file))
    img=img.convert("RGB")
    img=img.resize((224,224))

    img_array=np.array(img)
    img_array=np.expand_dims(img_array,axis=0)

    img_array=preprocess_input(img_array)
    return img_array