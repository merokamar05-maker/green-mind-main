from groq import Groq
import json
client = Groq(api_key="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")



def generate_quiz(transcript):
    prompt = f"""
You are a teacher for kids (age 6-10).

Based on this content:
{transcript}

"Create 5 multiple choice questions IN ENGLISH only, even if the content is in Arabic."
Rules:
- Use simple language
- Make it fun
- Each question has 4 options
- Return ONLY valid JSON
- Do NOT add any text before or after JSON

Format:
[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "..."
  }}
]
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.choices[0].message.content.strip()

    # 🧠 تنظيف لو الموديل رجع ```json ```
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    # 🔥 تحويل النص إلى JSON
    try:
        quiz = json.loads(text)
    except Exception as e:
        raise ValueError(f"Invalid JSON returned from model: {e}\n\n{text}")

    return quiz