import streamlit as st
import tensorflow as tf
import numpy as np

# Tensorflow Model Prediction
def model_prediction(test_img):
    cnn = tf.keras.models.load_model(
        r"C:\Users\sebaey\Downloads\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)\trained_model.h5",
        compile=False
    )
    image = tf.keras.preprocessing.image.load_img(test_img, target_size=(128, 128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr])  # Convert single image to a batch
    prediction = cnn.predict(input_arr)
    result_index = np.argmax(prediction)
    return result_index

# Disease Information Dictionary
disease_info = {
    "Apple___Apple_scab": {
        "title": "Apple scab",
        "desc": "Dark olive-brown lesions on leaves and fruit; leaves may curl and drop.",
        "advice": [
            "Remove and destroy fallen leaves and infected fruit.",
            "Prune to improve airflow; avoid overhead watering.",
            "Use fungicide sprays in spring (follow local recommendations)."
        ]
    },
    "Apple___Black_rot": {
        "title": "Apple black rot",
        "desc": "Brown/black circular lesions on fruit and leaves; fruit may rot and mummify.",
        "advice": [
            "Prune out and destroy cankers and infected branches.",
            "Remove mummified fruit from tree and ground.",
            "Apply appropriate fungicide during susceptible periods."
        ]
    },
    "Apple___Cedar_apple_rust": {
        "title": "Cedar apple rust",
        "desc": "Orange spots on leaves; gelatinous orange spore horns on nearby junipers.",
        "advice": [
            "Remove nearby junipers or avoid planting them near apple trees.",
            "Prune infected leaves/branches and apply fungicide if severe.",
            "Plant resistant cultivars where possible."
        ]
    },
    "Apple___healthy": {
        "title": "Healthy (Apple)",
        "desc": "No visible disease symptoms detected.",
        "advice": [
            "Continue good cultural practices: regular watering, balanced fertilization.",
            "Monitor regularly for early signs of disease or pests."
        ]
    },
    "Blueberry___healthy": {
        "title": "Healthy (Blueberry)",
        "desc": "No disease detected.",
        "advice": [
            "Maintain soil pH and adequate mulch; inspect regularly.",
            "Keep good airflow between plants; water at soil level."
        ]
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "title": "Powdery mildew (Cherry)",
        "desc": "White powdery growth on leaves/fruit; leaves may curl or distort.",
        "advice": [
            "Improve air circulation and avoid overhead watering.",
            "Remove heavily infected shoots; apply fungicide if needed."
        ]
    },
    "Cherry_(including_sour)___healthy": {
        "title": "Healthy (Cherry)",
        "desc": "No visible disease symptoms detected.",
        "advice": [
            "Monitor for pests and fungal signs; prune to increase airflow."
        ]
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "title": "Cercospora / gray leaf spot (Corn)",
        "desc": "Small rectangular tan/gray lesions between veins; can coalesce.",
        "advice": [
            "Rotate crops and use resistant hybrids where available.",
            "Remove corn debris and use fungicide in severe outbreaks."
        ]
    },
    "Corn_(maize)___Common_rust_": {
        "title": "Common rust (Corn)",
        "desc": "Reddish-brown pustules on both leaf surfaces.",
        "advice": [
            "Plant resistant varieties, if possible.",
            "Ensure good crop vigor; fungicide if rust is severe."
        ]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "title": "Northern corn leaf blight",
        "desc": "Long, cigar-shaped gray-green lesions that expand rapidly.",
        "advice": [
            "Plant resistant hybrids and rotate crops.",
            "Apply fungicides under high disease pressure and manage residue."
        ]
    },
    "Corn_(maize)___healthy": {
        "title": "Healthy (Corn)",
        "desc": "No disease symptoms detected.",
        "advice": [
            "Maintain crop rotation and monitor fields regularly."
        ]
    },
    "Grape___Black_rot": {
        "title": "Black rot (Grape)",
        "desc": "Dark round lesions on leaves and fruit; shriveled black fruit.",
        "advice": [
            "Remove infected berries and prune out canes.",
            "Apply protective fungicides in wet seasons; remove mummified fruit."
        ]
    },
    "Grape___Esca_(Black_Measles)": {
        "title": "Esca / Black measles (Grape)",
        "desc": "Leaf discoloration, black dead patches on fruit and wood decay.",
        "advice": [
            "Prune out and burn heavily infected wood; avoid trunk wounds.",
            "Maintain vine vigor; consult local extension for trunk disease control."
        ]
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "title": "Leaf blight / Isariopsis (Grape)",
        "desc": "Small spots that can merge to cause large dead areas on leaves.",
        "advice": [
            "Remove infected leaves and improve canopy airflow.",
            "Use fungicide sprays if disease pressure is high."
        ]
    },
    "Grape___healthy": {
        "title": "Healthy (Grape)",
        "desc": "No disease detected.",
        "advice": [
            "Practice canopy management and timely fungicide program if needed."
        ]
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "title": "Huanglongbing (Citrus greening)",
        "desc": "Yellowing of leaves, lopsided fruit, severe yield loss; caused by bacteria spread by psyllids.",
        "advice": [
            "Remove infected trees where regulations call for it to prevent spread.",
            "Control psyllid vectors with insecticide and use certified disease-free stock.",
            "Consult local authorities — HLB is often regulated."
        ]
    },
    "Peach___Bacterial_spot": {
        "title": "Bacterial spot (Peach)",
        "desc": "Small dark spots on leaves and fruit; fruit may crack or scar.",
        "advice": [
            "Use copper sprays and practice good sanitation.",
            "Avoid overhead irrigation; choose resistant varieties when available."
        ]
    },
    "Peach___healthy": {
        "title": "Healthy (Peach)",
        "desc": "No disease detected.",
        "advice": [
            "Monitor and maintain good orchard hygiene and watering practices."
        ]
    },
    "Pepper,_bell___Bacterial_spot": {
        "title": "Bacterial spot (Pepper)",
        "desc": "Small water-soaked spots that become dark and scabby.",
        "advice": [
            "Use certified clean seed/seedlings and copper sprays when allowed.",
            "Avoid working in wet fields; remove infected plants."
        ]
    },
    "Pepper,_bell___healthy": {
        "title": "Healthy (Pepper)",
        "desc": "No disease detected.",
        "advice": [
            "Keep good sanitation and monitor for pests and foliar diseases."
        ]
    },
    "Potato___Early_blight": {
        "title": "Early blight (Potato)",
        "desc": "Concentric rings on leaves (target-like) and tuber lesions.",
        "advice": [
            "Use resistant varieties, rotate crops, and apply fungicides preventatively.",
            "Remove infected foliage and avoid overhead irrigation."
        ]
    },
    "Potato___Late_blight": {
        "title": "Late blight (Potato)",
        "desc": "Water-soaked lesions that quickly turn brown/black; can destroy crops rapidly.",
        "advice": [
            "Use certified seed, remove infected plants immediately, and apply fungicides.",
            "Report severe outbreaks to local extension services."
        ]
    },
    "Potato___healthy": {
        "title": "Healthy (Potato)",
        "desc": "No disease detected.",
        "advice": [
            "Practice crop rotation and inspect tubers before storage."
        ]
    },
    "Raspberry___healthy": {
        "title": "Healthy (Raspberry)",
        "desc": "No disease detected.",
        "advice": [
            "Maintain good airflow and prune to prevent fungal buildup."
        ]
    },
    "Soybean___healthy": {
        "title": "Healthy (Soybean)",
        "desc": "No disease detected.",
        "advice": [
            "Rotate crops, and scout frequently for early signs of disease."
        ]
    },
    "Squash___Powdery_mildew": {
        "title": "Powdery mildew (Squash)",
        "desc": "White powdery patches on leaves and stems, reducing vigor.",
        "advice": [
            "Remove heavily infected leaves; ensure good airflow and sun exposure.",
            "Apply sulfur or other approved fungicides if needed."
        ]
    },
    "Strawberry___Leaf_scorch": {
        "title": "Leaf scorch (Strawberry)",
        "desc": "Leaf edges brown or scorched; often bacterial or fungal in origin.",
        "advice": [
            "Remove infected leaves and improve irrigation methods.",
            "Apply recommended fungicide/bactericide if diagnosis confirms pathogen."
        ]
    },
    "Strawberry___healthy": {
        "title": "Healthy (Strawberry)",
        "desc": "No disease detected.",
        "advice": [
            "Ensure good drainage, avoid high humidity, and monitor for pests."
        ]
    },
    "Tomato___Bacterial_spot": {
        "title": "Bacterial spot (Tomato)",
        "desc": "Small dark lesions on leaves and fruit; may cause defoliation.",
        "advice": [
            "Use disease-free seed, copper sprays as recommended, and remove infected plants.",
            "Avoid overhead irrigation and sanitize tools."
        ]
    },
    "Tomato___Early_blight": {
        "title": "Early blight (Tomato)",
        "desc": "Concentric ring lesions on leaves and fruit; reduces yield.",
        "advice": [
            "Use proper rotation and fungicides; remove infected debris.",
            "Keep foliage dry and avoid dense planting."
        ]
    },
    "Tomato___Late_blight": {
        "title": "Late blight (Tomato)",
        "desc": "Large, dark, water-soaked lesions; can destroy plants quickly.",
        "advice": [
            "Remove infected plants immediately and apply recommended fungicides.",
            "Use certified seed and report severe outbreaks."
        ]
    },
    "Tomato___Leaf_Mold": {
        "title": "Leaf mold (Tomato)",
        "desc": "Yellow spots that turn olive-green/brown on lower leaf surfaces in humid conditions.",
        "advice": [
            "Improve ventilation (greenhouse) and reduce humidity.",
            "Remove affected leaves and use fungicides if needed."
        ]
    },
    "Tomato___Septoria_leaf_spot": {
        "title": "Septoria leaf spot (Tomato)",
        "desc": "Small circular spots with dark borders on lower leaves; defoliation may follow.",
        "advice": [
            "Remove lower infected leaves, apply fungicide, and rotate crops.",
            "Avoid splashing water from soil onto leaves."
        ]
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "title": "Two-spotted spider mite",
        "desc": "Fine webbing and tiny speckled/silvering damage on leaves; causes leaf drop.",
        "advice": [
            "Spray with water to dislodge mites or use miticides/biological controls.",
            "Maintain plant vigor; control dust and heat stress."
        ]
    },
    "Tomato___Target_Spot": {
        "title": "Target spot (Tomato)",
        "desc": "Dark circular lesions with lighter centers; often on foliage and fruit.",
        "advice": [
            "Remove infected debris, improve airflow, and apply fungicides when necessary."
        ]
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "title": "Tomato yellow leaf curl virus (TYLCV)",
        "desc": "Severely curled/yellow leaves, stunted growth; vector: whiteflies.",
        "advice": [
            "Control whiteflies (insecticides/biological control) and remove infected plants.",
            "Use resistant varieties and reflective mulches to reduce vector attraction."
        ]
    },
    "Tomato___Tomato_mosaic_virus": {
        "title": "Tomato mosaic virus (ToMV)",
        "desc": "Mottled light/dark patches on leaves and stunted growth; highly contagious via tools.",
        "advice": [
            "Use virus-free seed and sanitize tools; remove infected plants.",
            "Practice strict hygiene and crop rotation."
        ]
    },
    "Tomato___healthy": {
        "title": "Healthy (Tomato)",
        "desc": "No disease symptoms detected.",
        "advice": [
            "Keep consistent watering and monitor pests/diseases regularly."
        ]
    }
}

# Sidebar
st.sidebar.title("Dashboard")
app_mode = st.sidebar.selectbox("Select Page", ["Home", "About", "Disease Recognition"])

# Main Page
if app_mode == "Home":
    st.header("PLANT DISEASE RECOGNITION SYSTEM")
    image_path = r"C:\Users\sebaey\Downloads\New Plant Diseases Dataset(Augmented)\download.jpeg"
    st.image(image_path,  use_container_width=True)
    st.markdown("""
    Welcome to the Plant Disease Recognition System! 🌿🔍
    ...
    """)

elif app_mode == "About":
    st.header("About")
    st.markdown("""
    #### About Dataset
    This dataset is recreated using offline augmentation...
    """)

elif app_mode == "Disease Recognition":
    st.header("Disease Recognition")
    test_image = st.file_uploader("Choose an Image:")
    if st.button("Show Image") and test_image:
        st.image(test_image, use_column_width=True)

    if st.button("Predict") and test_image:
        with st.spinner("Please wait..."):
            st.write("Our Prediction")
            result_index = model_prediction(test_image)
            class_name = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
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
                'Tomato___healthy']

            predicted_label = class_name[result_index]
            st.success(f"Model Prediction: **{predicted_label}**")

            info = disease_info.get(predicted_label)
            if info:
                st.markdown(f"### {info['title']}")
                st.write(info["desc"])
                with st.expander("Recommendations & Advice"):
                    for i, rec in enumerate(info["advice"], 1):
                        st.markdown(f"{i}. {rec}")
            else:
                st.info("No additional information available for this class.")
