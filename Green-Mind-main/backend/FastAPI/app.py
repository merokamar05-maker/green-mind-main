import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Green Mind AI API")

# ✅ CORS - السماح لكل المصادر
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI Scan Logic ---
def get_mock_prediction(filename: str):
    plants = [
        {"title": "Tomato Leaf", "desc": "Healthy tomato leaf with good chlorophyll.", "advice": ["Water regularly", "Check for pests"]},
        {"title": "Rose Flower", "desc": "A beautiful red rose in early bloom.", "advice": ["Needs direct sunlight", "Prune dead leaves"]},
        {"title": "Aloe Vera", "desc": "Succulent plant known for healing properties.", "advice": ["Don't overwater", "Keep in indirect sun"]}
    ]
    return random.choice(plants)

# --- AI Quiz Logic ---
def get_mock_quiz(video_id: str):
    quizzes = {
        "recycling": [
            {"question": "What can be recycled?", "options": ["Plastic Bottles", "Food Scraps", "Dirty Diapers", "Rocks"], "answer": "Plastic Bottles"},
            {"question": "What color is the recycling bin usually?", "options": ["Red", "Blue", "Black", "Pink"], "answer": "Blue"},
            {"question": "Why is recycling important?", "options": ["Save Energy", "Make more trash", "Waste water", "Kill trees"], "answer": "Save Energy"}
        ],
        "plants": [
            {"question": "What do plants need to grow?", "options": ["Sun & Water", "Pizza & Soda", "TV & Games", "Rocks & Sand"], "answer": "Sun & Water"},
            {"question": "Which part of the plant is underground?", "options": ["Leaves", "Stem", "Roots", "Flowers"], "answer": "Roots"},
            {"question": "What gas do plants release for us to breathe?", "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Smoke"], "answer": "Oxygen"}
        ]
    }
    # Return specific quiz if found, else return plants quiz as default
    return quizzes.get(video_id.lower(), quizzes["plants"])

@app.get("/")
def health_check():
    return {"status": "online", "message": "AI Server is ready!"}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
        result = get_mock_prediction(image.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/quiz/{video_id}")
async def get_quiz(video_id: str):
    try:
        quiz_data = get_mock_quiz(video_id)
        return {"quiz": quiz_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)