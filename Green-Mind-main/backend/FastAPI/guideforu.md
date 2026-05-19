# 🎯 Quiz API Documentation
uvicorn app:app --reload
## 📌 Base URL

```
http://127.0.0.1:8000
```

---

## 🧠 Endpoint

### GET /quiz/{video_key}

Generate quiz based on a specific video.

---

## 🎥 Available Videos

| Key    | Description             |
| ------ | ----------------------- |
| video1 | First educational video |
| video2 | Second video            |
| video3 | Third video             |
| video4 | Fourth video            |
| video5 | Fifth video             |

---

## 📥 Request Example

```
GET /quiz/video1
```

---

## 📤 Response Example

```json
{
  "video_key": "video1",
  "quiz": [
    {
      "question": "What do we plant first to grow a tree?",
      "options": ["A seed", "A branch", "A leaf", "A flower"],
      "answer": "A"
    },
    {
      "question": "How does a tree get water?",
      "options": ["Leaves", "Branches", "Roots", "Flowers"],
      "answer": "C"
    }
  ]
}
```

---




Video1 : https://www.youtube.com/watch?v=FpOWG4GDvx4

Video2 : https://www.youtube.com/watch?v=V_1vpEEnXW0

Video3 : https://www.youtube.com/watch?v=aLY46g18hWk

Video4 : https://www.youtube.com/watch?v=tNbTppAbEVc

Video5 : https://www.youtube.com/watch?v=AltruHFIBAQ