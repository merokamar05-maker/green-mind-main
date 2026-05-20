"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IoArrowBackOutline, IoSparkles } from "react-icons/io5";
import { useAuth } from "@/lib/AuthContext";

/* ---- Inner component that uses useSearchParams ---- */
function LessonContent() {
  const { userData, updateUserData } = useAuth();
  const searchParams = useSearchParams();
  const videoFromUrl = searchParams.get("video");

  const relatedLessons = [
    {
      id: 1,
      title: "Nature And Environment",
      level: 1,
      duration: "3 min",
      video: "https://www.youtube.com/embed/bg-A5kJi1P8",
      image: "https://img.youtube.com/vi/bg-A5kJi1P8/maxresdefault.jpg",
      video_key: "video7"
    },
    {
      id: 2,
      title: "Protect The Earth",
      level: 1,
      duration: "2 min",
      video: "https://www.youtube.com/embed/37JLoAGdv1c",
      image: "https://img.youtube.com/vi/37JLoAGdv1c/maxresdefault.jpg",
      video_key: "video8"
    },
    {
      id: 3,
      title: "Clean Environment",
      level: 2,
      duration: "4 min",
      video: "https://www.youtube.com/embed/d3z3rsVdKLc",
      image: "https://img.youtube.com/vi/d3z3rsVdKLc/maxresdefault.jpg",
      video_key: "video9"
    },
    {
      id: 4,
      title: "Save Our Planet",
      level: 2,
      duration: "3 min",
      video: "https://www.youtube.com/embed/qWTvC8tBfwY",
      image: "https://img.youtube.com/vi/qWTvC8tBfwY/hqdefault.jpg",
      video_key: "video10"
    },
  ];

  const [currentVideo, setCurrentVideo] = useState(
    relatedLessons[0].video
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (videoFromUrl) {
      setCurrentVideo(videoFromUrl);
    }
  }, [videoFromUrl]);

  useEffect(() => {
    setIsPlaying(false);
    setCountdown(10);
  }, [currentVideo]);

  const currentVideoId = currentVideo.split("/").pop();

  const videoEntry = Object.entries({
    video1: "FpOWG4GDvx4",
    video2: "V_1vpEEnXW0",
    video3: "aLY46g18hWk",
    video4: "tNbTppAbEVc",
    video5: "AltruHFIBAQ",
    video6: "xpAnLXc_bIU",
    video7: "bg-A5kJi1P8",
    video8: "37JLoAGdv1c",
    video9: "d3z3rsVdKLc",
    video10: "qWTvC8tBfwY",
  }).find(([key, id]) => id === currentVideoId);

  const currentVideoKey = videoEntry ? videoEntry[0] : "video1";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isAlreadyWatched = userData?.progress?.watchedVideos?.includes(currentVideoKey);

    if (isPlaying && countdown > 0 && !isAlreadyWatched) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, countdown, userData, currentVideoKey]);

  const hideQuizVideos = ["video7", "video8", "video9", "video10"];
  const showQuiz = !hideQuizVideos.includes(currentVideoKey);

  const lessonObj = relatedLessons.find(lesson => lesson.video === currentVideo);
  const coverImage = lessonObj?.image || `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`;

  const handleClaimVideoXp = async () => {
    if (!userData) return;
    const currentProgress = userData.progress || {
      scansCount: 0,
      lessonsCompleted: [],
      quizScores: {},
      gamesProgress: { puzzle: 0, memory: 0, matching: 0 },
      treeLevel: 1,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
      xp: 0
    };

    const watched = currentProgress.watchedVideos || [];
    if (watched.includes(currentVideoKey)) return;

    const newWatched = [...watched, currentVideoKey];
    const currentXp = currentProgress.xp || 0;
    const newXp = currentXp + 30;
    const newTreeLevel = Math.min(5, Math.floor(newXp / 100) + 1);
    const isLevelUp = newTreeLevel > (currentProgress.treeLevel || 1);

    try {
      await updateUserData({
        progress: {
          ...currentProgress,
          xp: newXp,
          treeLevel: newTreeLevel,
          watchedVideos: newWatched,
        },
      });
      if (isLevelUp) {
        alert(`🎉 Awesome! You earned +30 XP for watching the video! Your tree has grown to Level ${newTreeLevel}! 🌳`);
      } else {
        alert("🎉 Awesome! You earned +30 XP for watching the video! 🌟");
      }
    } catch (err) {
      console.error("Failed to claim video XP:", err);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;700;800;900&display=swap');

        .eco-body-v3 {
          font-family: 'Fredoka', 'Nunito', sans-serif;
          background: linear-gradient(180deg, #F6FDF9 0%, #EDFAF3 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Floating background decoration */
        .decor-item {
          position: absolute;
          pointer-events: none;
          opacity: 0.38;
          z-index: 1;
          animation: driftFloat 6s ease-in-out infinite;
        }

        @keyframes driftFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        /* Video premium container */
        .video-wrapper-premium {
          border-radius: 24px;
          border: 5px solid #D1FAE5;
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.12);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .video-wrapper-premium:hover {
          border-color: #A7F3D0;
          box-shadow: 0 20px 50px rgba(16, 185, 129, 0.2);
        }

        /* ── All Buttons Styling (Extremely polished, modern rounded elements) ── */
        .btn-style-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #047857;
          background: white;
          border: 2px solid #E6F4EA;
          font-weight: 700;
          font-size: 16px;
          padding: 10px 24px;
          border-radius: 50px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
          transition: all 0.25s ease;
        }
        .btn-style-back:hover {
          transform: translateY(-2px);
          background: #F3FDF7;
          border-color: #A7F3D0;
          box-shadow: 0 6px 15px rgba(4, 120, 87, 0.1);
        }
        .btn-style-back:active {
          transform: scale(0.97);
        }

        /* Claim XP status buttons */
        .btn-status-claimed {
          background: #E8FDF0;
          color: #047857;
          border: 2px solid #A7F3D0;
          font-weight: 700;
          font-size: 16px;
          padding: 12px 30px;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.05);
          cursor: not-allowed;
        }

        .btn-status-pending {
          background: #F3F4F6;
          color: #9CA3AF;
          border: 2px solid #E5E7EB;
          font-weight: 700;
          font-size: 16px;
          padding: 12px 30px;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          cursor: not-allowed;
        }

        .btn-status-countdown {
          background: #FFFBEB;
          color: #D97706;
          border: 2px solid #FDE68A;
          font-weight: 700;
          font-size: 16px;
          padding: 12px 30px;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.06);
          animation: pulse 2s infinite;
          cursor: not-allowed;
        }

        .btn-action-claim {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: white;
          font-weight: 700;
          font-size: 16px;
          padding: 14px 34px;
          border-radius: 50px;
          box-shadow: 0 8px 24px rgba(217, 119, 6, 0.35);
          border: 2px solid #FFFFFF;
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .btn-action-claim:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 30px rgba(217, 119, 6, 0.5);
        }
        .btn-action-claim:active {
          transform: scale(0.97);
        }

        /* Quiz Action Button */
        .btn-action-quiz {
          background: linear-gradient(135deg, #4AF07C 0%, #17D052 100%);
          color: white !important;
          font-weight: 700;
          font-size: 18px;
          padding: 14px 38px;
          border-radius: 50px;
          box-shadow: 0 8px 24px rgba(23, 208, 82, 0.35);
          border: 2px solid #FFFFFF;
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-block;
          text-decoration: none;
        }
        .btn-action-quiz:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 12px 30px rgba(23, 208, 82, 0.5);
        }
        .btn-action-quiz:active {
          transform: scale(0.97);
        }

        /* Watch button in related lessons list */
        .btn-style-watch {
          background: #E8FDF0;
          color: #3EF772;
          border: 2px solid #C4FBE3;
          font-weight: 700;
          font-size: 14px;
          padding: 6px 20px;
          border-radius: 50px;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .btn-style-watch:hover {
          background: #3EF772;
          color: white;
          border-color: #3EF772;
          transform: scale(1.05);
        }

        /* ── Modern Playful Quiz Card (Solid smooth borders, highly Child-friendly) ── */
        .quiz-playful-box-smooth {
          background: #FFFDF0;
          border: 3px solid #FCD34D;
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.08);
          transition: all 0.3s ease;
        }
        .quiz-playful-box-smooth:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(245, 158, 11, 0.15);
        }

        /* ── Modern Premium Box colors (requested adjustments) ── */
        .overview-box-styled {
          background: #FFFFFF;
          border-radius: 24px;
          border: 2px solid #E6F4EA;
          box-shadow: 0 10px 25px rgba(22, 101, 52, 0.03);
          transition: all 0.3s ease;
        }
        .overview-box-styled:hover {
          border-color: #A7F3D0;
          box-shadow: 0 15px 35px rgba(22, 101, 52, 0.06);
        }

        .learn-box-styled {
          background: linear-gradient(135deg, #F0FDFA 0%, #E6FFFA 100%);
          border-radius: 24px !important;
          border: 2px solid #CCFBF1 !important;
          box-shadow: 0 10px 25px rgba(13, 148, 136, 0.03) !important;
          transition: all 0.3s ease;
        }
        .learn-box-styled:hover {
          border-color: #99F6E4 !important;
          box-shadow: 0 15px 35px rgba(13, 148, 136, 0.06) !important;
        }

        /* ── Animated character inside Footer ── */
        @keyframes characterBounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
        .animated-footer-logo {
          animation: characterBounce 3s ease-in-out infinite;
        }
      `}</style>

      <div className="eco-body-v3 relative pb-1">
        {/* Ambient decorators */}
        <div className="decor-item text-3xl top-20 left-[4%]">🌿</div>
        <div className="decor-item text-4xl top-40 right-[5%]">🦋</div>
        <div className="decor-item text-2xl bottom-1/3 left-[5%]">🌱</div>

        <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
          
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/lessons"
              className="btn-style-back"
            >
              <IoArrowBackOutline size={20} />
              Back to Lessons
            </Link>
          </div>

          {/* Video Section */}
          <div className="video-wrapper-premium p-2 mb-6 bg-white/60">
            <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-black flex items-center justify-center">
              {isPlaying ? (
                <iframe
                  key={currentVideo}
                  className="w-full h-full"
                  src={`${currentVideo}?autoplay=1`}
                  title="Lesson Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div 
                  onClick={() => setIsPlaying(true)}
                  className="group absolute inset-0 cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-300"
                >
                  <Image 
                    src={coverImage} 
                    fill 
                    alt="Video Thumbnail"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.8]"
                  />

                  {/* Play Overlay */}
                  <div className="absolute w-20 h-20 bg-green-500/80 hover:bg-green-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] group-hover:scale-110 active:scale-95 transition-all border-4 border-white/50 z-20">
                    <svg className="w-8 h-8 text-white ml-1.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-bold border border-white/20 shadow-md">
                    ▶️ Click here to play the video lesson
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Claim XP Button */}
          {userData && (
            <div className="mt-4 mb-8 flex justify-center">
              {userData.progress?.watchedVideos?.includes(currentVideoKey) ? (
                <button
                  disabled
                  className="btn-status-claimed flex items-center gap-2"
                >
                  🎉 Video Watched (+30 XP already added)
                </button>
              ) : !isPlaying ? (
                <button
                  disabled
                  className="btn-status-pending flex items-center gap-2"
                >
                  ▶️ Start watching the video first to get XP
                </button>
              ) : countdown > 0 ? (
                <button
                  disabled
                  className="btn-status-countdown flex items-center gap-2"
                >
                  ⏳ Please watch the lesson to get XP... ({countdown} seconds)
                </button>
              ) : (
                <button
                  onClick={handleClaimVideoXp}
                  className="btn-action-claim flex items-center gap-2"
                >
                  ⭐ Click here to claim +30 XP for watching the video!
                </button>
              )}
            </div>
          )}

          {/* Main Content (Restored exact HTML/text structures and titles - with styled square colors) */}
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            
            {/* Left Column wrapper (Overview) */}
            <div className="overview-box-styled p-6 flex flex-col gap-6 md:w-[47%]">
              <div>
                <h1 className="font-poppins font-medium text-[30px] text-[#0B3D00]">
                  Recycling Basics - Lesson 1
                </h1>
                <p className="font-poppins font-normal text-[22px] mt-1 text-[#333333]">
                  Level 1 • Duration: 2 minutes
                </p>
              </div>

              <div className="p-1">
                <h2 className="text-[30px] text-[#333333] font-poppins font-medium">
                  Overview
                </h2>
                <div className="mt-3 text-[#000000] font-poppins font-medium text-[18px] leading-6 space-y-2">
                  <p>Learn how recycling helps protect our planet!</p>
                  <p>In this video, kids will discover what recycling means,</p>
                  <p>why it's important, and how simple actions like sorting</p>
                  <p>plastic, paper, and metal ♻️🌍</p>
                </div>
              </div>
            </div>

            {/* Right Column wrapper (What you will learn) */}
            <div className="learn-box-styled bg-[#EAFBFF] p-6 rounded-lg shadow-sm md:w-[53%]">
              <h2 className="font-poppins font-normal text-[27px] text-[#000000]">
                What you will learn
              </h2>
              <ul className="mt-5 list-disc list-inside text-[#666666] font-poppins font-medium text-[21px]">
                <li>What Recycling Means</li>
                <li>How To Sort Waste</li>
                <li>Recyclable Materials</li>
                <li>Why Recycling Helps Earth</li>
                <li>Simple Eco Habits</li>
              </ul>
            </div>

          </div>

          {/* Quiz (Redesigned to be child-friendly, bright, and solid, with polished green button) */}
          {showQuiz && (
            <div className="mt-10">
              <div className="quiz-playful-box-smooth flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Visual side */}
                <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
                  <div className="text-5xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>🏆</div>
                  <div>
                    <h3 className="text-2xl font-bold text-amber-800 font-poppins">
                      Lesson Quiz
                    </h3>
                    <p className="text-amber-600 font-semibold text-base mt-1">
                      5 Questions
                    </p>
                  </div>
                </div>

                {/* Highly polished bubbly green Start Now button */}
                <Link
                  href={`/quiz/${currentVideoKey}`}
                  className="btn-action-quiz px-10 py-4"
                >
                  Start Now
                </Link>

              </div>
            </div>
          )}

          {/* Related Lessons (Restored exact HTML/layout structures) */}
          <div className="mt-10">
            <h2 className="font-semibold mb-4 text-xl">Related Lessons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {relatedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-[#E6fdE4] p-4 rounded-xl flex items-center gap-8"
                >
                  <Image
                    src={lesson.image}
                    width={150}
                    height={150}
                    alt={lesson.title}
                    className="rounded-xl"
                  />
                  <div className="text-center ml-10">
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm mt-5">
                      Level {lesson.level} • {lesson.duration}
                    </p>
                    <Link
                      href={`/lesson-page?video=${encodeURIComponent(lesson.video)}`}
                      className="btn-style-watch"
                    >
                      Watch
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer (Restored exact HTML with gradient and animated mascot!) */}
        <header className="w-full bg-gradient-to-r from-[#2ecc71] via-[#27ae60] to-[#34c759] py-6 mt-10">
          <div className="px-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/screen/Group 45.png"
                width={70}
                height={70}
                alt="Green Mind"
                className="animated-footer-logo"
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold leading-tight">
                  Green <br /> Mind
                </h1>
                <p className="text-sm opacity-90 mt-2">
                  Fun Eco-Learning For Kids
                </p>
              </div>
            </div>

            <div className="flex gap-16 text-white">
              <div>
                <h3 className="font-semibold mb-2">Explore</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/lessons" className="hover:text-green-600 transition">
                      Lessons
                    </Link>
                  </li>
                  <li>
                    <Link href="/games" className="hover:text-green-600 transition">
                      Games
                    </Link>
                  </li>
                  <li>
                    <Link href="/ai-scan" className="hover:text-green-600 transition">
                      AI Plant Scan
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Help & Info</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/parent">
                      Parent Guide
                    </Link>
                  </li>
                  <li><Link href="#">Contact Us</Link></li>
                  <li><Link href="#">Privacy and Safety</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-white text-xs mt-6 opacity-80">
            © 2025 Green Mind. All Rights Reserved.
          </p>
        </header>

      </div>
    </>
  );
}

/* ---- Default export wrapped in Suspense (required by Next.js 16) ---- */
export default function LessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F6FDF9]">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LessonContent />
    </Suspense>
  );
}