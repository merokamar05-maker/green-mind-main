
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";
import Sidebar from "@/app/_components/Sidebar";
import { useAuth } from "@/lib/AuthContext";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

/* ============================================================
   MOTIVATIONAL POPUP
============================================================ */
function ResultPopup({
  score,
  total,
  correct,
  quizNum,
  isLastQuiz,
  isAiQuiz,
  onClose,
  onNavigate,
}: {
  score: number;
  total: number;
  correct: number;
  quizNum: number;
  isLastQuiz: boolean;
  isAiQuiz: boolean;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const pct = Math.round((correct / total) * 100);

  /* -------- pick tier -------- */
  const tier =
    pct >= 80 ? "excellent" : pct >= 50 ? "good" : "tryAgain";

  const tiers = {
    excellent: {
      emoji: "🌟",
      color: "from-green-400 to-emerald-500",
      badge: "bg-yellow-400 text-yellow-900",
      badgeText: "Excellent!",
      title: "Amazing work! 🎉",
      messages: [
        "You're a true eco-champion! Every answer shows how much you care about our planet. 🌍",
        "Your hard work is paying off — you're one step closer to becoming a Green Mind hero! 💪",
        "Brilliant! The Earth is lucky to have a protector like you. Keep it up! 🌱",
      ],
    },
    good: {
      emoji: "💪",
      color: "from-blue-400 to-cyan-500",
      badge: "bg-blue-200 text-blue-900",
      badgeText: "Good Job!",
      title: "Well done! Keep going! 🚀",
      messages: [
        "You're making great progress! Every quiz brings you closer to mastering eco-knowledge. 🌿",
        "Nice effort! A little more practice and you'll be scoring 100%! You've got this! 🔥",
        "Your dedication to learning about the environment is truly inspiring. Don't stop now! 🌎",
      ],
    },
    tryAgain: {
      emoji: "🌱",
      color: "from-orange-400 to-amber-500",
      badge: "bg-orange-100 text-orange-800",
      badgeText: "Keep Trying!",
      title: "Every try makes you stronger! 🌱",
      messages: [
        "Don't give up! Even the tallest trees started as tiny seeds. Review the lesson and try again! 🌳",
        "Learning takes time, and that's perfectly okay! Each attempt teaches you something new. 💡",
        "Mistakes are the secret ingredient of success! Go back, review, and come back stronger! 🌟",
      ],
    },
  };

  const t = tiers[tier];
  const msg = t.messages[Math.floor(Math.random() * t.messages.length)];

  /* -------- unlock message -------- */
  let unlockMsg: React.ReactNode = null;
  if (!isAiQuiz) {
    if (isLastQuiz) {
      unlockMsg = (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🎓</p>
          <p className="font-bold text-purple-700 text-lg">
            You&apos;ve completed ALL lessons!
          </p>
          <p className="text-purple-500 text-sm mt-1">
            You&apos;re officially a Green Mind graduate. There are no more
            quizzes — you&apos;ve mastered it all! 🌍✨
          </p>
        </div>
      );
    } else {
      unlockMsg = (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🔓</p>
          <p className="font-bold text-green-700 text-lg">
            Lesson {quizNum + 1} is now unlocked!
          </p>
          <p className="text-green-500 text-sm mt-1">
            A new adventure awaits you. Head back to lessons to continue! 🚀
          </p>
        </div>
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Gradient header */}
        <div className={`bg-gradient-to-r ${t.color} p-8 text-center relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <IoClose size={24} />
          </button>

          <div className="text-6xl mb-3">{t.emoji}</div>
          <span className={`${t.badge} px-4 py-1 rounded-full text-sm font-bold`}>
            {t.badgeText}
          </span>
          <h2 className="text-white text-2xl font-bold mt-3">{t.title}</h2>

          {/* Score ring */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
              <span className="text-4xl font-black">{correct}</span>
              <span className="text-xl opacity-80">/{total}</span>
              <p className="text-xs opacity-80 mt-1">correct answers</p>
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
              <span className="text-4xl font-black">{pct}%</span>
              <p className="text-xs opacity-80 mt-1">score</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-center text-base leading-relaxed">
            {msg}
          </p>

          {unlockMsg}

          <button
            onClick={onNavigate}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition active:scale-95 shadow-lg"
          >
            {isAiQuiz
              ? "Back to Dashboard 🏠"
              : isLastQuiz
              ? "See my achievements 🏆"
              : "Back to Lessons 📚"}
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 text-gray-400 hover:text-gray-600 transition text-sm py-2"
          >
            Review my answers
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function DynamicQuiz() {
  const { user, userData, updateUserData } = useAuth();
  const params = useParams();
  const router = useRouter();
  const quizId = (params.id as string) || "video1";

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAiQuiz, setIsAiQuiz] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const TOTAL_FIXED_QUIZZES = 6;

  const allQuestions = {
    video1: [
      { q: "What is the first step of recycling?", options: ["Throwing it away", "Sorting", "Burning", "Nothing"], correctIndex: 1 },
      { q: "Can we recycle plastic bottles?", options: ["Yes", "No", "Maybe", "Only some"], correctIndex: 0 },
      { q: "What color is usually for paper bins?", options: ["Red", "Blue", "Green", "Yellow"], correctIndex: 1 },
      { q: "Recycling helps the...", options: ["Mars", "Earth", "Moon", "Sun"], correctIndex: 1 },
      { q: "Is glass recyclable?", options: ["No", "Yes", "Never", "Only blue glass"], correctIndex: 1 },
    ],
    video2: [
      { q: "Why do we sort waste?", options: ["To make it messy", "To help recycling", "To waste time", "To fill bins"], correctIndex: 1 },
      { q: "Where does organic waste go?", options: ["Plastic bin", "Compost", "Glass bin", "Metal bin"], correctIndex: 1 },
      { q: "Is an apple core organic?", options: ["No", "Yes", "Plastic", "Metal"], correctIndex: 1 },
      { q: "Can we recycle dirty pizza boxes?", options: ["Yes", "No", "Always", "Maybe"], correctIndex: 1 },
      { q: "Sorting is...", options: ["Hard", "Important", "Useless", "A game"], correctIndex: 1 },
    ],
    video3: [
      { q: "Where does most plastic end up if not recycled?", options: ["Forest", "Ocean", "Mountains", "Space"], correctIndex: 1 },
      { q: "What animal is most hurt by ocean plastic?", options: ["Lion", "Sea Turtle", "Eagle", "Horse"], correctIndex: 1 },
      { q: "Should we use single-use bags?", options: ["Yes", "No", "Every day", "Sometimes"], correctIndex: 1 },
      { q: "Ocean protection starts with...", options: ["Us", "Fish", "The Moon", "Clouds"], correctIndex: 0 },
      { q: "Is the ocean important for Earth?", options: ["No", "A little", "Yes, very!", "Not sure"], correctIndex: 2 },
    ],
    video4: [
      { q: "Which part of the plant is underground?", options: ["Leaves", "Stem", "Roots", "Flower"], correctIndex: 2 },
      { q: "What do leaves do?", options: ["Hold the plant", "Make food", "Drink water", "Nothing"], correctIndex: 1 },
      { q: "The stem is like a...", options: ["Hat", "Straw", "Shoe", "Car"], correctIndex: 1 },
      { q: "What do flowers produce?", options: ["Stones", "Seeds", "Water", "Air"], correctIndex: 1 },
      { q: "Plants need sunlight to...", options: ["Sleep", "Grow", "Run", "Talk"], correctIndex: 1 },
    ],
    video5: [
      { q: "What is the main function of the stem?", options: ["Drink water", "Support the plant", "Make seeds", "Sleep"], correctIndex: 1 },
      { q: "Plants need water and... to grow.", options: ["Juice", "Sunlight", "Milk", "Soda"], correctIndex: 1 },
      { q: "Where does the plant get its energy?", options: ["The Moon", "The Sun", "The Wind", "The Rain"], correctIndex: 1 },
      { q: "Are all plants the same size?", options: ["Yes", "No", "Always", "Maybe"], correctIndex: 1 },
      { q: "Leaves are usually which color?", options: ["Blue", "Green", "Red", "Yellow"], correctIndex: 1 },
    ],
    video6: [
      { q: "Can we protect nature together?", options: ["No", "Yes!", "Never", "Hardly"], correctIndex: 1 },
      { q: "Is planting trees good for Earth?", options: ["No", "Yes", "Bad", "Useless"], correctIndex: 1 },
      { q: "Should we waste water?", options: ["Yes", "No", "Always", "Sometimes"], correctIndex: 1 },
      { q: "Earth is our...", options: ["School", "Home", "Bag", "Car"], correctIndex: 1 },
      { q: "Helping nature is...", options: ["Boring", "Our job", "Easy", "Hard"], correctIndex: 1 },
    ],
  };

  const currentLessonNum = !isAiQuiz ? parseInt(quizId.replace("video", "")) : 0;
  const isLastQuiz = currentLessonNum === TOTAL_FIXED_QUIZZES;

  useEffect(() => {
    const fetchQuiz = async () => {
      if (quizId in allQuestions) {
        const selectedQuestions = allQuestions[quizId as keyof typeof allQuestions];
        setQuestions(selectedQuestions);
        setAnswers(new Array(selectedQuestions.length).fill(-1));
        setIsAiQuiz(false);
        setLoading(false);
      } else {
        try {
          setLoading(true);
          setIsAiQuiz(true);
          const res = await fetch(`http://127.0.0.1:8000/quiz/${quizId}`);
          if (!res.ok) throw new Error("AI Server is offline");
          const data = await res.json();
          if (data.quiz && Array.isArray(data.quiz)) {
            const formatted = data.quiz.map((q: QuizQuestion, i: number) => ({
              id: i + 1,
              q: q.question,
              options: q.options,
              correctIndex: q.options.indexOf(q.answer) !== -1 ? q.options.indexOf(q.answer) : 0,
            }));
            setQuestions(formatted);
            setAnswers(Array(formatted.length).fill(-1));
            setError(null);
          } else {
            setError("No quiz data available for this topic.");
          }
        } catch (err: any) {
          console.error(err);
          setError("🔴 AI Server Error: Please make sure the backend (uvicorn) is running on port 8000.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleSelect = (qIndex: number, oIndex: number) => {
    if (submitted) return;
    const copy = [...answers];
    copy[qIndex] = oIndex;
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setShowPopup(true);

    /* ---- Unlock next lesson in localStorage ---- */
    if (!isAiQuiz) {
      const saved = localStorage.getItem("greenMindProgress");
      const prog = saved ? JSON.parse(saved) : { maxUnlockedLesson: 1, videoWatched: false };
      if (currentLessonNum === prog.maxUnlockedLesson && !isLastQuiz) {
        localStorage.setItem(
          "greenMindProgress",
          JSON.stringify({ maxUnlockedLesson: currentLessonNum + 1, videoWatched: false })
        );
      }
    }

    /* ---- Save to Firestore ---- */
    if (userData && questions.length > 0) {
      const correct = answers.filter((a, i) => a === questions[i]?.correctIndex).length;
      const score = Math.round((correct / questions.length) * 100);
      const currentProgress = userData.progress || {
        scansCount: 0, lessonsCompleted: [], quizScores: {},
        gamesProgress: { puzzle: 0, memory: 0, matching: 0 },
        treeLevel: 1, weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
      };
      const newQuizScores = { ...(currentProgress.quizScores || {}), [quizId]: score };
      const newLessonsCompleted = [...(currentProgress.lessonsCompleted || [])];
      if (!newLessonsCompleted.includes(quizId)) newLessonsCompleted.push(quizId);
      const todayIndex = new Date().getDay();
      const newWeeklyProgress = [...(currentProgress.weeklyProgress || [0,0,0,0,0,0,0])];
      newWeeklyProgress[todayIndex] = Math.min(100, (newWeeklyProgress[todayIndex] || 0) + 15);
      await updateUserData({
        progress: { ...currentProgress, quizScores: newQuizScores, lessonsCompleted: newLessonsCompleted, weeklyProgress: newWeeklyProgress },
      });
    }
  };

  const correctCount = answers.filter((a, i) => a === questions[i]?.correctIndex).length;

  /* ---- Loading / Error states ---- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] font-bold text-green-700 text-xl">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        {isAiQuiz ? "🤖 AI is generating your quiz..." : "Loading your questions... ⏳"}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Image src="/SCreen/Group 45.png" width={150} height={150} alt="error" className="mb-6 opacity-50" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Connection Issue</h2>
        <p className="text-gray-600 max-w-md mb-8">{error}</p>
        <button onClick={() => window.location.reload()}
          className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition">
          Try to Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {!isAiQuiz ? <Sidebar /> : null}

      <div className="flex-1 overflow-y-auto bg-cover bg-center relative"
        style={{ backgroundImage: "url('/SCreen/growth.png')" }}>

        {/* Navbar */}
        <nav className="w-full py-6 shadow-lg bg-gradient-to-r from-[#00C9FF] to-[#92FE9D] flex items-center px-6 relative z-10">
          {isAiQuiz && (
            <button onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-green-100 transition font-medium mr-4">
              <IoArrowBackOutline size={24} />
            </button>
          )}
          <h1 className="text-white text-2xl font-bold text-center flex-1">
            {isAiQuiz ? `AI Quiz: ${quizId.toUpperCase()}` : "Eco-Explorer Quiz 🌍"}
          </h1>
          {!isAiQuiz && (
            <span className="text-white/80 text-sm font-medium">
              Quiz {currentLessonNum} of {TOTAL_FIXED_QUIZZES}
            </span>
          )}
        </nav>

        {/* Hero banner */}
        <div className="max-w-4xl mx-auto w-full p-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center mb-10 bg-white p-8 rounded-3xl shadow-md gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Test Your Knowledge!</h2>
              <p className="text-gray-600">
                We&apos;ve gathered <span className="font-bold text-green-600">{questions.length}</span> questions for you.
                {!isAiQuiz && (
                  <span className="ml-2 text-gray-400 text-sm">
                    (Quiz {currentLessonNum}/{TOTAL_FIXED_QUIZZES})
                  </span>
                )}
              </p>
              {submitted && (
                <p className="mt-3 font-semibold text-green-700">
                  Your score: <span className="text-2xl font-black">{Math.round((correctCount / questions.length) * 100)}%</span>
                </p>
              )}
            </div>
            <Image src="/SCreen/Group 45.png" alt="Illustration" width={120} height={120} />
          </div>

          {/* Questions */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-green-100">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-10 last:mb-0">
                <h3 className="text-xl font-bold text-green-900 mb-6 flex gap-3">
                  <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {qIndex + 1}
                  </span>
                  {q.q}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt: string, oIndex: number) => {
                    const isSelected = answers[qIndex] === oIndex;
                    const isCorrect = q.correctIndex === oIndex;
                    let bgClass = "bg-gray-50 border-gray-200 hover:border-green-300";
                    if (isSelected) bgClass = "bg-green-100 border-green-500 text-green-800";
                    if (submitted) {
                      if (isCorrect) bgClass = "bg-green-500 border-green-600 text-white shadow-lg scale-[1.02]";
                      else if (isSelected) bgClass = "bg-red-500 border-red-600 text-white";
                    }
                    return (
                      <button key={oIndex} onClick={() => handleSelect(qIndex, oIndex)} disabled={submitted}
                        className={`p-5 rounded-2xl border-2 text-left font-medium transition-all ${bgClass}`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!submitted ? (
              <button onClick={handleSubmit} disabled={answers.includes(-1)}
                className={`w-full mt-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-lg ${
                  answers.includes(-1)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#3EF772] to-[#34c759] text-white hover:scale-[1.02] active:scale-[0.98]"
                }`}>
                Submit Answers 🚀
              </button>
            ) : (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => router.push(isAiQuiz ? "/dashboard" : "/lesson-page")}
                  className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-md">
                  {isAiQuiz ? "Back to Dashboard 🏠" : isLastQuiz ? "See my achievements 🏆" : "Back to Lessons 📚"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======= MOTIVATIONAL POPUP ======= */}
      {showPopup && (
        <ResultPopup
          score={Math.round((correctCount / questions.length) * 100)}
          total={questions.length}
          correct={correctCount}
          quizNum={currentLessonNum}
          isLastQuiz={isLastQuiz}
          isAiQuiz={isAiQuiz}
          onClose={() => setShowPopup(false)}
          onNavigate={() => router.push(isAiQuiz ? "/dashboard" : "/lesson-page")}
        />
      )}
    </div>
  );
}
