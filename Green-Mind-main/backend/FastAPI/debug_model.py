import os
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
import time

MODEL_PATH = "trained_model.h5"
print(f"Starting to load model from {MODEL_PATH}...")
start_time = time.time()
try:
    if os.path.exists(MODEL_PATH):
        # Using a simpler way to load if possible
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        end_time = time.time()
        print(f"Model loaded successfully in {end_time - start_time:.2f} seconds")
    else:
        print("Model file not found")
except Exception as e:
    print(f"Error: {e}")
