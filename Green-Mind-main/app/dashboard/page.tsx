

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoCloseOutline,
} from "react-icons/io5";
import Sidebar from "@/app/_components/Sidebar";
import { PieChart, Pie, Cell } from "recharts";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

/* ==================== DATA ==================== */

const moodContent: any = {
  Happy: {
    messages: [
      "Your happiness makes us happy! Stay smiling and excited to learn! 🌟",
      "Keep smiling, your day is as beautiful as you are! 😊",
      "The joy inside you lights up everyone around you! ✨",
      "Always stay positive and enjoy every single moment! 💛",
      "We are so glad you are happy! Keep up the good energy! 🎉",
    ],
    color: "text-yellow-700 bg-white",
    emoji: "😊",
  },

  Sad: {
    messages: [
      "Don't be sad, we are always here with you! ❤️",
      "Sadness is a natural feeling, and it will pass soon! 🌿",
      "You are not alone, everything will get better! ✨",
      "Take your time and relax, everything heals with time! 💙",
      "Smile even if it is hard, tomorrow will be beautiful! 😊",
    ],
    color: "text-blue-700 bg-white",
    emoji: "😢",
    videos: [
      "https://www.youtube.com/embed/6ko7_Wo-MSY",
      "https://www.youtube.com/embed/lxxpDF45TPA",
      "https://www.youtube.com/embed/clwt7iXF1Mg",
    ],
  },

  Angry: {
    messages: [
      "Take a deep breath, you are a champion and can overcome anything! 🧘‍♂️",
      "Anger is natural, but try to calm yourself down a little bit. 🌿",
      "Breathe slowly and take your time before you react. 💙",
      "You are stronger than this moment of anger, try to relax. ✨",
      "Everything will be resolved, just stay calm and think peacefully. 😌",
    ],
    color: "text-red-700 bg-white",
    emoji: "😠",
    videos: [
      "https://www.youtube.com/embed/_dTG7ofQCQs",
      "https://www.youtube.com/embed/Sh1mXNZRHXg",
      "https://www.youtube.com/embed/ce_h87keUz4",
    ],
  },

  Calm: {
    title: "Calm: Your mood today",
    messages: [
      "Take a deep breath and smile, your day will be calm and comfortable. 😌",
      "You are doing great, stay calm and enjoy your day. 🌿",
      "Calmness begins from within you, preserve your peace. 💙",
      "Everything is fine, stay relaxed and reassured. 🌸",
      "A calm heart creates a beautiful day. ✨",
    ],
    color: "text-blue-600 bg-white",
    emoji: "😌",
  },

  Excited: {
    messages: [
      "Your excitement is amazing! Let's start a new adventure today! 🚀",
      "Such great energy! Keep up this excitement! 🤩🔥",
      "Your enthusiasm will make you reach any goal! ✨",
      "Your day is full of positive energy, make the best of it! ⚡",
      "Wonderful! Keep enjoying every moment! 🎉",
    ],
    color: "text-orange-700 bg-white",
    emoji: "🤩",
  },

  Focused: {
    messages: [
      "Your focus is the secret to your success, well done! 🎯",
      "Keep focusing, you are getting better every day! 🚀",
      "Your mind is powerful when you focus on your goal. 💡",
      "Focus makes you reach your dreams faster! 🧠✨",
      "Awesome! Keep avoiding any distractions! 👏",
    ],
    color: "text-purple-700 bg-white",
    emoji: "🎯",
  },

  Kind: {
    messages: [
      "Your kindness makes the world more beautiful, always be kind! 😁",
      "Kindness is a superpower that makes everyone love you! 💖",
      "Keep spreading smiles and respect! 🌸",
      "Your kind actions impact everyone around you beautifully! ✨",
      "Always be a source of goodness and happiness for others! 🌈",
    ],
    color: "text-pink-700 bg-white",
    emoji: "😁",
  },
};

const scanColors = ["#147c00", "#E5E7EB"];
const timeColors = ["#147c00", "#f6416c", "#E5E7EB"];

/* ==================== MAIN COMPONENT ==================== */

export default function Dashboard() {
  const { user, userData, loading, updateUserData } = useAuth();
  const router = useRouter();

  const progress = {
    scansCount: userData?.progress?.scansCount || 0,
    lessonsCompleted: userData?.progress?.lessonsCompleted || [],
    quizScores: userData?.progress?.quizScores || {},

    gamesProgress: {
      puzzle: userData?.progress?.gamesProgress?.puzzle || 0,
      memory: userData?.progress?.gamesProgress?.memory || 0,
      matching: userData?.progress?.gamesProgress?.matching || 0,
    },

    treeLevel: userData?.progress?.treeLevel || 1,

    weeklyProgress:
      userData?.progress?.weeklyProgress || [0, 0, 0, 0, 0, 0, 0],
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showMoodBanner, setShowMoodBanner] = useState(true);
  const [showMoodVideo, setShowMoodVideo] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Check and update daily login sunshine progress
  useEffect(() => {
    if (userData && !loading) {
      const todayStr = new Date().toDateString(); // e.g., "Wed May 20 2026"
      const lastLoginDate = userData.progress?.lastLoginDate;

      if (lastLoginDate !== todayStr) {
        const currentProgress = userData.progress || {
          scansCount: 0,
          lessonsCompleted: [],
          quizScores: {},
          gamesProgress: { puzzle: 0, memory: 0, matching: 0 },
          treeLevel: 1,
          weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
          xp: 0,
          sunCount: 0,
          lastLoginDate: ""
        };

        const newSunCount = (currentProgress.sunCount || 0) + 1;
        let finalSunCount = newSunCount;
        let newXp = currentProgress.xp || 0;
        let newTreeLevel = currentProgress.treeLevel || 1;
        let earnedBonus = false;

        if (newSunCount >= 5) {
          finalSunCount = 0; // reset
          newXp += 50; // award 50 XP bonus
          newTreeLevel = Math.min(5, Math.floor(newXp / 100) + 1);
          earnedBonus = true;
        }

        updateUserData({
          progress: {
            ...currentProgress,
            sunCount: finalSunCount,
            xp: newXp,
            treeLevel: newTreeLevel,
            lastLoginDate: todayStr
          }
        }).then(() => {
          if (earnedBonus) {
            toast.success("🎉 Amazing! You logged in for 5 days and earned a +50 XP bonus! ☀");
          } else {
            toast.success(`☀ New active day! Sunshine progress: ${newSunCount}/5`);
          }
        }).catch(err => console.error("Failed to update daily login:", err));
      }
    }
  }, [userData, loading]);

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!user) return null;

  const childName = userData?.childName || "Adam";
  const userEmail = user?.email || "";
  const mood = userData?.mood || "Calm";

  return (
    <div
      className="w-full min-h-screen flex relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/sCreen/growth.png')" }}
    >
      <div className="relative z-10 flex w-full h-screen">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto h-full">
          {/* Navbar */}

          <div className="flex justify-end items-center gap-4 mb-6 backdrop-blur-md p-4 rounded-xl shadow-sm relative z-[999]">
            <div className="mr-auto pl-2">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {userEmail}
              </span>
            </div>

            <Link
              href="/"
              className="hover:text-green-600 transition"
            >
              Home
            </Link>

            <IoNotificationsOutline className="text-2xl cursor-pointer" />

            <div className="relative">
              <IoSettingsOutline
                className="text-2xl cursor-pointer hover:rotate-90 transition"
                onClick={() => setOpenDropdown(!openDropdown)}
              />

              {openDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowEditPopup(true);
                      setOpenDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <IoPersonOutline />
                    Edit Profile
                  </button>

                  <button
                    onClick={() => setShowLogoutPopup(true)}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <IoLogOutOutline />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Image
              src={userData?.avatar || "/SCreen/cute.png"}
              width={45}
              height={45}
              alt="avatar"
              className="rounded-full border-2 border-green-400 object-cover h-[45px] w-[45px]"
            />
          </div>

          {/* Welcome */}
 
<div className="rounded-[40px]  flex flex-col md:flex-row items-center justify-between mb-2 relative overflow-hidden">

  {/* Text */}
  <div className="z-10 flex-1 text-left">
    <h2 className="text-3xl font-bold text-gray-800 mb-1">
      Welcome Back {childName}!
    </h2>

    <p className="text-gray-600 mb-6 font-medium">
      Let’s Grow Your Tree Today
    </p>

    <div className="w-full max-w-md bg-gray-200 h-3 rounded-full mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full w-[25%]" />
    </div>

    <div className="flex gap-4">
      <Link href="/lessons">
        <button className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-200/50 hover:scale-105 transition">
          Start Lesson
        </button>
      </Link>

      <Link href="/games">
        <button className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-100/50 hover:scale-105 transition">
          Play Game
        </button>
      </Link>
    </div>
  </div>

  {/* Character */}
  <div className="z-10 flex justify-center mr-[35%] md:ml-[-40px] flex-shrink-0">
    <Image
      src="/SCreen/Group 45.png"
      width={220}
      height={220}
      alt="character"
      className="hidden md:block drop-shadow-2xl animate-pulse-slow"
    />
  </div>

</div>





          {/* Mood Banner */}

          {showMoodBanner && userData?.mood && (
            <div className="mb-6 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-orange-50 p-2 rounded-2xl">
                  {moodContent[mood]?.emoji || "😌"}
                </span>

                <div className="text-left">
                  <h4 className="font-bold text-blue-600">
                    {moodContent[mood]?.title ||
                      `Today's Mood: ${mood}`}
                  </h4>

                  <p className="text-gray-600 text-sm font-medium">
                    {
                      moodContent[mood]?.messages?.[
                        Math.floor(
                          Math.random() *
                            moodContent[mood].messages.length
                        )
                      ]
                    }
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMoodBanner(false)}
                className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-full transition"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
          )}

          {/* Mood Video */}

          {showMoodVideo &&
            (mood === "Sad" || mood === "Angry") &&
            moodContent[mood]?.videos && (
              <div className="mb-8 bg-white p-6 rounded-[40px] shadow-lg border-2 border-orange-100 relative">
                <button
                  onClick={() => setShowMoodVideo(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-full transition z-10"
                >
                  <IoCloseOutline size={24} />
                </button>

                <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2 text-left">
                  <span>🎥</span>
                  A special video to boost your mood!
                </h3>

                <div className="aspect-video w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
                  <iframe
                    src={moodContent[mood].videos[0]}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

          {/* TOP 3 CARDS */}

      
 
{/* TOP 3 CARDS */}

<div className="bg-white/90 backdrop-blur-md rounded-[45px] p-6 shadow-lg border border-gray-100 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

    {/* ================= My Tree ================= */}

    <div className="bg-white rounded-[40px] p-1 shadow-md h-[320px] flex flex-col items-center justify-between border border-gray-100 overflow-hidden relative">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/sCreen/growth.png')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full w-full">

        {/* Title */}
        <h3 className="font-bold text-2xl text-gray-800 mt-1">
          My Tree
        </h3>

        {/* Tree */}
        <div className="flex-1 flex items-center justify-center">
          <Image
            src={`/tree/growth${Math.min(
              5,
              Math.max(1, progress.treeLevel)
            )}.png`}
            width={150}
            height={150}
            alt="tree"
            className="drop-shadow-lg"
          />
        </div>

        {/* Level */}
        <div className="mb-2">
          <div className="px-8 py-2 rounded-full bg-green-200/70 backdrop-blur-md border-4 border-green-700 text-green-800 font-bold text-2xl shadow-lg">
            Level {progress.treeLevel}
          </div>
        </div>

      </div>
    </div>

    {/* ================= Quick Actions ================= */}

    <div className="bg-white rounded-[40px] p-6 shadow-md h-[320px] flex flex-col justify-center border border-gray-100">

      <h3 className="font-bold mb-8 text-center text-2xl text-gray-800">
        Quick Actions
      </h3>

      <div className="flex gap-4 justify-center items-center">

        {/* Lesson */}
        <Link href="/lessons" className="w-[160px]">
          <div className="h-[150px] bg-[#FFF2CC] rounded-3xl flex flex-col items-center justify-center shadow-sm hover:scale-[1.03] transition">

            <div className="w-14 h-14 bg-[#00C9C9] rounded-full flex items-center justify-center mb-4">
              ▶
            </div>

            <p className="text-[#00A6B2] font-semibold text-base whitespace-nowrap">
              Start Lesson
            </p>

          </div>
        </Link>

        {/* Scan */}
        <Link href="/ai-scan" className="w-[160px]">
          <div className="h-[150px] bg-[#FFF2CC] rounded-3xl flex flex-col items-center justify-center shadow-sm hover:scale-[1.03] transition">

            <div className="w-14 h-14 bg-[#00C9C9] rounded-full flex items-center justify-center mb-4">
              📸
            </div>

            <p className="text-[#00A6B2] font-semibold text-base whitespace-nowrap">
              Scan Plant
            </p>

          </div>
        </Link>

      </div>
    </div>

    {/* ================= Games Progress ================= */}

    <div className="bg-white rounded-[40px] p-6 shadow-md h-[320px] border border-gray-100 flex flex-col justify-between">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <h3 className="text-2xl font-bold text-gray-800">
          Games Progress
        </h3>

        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-l-[10px] border-l-cyan-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
        </div>

      </div>

      {/* Progress */}
      <div className="space-y-6">

        {/* Puzzle */}
        <div>

          <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
            <span>Puzzle</span>
            <span>{progress.gamesProgress.puzzle}%</span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{
                width: `${progress.gamesProgress.puzzle}%`,
              }}
            />
          </div>

        </div>

        {/* Memory */}
        <div>

          <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
            <span>Memory</span>
            <span>{progress.gamesProgress.memory}%</span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{
                width: `${progress.gamesProgress.memory}%`,
              }}
            />
          </div>

        </div>

        {/* Matching */}
        <div>

          <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
            <span>Matching</span>
            <span>{progress.gamesProgress.matching}%</span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{
                width: `${progress.gamesProgress.matching}%`,
              }}
            />
          </div>

        </div>

      </div>
    </div>

  </div>
</div>
          {/* BOTTOM 3 */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 items-stretch text-left">
            <ContinueLearning />

            <TodaysActivity
              scanData={[
                { name: "done", value: progress.scansCount },
                { name: "left", value: Math.max(0, 10 - progress.scansCount) },
              ]}
              scanColors={scanColors}
              timeData={[
                { name: "L", value: Math.min(progress.lessonsCompleted.length * 10, 60) },
                { name: "G", value: Math.min(Math.round((progress.gamesProgress.puzzle + progress.gamesProgress.memory + progress.gamesProgress.matching) / 15), 40) },
              ]}
              timeColors={timeColors}
              lessonCount={progress.lessonsCompleted.length}
              gameAvg={Math.round((progress.gamesProgress.puzzle + progress.gamesProgress.memory + progress.gamesProgress.matching) / 3)}
            />

            <TrophiesSection
              completedCount={
                progress.lessonsCompleted.length
              }
            />
          </div>
        </main>
 </div> 

      {/* Edit Popup */}

      {showEditPopup && (
        <EditProfilePopup
          userData={userData}
          updateUserData={updateUserData}
          onClose={() => setShowEditPopup(false)}
        />
      )}

      {/* Logout Popup */}

      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-[90%] max-w-[480px] text-center relative">
            <div className="flex justify-center mb-4">
              <Image
                src="/SCreen/Group 45.png"
                width={120}
                height={120}
                alt="character"
                className="animate-bounce"
              />
            </div>

            <h2 className="text-3xl font-bold text-green-700 mb-3">
              Logout?
            </h2>

            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={async () => {
                  await signOut(auth);
                  router.push("/login");
                }}
                className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-200 px-8 py-3 rounded-xl font-bold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== COMPONENTS ==================== */

function EditProfilePopup({
  onClose,
  userData,
  updateUserData,
}: any) {
  const [selectedAvatar, setSelectedAvatar] = useState(
    userData?.avatar || "/SCreen/cute.png"
  );

  const [childName, setChildName] = useState(
    userData?.childName || "Adam"
  );

  const [isSaving, setIsSaving] = useState(false);

  const avatars = [
    "/SCreen/boy-avatar.png",
    "/SCreen/girl-avatar.png",
    "/SCreen/cute.png",
    "/SCreen/child.png",
  ];

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await updateUserData({
        childName,
        avatar: selectedAvatar,
      });

      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-3xl shadow-2xl w-[400px] p-6 relative text-left">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Edit Profile
        </h2>

        <div className="flex justify-center mb-4">
          <Image
            src={selectedAvatar}
            width={90}
            height={90}
            alt="profile"
            className="rounded-full border-2 border-green-500 object-cover h-[90px] w-[90px]"
          />
        </div>

        <label className="font-semibold mb-1 block">
          Your Name
        </label>

        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="font-semibold mb-2 block">
          Pick Avatar
        </label>

        <div className="flex justify-between mb-6">
          {avatars.map((src, i) => (
            <Image
              key={i}
              src={src}
              width={60}
              height={60}
              alt="avatar"
              className={`rounded-full cursor-pointer border-2 h-[60px] w-[60px] object-cover ${
                selectedAvatar === src
                  ? "border-green-500"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedAvatar(src)}
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}


function ContinueLearning() {
  return (
    <div className="rounded-[45px] p-5 shadow-md h-[320px] bg-[#F5F5F5] border border-gray-100 flex flex-col">

      {/* Title */}
      <h3 className="text-[28px] font-semibold text-gray-800 text-center mb-6">
        Continue Learning
      </h3>

      {/* Lesson Card */}
      <div className="flex items-center gap-4 justify-center mb-6">

        <Image
          src="/SCreen/boy-girl.png"
          width={140}
          height={140}
          alt="lesson"
          className="rounded-[24px] h-[120px] w-[140px] object-cover"
        />

        <div className="flex flex-col text-left">

          <span className="text-[22px] text-gray-600 leading-tight">
            Continue:
          </span>

          <span className="text-[18px] text-gray-500 leading-tight">
            Parts Of A Plant
          </span>

        </div>

      </div>

      {/* Button */}
      <Link href="/lessons" className="mt-auto">
        <button className="w-full text-[#39E75F] text-[28px] font-medium hover:scale-105 transition">
          Continue
        </button>
      </Link>

    </div>
  );
}


function TodaysActivity({
  scanData,
  scanColors,
  timeData,
  timeColors,
  lessonCount = 0,
  gameAvg = 0,
}: any) {
  return (
    <div className="rounded-[45px] p-5 shadow-md h-[320px] bg-[#F5F5F5] border border-gray-100 flex flex-col">

      {/* Title */}
      <h3 className="text-[28px] font-semibold text-gray-800 text-center mb-3">
        Today’s Activity
      </h3>

      {/* Charts */}
      <div className="flex justify-center gap-4">

        {/* Scan Chart */}
        <div className="relative">

          <PieChart width={140} height={140}>
            <Pie
              data={scanData}
              innerRadius={40}
              outerRadius={58}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              cornerRadius={10}
            >
              {scanData.map((_: any, i: number) => (
                <Cell key={i} fill={scanColors[i]} />
              ))}
            </Pie>
          </PieChart>

          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1 text-[16px] font-medium text-gray-700">
            {scanData[0]?.value || 0} {scanData[0]?.value === 1 ? "Time" : "Times"}
          </span>

        </div>

        {/* Time Chart */}
        <div className="relative">

          <PieChart width={140} height={140}>
            <Pie
              data={timeData}
              innerRadius={40}
              outerRadius={58}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              cornerRadius={10}
            >
              {timeData.map((_: any, i: number) => (
                <Cell key={i} fill={timeColors[i]} />
              ))}
            </Pie>
          </PieChart>

          {/* Labels */}
          <div className="absolute top-[12px] right-[0px] bg-green-200 px-2 py-1 rounded-xl text-[13px] text-gray-700">
            {Math.min(lessonCount * 10, 60)} Min
          </div>

          <div className="absolute bottom-[20px] right-[0px] bg-pink-200 px-2 py-1 rounded-xl text-[13px] text-gray-700">
            {gameAvg > 0 ? Math.max(5, Math.round(gameAvg / 5)) : 0} Min
          </div>

        </div>

      </div>

      {/* Legend */}
      <div className="mt-auto flex flex-col items-start gap-2 text-[14px] text-gray-700 font-medium w-fit mx-auto">

        <div className="flex items-center gap-3 w-full">
          <span className="w-4 h-4 bg-green-500 rounded-sm shrink-0" />
          <span>Scan 3 Plants</span>
        </div>

        <div className="flex items-center gap-3 w-full">
          <span className="w-4 h-4 bg-pink-400 rounded-sm shrink-0" />
          <span>Lesson</span>
        </div>

        <div className="flex items-center gap-3 w-full">
          <span className="w-4 h-4 bg-green-700 rounded-sm shrink-0" />
          <span>Games</span>
        </div>

      </div>

    </div>
  );
}



function TrophiesSection({ completedCount }: any) {
  const trophies = [
    {
      name: "STAR EXPLORER",
      desc: "Complete 5 Lessons",
      xp: "+50 XP",
      icon: "/sCreen/vector.png",
    },
    {
      name: "STEAK MASTER",
      desc: "7 Days In Row",
      xp: "+100 XP",
      icon: "/sCreen/fire.png",
    },
  ];

  return (
    <div className="bg-[#f5f5f5] rounded-[40px] p-5 shadow-md h-[320px] border border-gray-100 flex flex-col">
      
      {/* Title */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Your Trophies
        </h3>
        <span className="text-3xl">🏆</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {trophies.map((trophy, i) => (
          <div
            key={i}
            className="relative bg-white rounded-[24px] shadow-md p-3 flex flex-col items-center justify-center border border-gray-100"
          >
            {/* Check */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-bold text-xs">
              ✓
            </div>

            {/* Icon */}
            <Image
              src={trophy.icon}
              alt={trophy.name}
              width={55}
              height={55}
              className="object-contain mb-2"
            />

            {/* Name */}
            <h4 className="text-green-500 font-extrabold text-[11px] whitespace-nowrap">
              {trophy.name}
            </h4>

            {/* Desc */}
            <p className="text-green-500 text-[10px] whitespace-nowrap">
              {trophy.desc}
            </p>

            {/* XP */}
            <div className="mt-2 px-3 py-1 rounded-full border-2 border-green-500 text-green-500 font-bold text-[10px] bg-gray-100">
              {trophy.xp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

