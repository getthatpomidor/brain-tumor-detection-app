import tensorflow as tf

CLASS_MRI_MODEL_PATH = "models/brain_tumor_model.keras"

class_mri_model=tf.keras.models.load_model(CLASS_MRI_MODEL_PATH)

def predict(img):
    return class_mri_model.predict(img)
    