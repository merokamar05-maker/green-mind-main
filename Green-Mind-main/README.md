# 🌿 Green Mind

**Green Mind** is an interactive educational platform designed to inspire children to love nature and learn about the environment in a fun, playful, and meaningful way.
The website combines games, rewards, environmental lessons, and AI-powered plant recognition to make eco-education engaging and accessible for kids.

---

## 🎯 Project Overview

The main goal of **Green Mind** is to teach kids eco-friendly habits—such as recycling, planting, and saving resources—using interactive games and activities.
Children earn points and rewards as they progress, allowing them to grow a **virtual tree** that evolves with every achievement.

---

## ✨ Key Features

### 👶 Child Experience

* Play interactive environmental games (Puzzle, Memory, Sorting, etc.)
* Earn points and rewards for completing levels
* Grow a **virtual tree** based on accumulated points
* Unlock new lessons and fun educational content
* Upload plant photos for **AI-based plant recognition**

### 👨‍👩‍👧 Parent Experience

* Create a parent account and manage multiple child profiles
* Track each child’s progress and learning achievements
* Receive notifications and insights about the child’s activity
* View analytics showing performance, strengths, and improvements

### 🤖 AI Feature

Children can upload plant images, and the AI module provides:

* Plant name
* Care instructions
* Watering and sunlight needs
* Fertilizer recommendations

---

## 🧩 System Architecture (Updated to Firebase Backend)

```
[ React Frontend ]
        |
        ▼
[ Firebase Authentication ]
        |
        ▼
[ Firestore Database ] ---- [ Firebase Storage ]
        |
        ▼
[ Firebase Cloud Functions ]
        |
        ▼
[ Python AI Module (Plant Recognition API) ]
```

---

## 🛠 Tech Stack

| Layer    | Technology                                                           |
| -------- | -------------------------------------------------------------------- |
| Frontend | React.js, HTML, CSS, JavaScript                                      |
| Backend  | Firebase (Auth, Firestore, Storage, Cloud Functions)                 |
| AI       | Python (image classification model + REST API)                       |
| Tools    | Firebase Console, VS Code, GitHub, Postman, Figma, Adobe Illustrator |

---

## 🚀 How It Works

1. **Parents** create an account using Firebase Authentication.
2. They add one or more **child profiles** stored in Firestore.
3. **Children** start playing educational games and earn points.
4. Points help grow the **virtual tree** and unlock new lessons.
5. Children upload plant images → stored in Firebase Storage.
6. Firebase Cloud Functions send the image URL to the **Python AI API**.
7. The AI returns plant info → saved in Firestore → displayed to the child.
8. **Parents** monitor progress through their dashboard.

---

## 🎨 UI & UX Design

* Bright, colorful, kid-friendly interface suitable for ages 6–12
* Simple and intuitive navigation
* Rounded shapes, animations, and rewards for engagement
* Parent dashboard designed with clean layouts and easy-to-read analytics
* Tools used: **Figma**, Adobe Illustrator, Canva

Screens included:

* Home Page
* Games Dashboard
* Virtual Tree
* Lessons Page
* AI Plant Analyzer
* Parent Dashboard

---

## 📂 Folder Structure (Updated with Firebase Backend)

```
GreenMind/
│
├── frontend/                  # React.js interface
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.js
│   └── package.json
│
├── backend/                   # Firebase backend
│   ├── functions/             # Cloud Functions (Node.js)
│   ├── firestore_rules/
│   ├── storage_rules/
│   └── firebase.json
│
├── ai_module/                 # Python AI scripts
│   ├── model/
│   ├── predict.py
│   └── requirements.txt
│
├── database/                  # Temporary datasets / Excel (if needed)
│   └── GreenMindData.xlsx
│
└── README.md
```

---

## 👩‍💻 Team Roles

| Team          | Responsibilities                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Frontend Team | Design and build the React interface using UI/UX designs from Figma                                      |
| Backend Team  | Implement Firebase backend (Auth, Firestore, Storage, Cloud Functions) and secure all backend operations |
| AI Team       | Train and integrate the plant-recognition model and connect it with Firebase Cloud Functions             |
| Database Team | Prepare and manage initial datasets; maintain Firestore structure and optimize queries                   |

---

## 🔮 Future Enhancements

* Hardware integration (sensors to monitor real plants)
* Migration to multi-language support (English & Arabic)
* Enhanced AI accuracy with larger datasets
* Gamification: badges, leaderboards, and seasonal events
* Mobile app version for Android & iOS

---

## 🪪 License & Credits

This project is developed as part of a **Graduation Project** at *Culture and Science City*.
All rights reserved © 2025 **Green Mind Team**.
>>>>>>> a8557774fe7031a622c905eb78c375c3264fad87
