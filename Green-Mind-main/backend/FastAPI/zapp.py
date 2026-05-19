import os
import threading
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# 🚀 تسريع التشغيل وإصلاح مشكلة التعليق
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # إجبار استخدام المعالج فقط (CPU)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'   # تقليل الرسائل المزعجة
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # تجنب العمليات المعقدة لـ TensorFlow

import tensorflow as tf
import numpy as np
from PIL import Image
import io
import random

# محاولة استيراد معلومات الأمراض
try:
    from disease_info import disease_info
except ImportError:
    disease_info = {}

app = FastAPI(title="Green Mind AI API")

# ✅ حل مشكلة الـ CORS بشكل كامل
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- تحميل الموديل في الخلفية ---
MODEL_PATH = "trained_model.h5"
model = None
is_loading = True

def load_model_in_background():
    global model, is_loading
    try:
        if os.path.exists(MODEL_PATH):
            print(f"⏳ Loading Real Model in background... please wait.")
            # استخدام مكتبة keras مباشرة قد يكون أسرع أحياناً
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("✅ Real Model Loaded Successfully! Everything is ready.")
        else:
            print(f"❌ Error: {MODEL_PATH} not found!")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
    finally:
        is_loading = False

# تشغيل عملية التحميل بمجرد تشغيل الكود دون تعطيل السيرفر
threading.Thread(target=load_model_in_background, daemon=True).start()

# --- قائمة الأمراض ---
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 
    'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
    'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
    'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
    'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 
    'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((128, 128))
    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalization قد يحسن النتائج
    return img_array

@app.get("/")
def health_check():
    return {
        "status": "online", 
        "model_loaded": model is not None,
        "message": "AI Server is running!" if model else "Server is starting, loading model..."
    }

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="الموديل لا يزال قيد التحميل في الخلفية، يرجى الانتظار دقيقة واحدة والمحاولة مرة أخرى.")
    
    try:
        image_bytes = await image.read()
        input_tensor = preprocess_image(image_bytes)
        
        predictions = model.predict(input_tensor)
        index = int(np.argmax(predictions))
        label = class_names[index]
        
        info = disease_info.get(label, {
            "title": label.replace("___", " ").replace("_", " "),
            "desc": "لا توجد معلومات إضافية متوفرة.",
            "advice": ["استمر في العناية المعتادة بنباتك."]
        })
        
        return {
            "title": info.get("title", label),
            "description": info.get("desc", ""),
            "advice": info.get("advice", []),
            "predicted_label": label
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/quiz/{video_id}")
async def get_quiz(video_id: str):
    quizzes = {
        "recycling": [
            {"question": "What can be recycled?", "options": ["Plastic Bottles", "Food Scraps", "Dirty Diapers", "Rocks"], "answer": "Plastic Bottles"},
            {"question": "What color is the recycling bin usually?", "options": ["Red", "Blue", "Black", "Pink"], "answer": "Blue"},
            {"question": "Why is recycling important?", "options": ["Save Energy", "Make more trash", "Waste water", "Kill trees"], "answer": "Save Energy"},
            {"question": "Which of these is NOT recyclable?", "options": ["Glass", "Aluminum", "Old Pizza Boxes", "Paper"], "answer": "Old Pizza Boxes"},
            {"question": "What is the first 'R' in the three R's?", "options": ["Reuse", "Reduce", "Recycle", "Regrow"], "answer": "Reduce"}
        ],
        "plants": [
            {"question": "What do plants need to grow?", "options": ["Sun & Water", "Pizza & Soda", "TV & Games", "Rocks & Sand"], "answer": "Sun & Water"},
            {"question": "Which part of the plant is underground?", "options": ["Leaves", "Stem", "Roots", "Flowers"], "answer": "Roots"},
            {"question": "What gas do plants release for us to breathe?", "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Smoke"], "answer": "Oxygen"},
            {"question": "What part of the plant makes seeds?", "options": ["Leaves", "Flowers", "Roots", "Stem"], "answer": "Flowers"},
            {"question": "Which part of the plant makes food using sunlight?", "options": ["Roots", "Leaves", "Seeds", "Stem"], "answer": "Leaves"}
        ]
    }
    quiz_data = quizzes.get(video_id.lower(), quizzes["plants"])
    return {"quiz": quiz_data}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
