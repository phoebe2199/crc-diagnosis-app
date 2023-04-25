import tensorflow as tf
from tensorflow import keras
from keras import backend as K
import numpy as np
from PIL import Image
from io import BytesIO

def recall_(y_true, y_pred): # sensitivity: out of all actual positives, how many did we predict as positive
    y_true = K.ones_like(y_true)
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    all_positives = K.sum(K.round(K.clip(y_true, 0, 1)))

    recall = true_positives / (all_positives + K.epsilon())
    return recall

def precision_(y_true, y_pred): # positive predictive value (PPV), out of all predicted positive cases, how many were correct
    y_true = K.ones_like(y_true)
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))

    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    return precision

def specificity_(y_true, y_pred):
    y_true = K.ones_like(y_true)
    true_negatives = K.sum(K.round(K.clip((1 - y_true) * (1 - y_pred), 0, 1)))
    all_negatives = K.sum(K.round(K.clip(1 - y_true, 0, 1)))

    specificity = true_negatives / (all_negatives + K.epsilon())
    return specificity

def f1_score(y_true, y_pred): # weighted average of PPV and sensitivity
    precision = precision_(y_true, y_pred)
    recall = recall_(y_true, y_pred)
    return 2*((precision*recall)/(precision+recall+K.epsilon()))

# key: [model_name, file_location, custom_objects]
address_lookup = {
    'VGG16 From Scratch': [
        '/Users/phoebealderman/Documents/Fourth Year/ECM3401 Dissertation/final_models/VGG16_1.h5',
        {"f1_score": f1_score, "precision_":precision_, "recall_":recall_, "specificity_":specificity_}
    ],
    'VGG16 Transfer Learning': [
        '/Users/phoebealderman/Documents/Fourth Year/ECM3401 Dissertation/final_models/VGG16_tl_1.h5',
        {"f1_score": f1_score, "precision_":precision_, "recall_":recall_}
    ],
    'ResNet50 From Scratch': [
        '/Users/phoebealderman/Documents/Fourth Year/ECM3401 Dissertation/final_models/RN50_8.h5',
        {"f1_score": f1_score, "precision_":precision_, "recall_":recall_}
    ],
    'ResNet50 Transfer Learning': [
        '/Users/phoebealderman/Documents/Fourth Year/ECM3401 Dissertation/final_models/RN50_tl_4.h5',
        {"f1_score": f1_score, "precision_":precision_, "recall_":recall_}
    ],
    'InceptionV3 From Scratch': [
        '/Users/phoebealderman/Documents/Fourth Year/ECM3401 Dissertation/final_models/IV3_2.h5',
        {"f1_score": f1_score, "precision_":precision_, "recall_":recall_,}
    ],
    'InceptionV3 Transfer Learning': [
        '/Users/phoebealderman/Documents/Fourth Year/ECM3401 Dissertation/final_models/IV3_tl_4.h5',
        {"f1_score": f1_score, "precision_":precision_, "recall_":recall_,}
    ]
}

# key: [class_index, tissue_class, class_description, is_cancerous]
class_lookup = {
    '0' : [
        'ADI', 'adipose', False],
    '1' : [
        'BACK', 'background', False],
    '2' : [
        'DEB', 'debris', False],
    '3' : [
        'LYM', 'lymphocytes', False],
    '4' : [
        'MUC', 'mucus', False],
    '5' : [
        'MUS', 'smooth muscle', False],
    '6' : [
        'NORM', 'normal colon mucosa', False],
    '7' : [
        'STR', 'cancer-associated stroma', True],
    '8' : [
        'TUM', 'adicolorectal adenocarcinoma epitheliumpose', True]
}

def prepare_predict(img, model_selection):
    try: 
        # FileStorage object to PIL image
        pil_img = Image.open(BytesIO(img.read()))    
        # make to array
        img_array = keras.preprocessing.image.img_to_array(pil_img)
        img_array = img_array / 255
        # adjust size based on model
        img_size = (299, 299) if model_selection == "InceptionV3 Transfer Learning" or model_selection == "InceptionV3 From Scratch" else (224, 224)
        img_array = tf.image.resize(img_array, img_size)
        img_array = np.expand_dims(img_array, axis=0)

        if model_selection in address_lookup:
            model_info = address_lookup[model_selection]
            file_loc = model_info[0]
            custom_objects = model_info[1]
            # load model
            model = keras.models.load_model(file_loc, custom_objects=custom_objects)
            # get prediction
            pred_array = model.predict(img_array)
            # get the class with the highest probability
            class_index = np.argmax(pred_array, axis=-1)
            pred_info = class_lookup[str(class_index[0])]
            tissue_class = pred_info[0]
            tissue_description = pred_info[1]
            is_cancerous = "cancerous" if pred_info[2] else "non-cancerous"
            return f"Diagnosis is {is_cancerous}: {tissue_class} - {tissue_description} with {'{0:.2%}'.format(pred_array[0][class_index][0])} confidence"
        else:
            return "Error: Could not find selected model"
        
    except Exception as e:
        return f"Error: {e}"