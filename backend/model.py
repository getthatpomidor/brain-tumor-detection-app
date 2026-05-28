import tensorflow as tf

CLASS_MRI_MODEL_PATH = "models/brain_tumor_model.keras"

CLASS_CT_MODEL_PATH = "models/brain_tumor_ct_model.keras"

class_mri_model=tf.keras.models.load_model(CLASS_MRI_MODEL_PATH)

class_ct_model=tf.keras.models.load_model(CLASS_CT_MODEL_PATH)

def predict_mri(img):
    return class_mri_model.predict(img)

def predict_ct(img):
    return class_ct_model.predict(img)
    