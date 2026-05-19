from fastapi import FastAPI, UploadFile, File, HTTPException
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from quiz_generator import generate_quiz
from youtube_utils import get_transcript
from disease_info import disease_info
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Plant Disease Recognition API + Quiz System")

# ===============================
# CORS
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# LOAD MODEL (ONCE)
# ===============================
MODEL_PATH = "trained_model.h5"

try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# ===============================
# CLASS NAMES
# ===============================
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust',
    'Apple___healthy', 'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
    'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# ===============================
# VIDEO MAP (IMPORTANT FOR FRONTEND)
# ===============================
VIDEO_MAP = {
    "video1": "FpOWG4GDvx4",
    "video2": "V_1vpEEnXW0",
    "video3": "aLY46g18hWk",
    "video4": "tNbTppAbEVc",
    "video5": "AltruHFIBAQ"
}

# ===============================
# CACHE (SPEED BOOST)
# ===============================
quiz_cache = {}

# ===============================
# IMAGE PREPROCESSING
# ===============================
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((128, 128))
    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# ===============================
# PREDICT ENDPOINT (UNCHANGED)
# ===============================
@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    try:
        image_bytes = await image.read()
        input_tensor = preprocess_image(image_bytes)
        predictions = model.predict(input_tensor)
        index = int(np.argmax(predictions))
        label = class_names[index]

        info = disease_info.get(label, {})

        return {
            "predicted_label": label,
            "title": info.get("title", ""),
            "description": info.get("desc", ""),
            "advice": info.get("advice", [])
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===============================
# QUIZ ENDPOINT (NEW - MAIN)
# ===============================
@app.get("/quiz/{video_key}")
def get_quiz(video_key: str):
    try:
        # check cache first
        if video_key in quiz_cache:
            return quiz_cache[video_key]

        if video_key not in VIDEO_MAP:
            raise HTTPException(status_code=404, detail="Video not found")

        video_id = VIDEO_MAP[video_key]

        transcript = get_transcript(video_id)
        transcript = transcript[:2000]  # limit size for speed

        quiz = generate_quiz(transcript)

        result = {
            "video_key": video_key,
            "quiz": quiz
        }

        # save in cache
        quiz_cache[video_key] = result

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))