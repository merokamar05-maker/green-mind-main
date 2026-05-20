"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/app/_components/Sidebar";
import Link from "next/link";
import {
  IoSettingsOutline,
  IoLogOutOutline,
  IoLockClosed,
} from "react-icons/io5";
import NotificationBell from "@/components/NotificationBell";
import { Poppins } from "next/font/google";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

/* Simplified 5 plant growth levels */
const levels = [
  { id: 0, img: "/tree/growth1.png", name: "Level 1 - Seedling" },
  { id: 1, img: "/tree/growth2.png", name: "Level 2 - Sprout" },
  { id: 2, img: "/tree/growth3.png", name: "Level 3 - Sapling" },
  { id: 3, img: "/tree/growth4.png", name: "Level 4 - Young Tree" },
  { id: 4, img: "/tree/growth5.png", name: "Level 5 - Mature Tree" },
];

const MAX_WATER = 5;

export default function TreeGrowthPage() {
  const { user, userData, loading, updateUserData } = useAuth();
  const router = useRouter();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [waterAnimating, setWaterAnimating] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  /* ---------- Derived values ---------- */
  const treeLevel  = userData?.progress?.treeLevel  ?? 1;
  const waterCount = userData?.progress?.waterCount ?? 0;
  const xp         = userData?.progress?.xp         ?? 0;
  const lastWateredTime = userData?.progress?.lastWateredTime ?? 0;

  // Level is locked if its index is >= user's treeLevel
  const isCurrentLevelLocked = currentLevel >= treeLevel;
  const isPrevLocked = currentLevel - 1 >= treeLevel;
  const isNextLocked = currentLevel + 1 >= treeLevel;

  /* ---------- Cooldown Timer ---------- */
  useEffect(() => {
    const COOLDOWN_MS = 8 * 60 * 60 * 1000; // 8 hours
    const updateTimer = () => {
      const elapsed = Date.now() - lastWateredTime;
      if (elapsed < COOLDOWN_MS && lastWateredTime > 0) {
        setCooldownRemaining(COOLDOWN_MS - elapsed);
      } else {
        setCooldownRemaining(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastWateredTime]);

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  /* ---------- Navigation ---------- */
  const next = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((v) => v + 1);
    }
  };

  const prev = () => {
    if (currentLevel > 0) {
      setCurrentLevel((v) => v - 1);
    }
  };

  /* ---------- Water My Tree ---------- */
  const handleWater = async () => {
    if (!userData) return;

    if (cooldownRemaining > 0) {
      toast.info(`⏳ Please wait ${formatTime(cooldownRemaining)} before watering again!`);
      return;
    }

    setWaterAnimating(true);
    setTimeout(() => setWaterAnimating(false), 1200);

    const xpGained = 20;
    const newXp = xp + xpGained;
    const newTreeLevel = Math.min(5, Math.floor(newXp / 100) + 1);
    const isLevelUp = newTreeLevel > treeLevel;

    const newWater = waterCount + 1;
    const finalWater = newWater >= 5 ? 0 : newWater;

    try {
      await updateUserData({
        progress: {
          ...userData.progress,
          waterCount: finalWater,
          xp: newXp,
          treeLevel: newTreeLevel,
          lastWateredTime: Date.now(),
        },
      });

      if (isLevelUp) {
        toast.success(`🎉 Your tree leveled up! It grew to Level ${newTreeLevel}! 🌳`);
      } else {
        toast.success(`💧 Tree watered! You earned +20 XP!`);
      }
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  /* ---------- Logout ---------- */
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    router.push("/login");
  };

  if (loading) return null;

  const sunCount = userData?.progress?.sunCount ?? 0;

  return (
    <div className={`${poppins.className} flex w-full h-screen relative overflow-hidden`}>
      {/* Background */}
      <Image
        src="/sCreen/growth.png"
        fill
        alt="bg"
        className="object-cover brightness-90"
      />

      <div className="relative z-10 flex w-full h-screen">
        <Sidebar />

        {/* Main */}
        <div className="flex-1 relative">

          {/* Navbar */}
          <div className="absolute top-5 right-10 flex gap-4 items-center z-50">
            <NotificationBell className="text-white" />
            <div className="relative">
              <IoSettingsOutline
                className="text-2xl text-white cursor-pointer"
                onClick={() => setOpenDropdown(!openDropdown)}
              />
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg p-2 z-50">
                  <button
                    onClick={() => setShowLogoutPopup(true)}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <IoLogOutOutline /> Logout
                  </button>
                </div>
              )}
            </div>
            <Image
              src={userData?.avatar || "/SCreen/cute.png"}
              width={40}
              height={40}
              alt="avatar"
              className="rounded-full border-2 border-green-400 object-cover h-[40px] w-[40px]"
            />
          </div>

          {/* Title */}
          <h1 className="text-center mt-6 text-xl font-semibold text-[#666666]">
            Tree Growth — Level {treeLevel}
          </h1>

          {/* XP Progress Bar on the Left */}
          <div className="absolute left-8 top-1/3 -translate-y-1/2 flex flex-col items-center gap-3 z-40 select-none">
            {/* Top Leaf/Star icon */}
            <div className="w-10 h-10 bg-gradient-to-tr from-[#3EF772] to-[#34c759] rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-xl">⭐</span>
            </div>

            {/* Bar Container */}
            <div className="relative w-8 h-[280px] bg-white/30 backdrop-blur-md rounded-full border border-white/40 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),_0_4px_12px_rgba(0,0,0,0.1)] flex flex-col justify-end">
              <div
                className="w-full bg-gradient-to-t from-emerald-400 via-green-400 to-[#3EF772] rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
                style={{ height: `${xp % 100}%` }}
              />

              {/* Progress markers inside */}
              <div className="absolute inset-0 flex flex-col justify-between py-6 text-[9px] text-green-950 font-black items-center pointer-events-none opacity-85">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
            </div>

            {/* XP and Level Info */}
            <div className="text-center drop-shadow-md">
              <span className="block text-[10px] text-green-900 font-bold uppercase tracking-wider bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-sm">Level XP</span>
              <span className="block text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1">{xp % 100} / 100</span>
              <span className="block text-[11px] text-green-900 font-bold mt-1 bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-sm">Total: {xp} XP</span>
            </div>
          </div>

          {/* Tree Area */}
          <div className="flex justify-center items-center mt-10 relative">

            {/* Prev preview */}
            {currentLevel > 0 && (
              <div className="absolute left-[18%] top-[70%] -translate-y-1/2">
                <div className={`w-[160px] h-[160px] rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden ${isPrevLocked ? "opacity-60" : ""}`}>
                  <Image src={levels[currentLevel - 1].img} width={110} height={110} alt="" className={isPrevLocked ? "blur-[2px]" : ""} />
                  {isPrevLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 rounded-full">
                      <IoLockClosed className="text-white text-2xl" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next preview */}
            {currentLevel < levels.length - 1 && (
              <div className="absolute right-[18%] top-[70%] -translate-y-1/2">
                <div className={`w-[160px] h-[160px] rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden ${isNextLocked ? "opacity-60" : ""}`}>
                  <Image src={levels[currentLevel + 1].img} width={110} height={110} alt="" className={isNextLocked ? "blur-[2px]" : ""} />
                  {isNextLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 rounded-full">
                      <IoLockClosed className="text-white text-2xl" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main Circle */}
            <div className="w-[420px] h-[420px] rounded-full flex items-center justify-center relative">
              {/* Frame */}
              <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 z-30">
                <Image
                  src="/sCreen/frame.png"
                  width={480}
                  height={240}
                  alt="frame"
                  quality={100}
                  className="brightness-110 contrast-110"
                  priority
                />
              </div>

              <div className="absolute w-full h-full blur-[1px] rounded-full" />

              <div className="w-[320px] h-[320px] rounded-full backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.4)] relative overflow-hidden">
                <Image
                  src={levels[currentLevel].img}
                  width={190}
                  height={190}
                  alt="tree"
                  className={`transition-all duration-500 ${
                    currentLevel === 0 && currentLevel < treeLevel
                      ? "animate-pulse"
                      : isCurrentLevelLocked
                      ? "blur-[6px] opacity-60 scale-95"
                      : "blur-0 opacity-100"
                  } ${waterAnimating ? "animate-bounce scale-110" : ""}`}
                />

                {/* Watering Splash Effect */}
                {waterAnimating && (
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center animate-fade-in pointer-events-none rounded-full">
                    <span className="text-6xl animate-bounce">💧</span>
                  </div>
                )}

                {/* Lock icon overlay inside the circle */}
                {isCurrentLevelLocked && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300">
                    <IoLockClosed className="text-white text-5xl mb-2 drop-shadow-md animate-pulse" />
                    <span className="text-white font-bold text-sm bg-green-700/80 border border-green-400 px-4 py-1.5 rounded-full shadow">
                      Unlocks at Level {currentLevel + 1}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrows */}
          {currentLevel > 0 && (
            <button
              onClick={prev}
              className="absolute left-[22%] top-1/2 -translate-y-1/2 p-2 rounded-full hover:opacity-80 transition"
            >
              <Image src="/sCreen/End.png" width={60} height={60} alt="prev" />
            </button>
          )}

          {currentLevel < levels.length - 1 && (
            <button
              onClick={next}
              className="absolute right-[22%] top-1/2 -translate-y-1/2 p-2 rounded-full transition hover:opacity-80"
            >
              <Image src="/sCreen/star1.png" width={60} height={60} alt="next" />
              {isNextLocked && (
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <IoLockClosed className="text-white text-[10px]" />
                </div>
              )}
            </button>
          )}

          {/* Care Activities */}
          <div className="absolute bottom-13 left-13 backdrop-blur-md p-4 rounded-2xl w-[500px] bg-white/20 border border-black/20 text-left">
            <h3 className="text-center mb-3 text-black font-bold">Care Activities</h3>
            <div className="flex gap-3">
              {[1, 2].map((_, i) => (
                <div key={i} className="bg-white/30 p-4 rounded-xl w-full flex gap-3 items-center">
                  <Image src="/SCreen/boy-girl.png" width={90} height={90} alt="" />
                  <div>
                    <p className="text-xs font-semibold">Recycling basics</p>
                    <p className="text-[10px]">Level 1 – 2 Min</p>
                    <Link
                      href="/lessons"
                      className="inline-block bg-green-400 text-white text-[10px] px-3 py-1 rounded-full mt-2 hover:bg-green-500 transition"
                    >
                      Start Lesson
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tree Care Panel */}
          <div className="absolute bottom-4 right-[22%] bg-white/20 p-4 rounded-2xl w-[260px] border border-black/20 text-left">
            <h3 className="text-center mb-4 font-bold text-xl text-white">
              <span style={{ WebkitTextStroke: "1px #666666" }}>Tree Care</span>
            </h3>

            {/* Water progress */}
            <div className="bg-white/40 p-2 rounded-xl mb-3">
              <p className="font-semibold text-[#3c3c3c]">
                💧 water {waterCount}/{MAX_WATER}
              </p>
              <div className="bg-gray-200 h-2 rounded mt-1 overflow-hidden">
                <div
                  className="bg-blue-400 h-2 rounded transition-all duration-500"
                  style={{ width: `${(waterCount / MAX_WATER) * 100}%` }}
                />
              </div>
            </div>

            {/* Sun progress */}
            <div className="bg-white/40 p-2 rounded-xl mb-3">
              <p className="font-semibold text-[#3c3c3c]">
                ☀ sunshine {sunCount}/5
              </p>
              <div className="bg-gray-200 h-2 rounded mt-1 overflow-hidden">
                <div
                  className="bg-yellow-400 h-2 rounded transition-all duration-500"
                  style={{ width: `${(sunCount / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Water Button */}
            <button
              onClick={handleWater}
              disabled={cooldownRemaining > 0}
              className={`w-full rounded-full px-3 py-2.5 text-center font-semibold transition-all active:scale-95 text-sm ${
                cooldownRemaining > 0
                  ? "bg-gray-300/60 text-gray-500 cursor-not-allowed border border-gray-400/20"
                  : waterAnimating
                  ? "bg-blue-300/70 scale-95"
                  : "bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md cursor-pointer hover:scale-[1.02]"
              }`}
            >
              {cooldownRemaining > 0 ? (
                <span className="flex items-center justify-center gap-1">
                  ⏳ Cooldown: {formatTime(cooldownRemaining)}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  💧 Water My Tree (+20 XP)
                </span>
              )}
            </button>

            {/* Level up hint */}
            <p className="text-[10px] text-center text-white/95 mt-2 font-medium">
              🌱 Level up in {100 - (xp % 100)} XP!
            </p>
          </div>

        </div>
      </div>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-[90%] max-w-[480px] text-center relative">
            <div className="flex justify-center mb-4">
              <Image src="/SCreen/Group 45.png" width={120} height={120} alt="character" className="animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-green-700 mb-3">Are you sure you want to logout?</h2>
            <p className="text-gray-600 mb-8">You'll be redirected to the login page.</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition font-medium text-lg"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition font-medium text-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}