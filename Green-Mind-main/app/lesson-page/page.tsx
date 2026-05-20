"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { useAuth } from "@/lib/AuthContext";

/* ---- Inner component that uses useSearchParams ---- */
function LessonContent() {
  const { userData, updateUserData } = useAuth();
  const searchParams = useSearchParams();
  const videoFromUrl = searchParams.get("video");

  const quizzes = [
    { id: 1, questions: 5 },
    { id: 2, questions: 5 },
    { id: 3, questions: 5 },
  ];

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
    <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors font-medium text-lg"
        >
          <IoArrowBackOutline size={22} />
          Back to Lessons
        </Link>
      </div>

      {/* Video Section */}
      <div className="rounded-xl overflow-hidden shadow-lg border-4 border-green-200/50">
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
              {/* Background Thumbnail Image */}
              <Image 
                src={coverImage} 
                fill 
                alt="Video Thumbnail"
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.8]"
              />

              {/* Glowing Play Button overlay */}
              <div className="absolute w-20 h-20 bg-green-500/80 hover:bg-green-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] group-hover:scale-110 active:scale-95 transition-all border-4 border-white/50 z-20">
                <svg className="w-8 h-8 text-white ml-1.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Action Banner */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-bold border border-white/20 shadow-md">
                ▶️ Click here to play the video lesson
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim XP Button */}
      {userData && (
        <div className="mt-4 flex justify-center">
          {userData.progress?.watchedVideos?.includes(currentVideoKey) ? (
            <button
              disabled
              className="bg-green-100 text-green-700 border-2 border-green-300 font-bold px-8 py-3 rounded-2xl flex items-center gap-2 cursor-not-allowed text-base shadow-sm"
            >
              🎉 Video Watched (+30 XP already added)
            </button>
          ) : !isPlaying ? (
            <button
              disabled
              className="bg-gray-100 text-gray-400 border-2 border-gray-300 font-bold px-8 py-3 rounded-2xl flex items-center gap-2 cursor-not-allowed text-base shadow-sm"
            >
              ▶️ Start watching the video first to get XP
            </button>
          ) : countdown > 0 ? (
            <button
              disabled
              className="bg-amber-100 text-amber-600 border-2 border-amber-300 font-bold px-8 py-3 rounded-2xl flex items-center gap-2 cursor-not-allowed text-base shadow-sm animate-pulse"
            >
              ⏳ Please watch the lesson to get XP... ({countdown} seconds)
            </button>
          ) : (
            <button
              onClick={handleClaimVideoXp}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold px-8 py-3 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-base animate-bounce"
            >
              ⭐ Click here to claim +30 XP for watching the video!
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        {/* Left */}
        <div className="flex flex-col gap-6 md:w-[47%]">
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

        {/* Right */}
        <div className="bg-[#EAFBFF] p-4 rounded-lg shadow-sm md:w-[53%]">
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

      {/* Quiz */}
      {showQuiz && (
        <div className="mt-6">
          <div className="bg-[#fff3cc] p-6 rounded-2xl shadow-md text-center">
            <h3 className="font-poppins font-semibold text-2xl">
              Lesson Quiz
            </h3>
            <p className="text-[#333333] mt-2 mb-5">
              5 Questions
            </p>
            <Link
              href={`/quiz/${currentVideoKey}`}
              className="inline-block px-8 py-3 bg-[#3EF772] text-white rounded-xl font-bold hover:bg-green-600 transition"
            >
              Start Now
            </Link>
          </div>
        </div>
      )}

      {/* Related Lessons */}
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
                  className="mt-2 inline-block text-[#3EF772] px-4 py-1 rounded-full hover:scale-105 transition"
                >
                  Watch
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <header className="w-full bg-[#34c759] py-6 mt-10">
        <div className="px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/screen/Group 45.png"
              width={70}
              height={70}
              alt="Green Mind"
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
  );
}

/* ---- Default export wrapped in Suspense (required by Next.js 16) ---- */
export default function LessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LessonContent />
    </Suspense>
  );
}