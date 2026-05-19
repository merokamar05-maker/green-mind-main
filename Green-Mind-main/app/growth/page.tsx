"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/_components/Sidebar";
import Link from "next/link";
import {
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoLockClosed,
} from "react-icons/io5";
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

/* Tree level images */
const baseLevels = 5;
const levels = Array.from({ length: baseLevels * 2 }, (_, i) => {
  const index = Math.floor(i / 2);
  return {
    id: i,
    img: i === 0 ? "/tree/growth1.png" : `/tree/growth${index + 1}.png`,
    blur: i % 2 === 0,
  };
});

const MAX_WATER = 5;

export default function TreeGrowthPage() {
  const { user, userData, loading, updateUserData } = useAuth();
  const router = useRouter();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [waterAnimating, setWaterAnimating] = useState(false);

  /* ---------- Derived values ---------- */
  const treeLevel  = userData?.progress?.treeLevel  ?? 1;
  const waterCount = userData?.progress?.waterCount ?? 0;

  /**
   * A child can view any level up to (treeLevel * 2 - 1).
   * e.g. treeLevel=1 → can see index 0 and 1
   *       treeLevel=2 → can see index 0‥3
   */
  const unlockedUpTo = Math.min(treeLevel * 2 - 1, levels.length - 1);
  const isNextLocked = currentLevel >= unlockedUpTo;

  /* ---------- Navigation ---------- */
  const next = () => {
    if (currentLevel < levels.length - 1) {
      if (isNextLocked) {
        toast.info("🔒 Complete more lessons and scans to unlock the next level!");
        return;
      }
      setCurrentLevel((v) => v + 1);
    }
  };

  const prev = () => {
    if (currentLevel > 0) setCurrentLevel((v) => v - 1);
  };

  /* ---------- Water My Tree ---------- */
  const handleWater = async () => {
    if (!userData) return;

    if (waterCount >= MAX_WATER) {
      toast.info("💧 You've already fully watered your tree today! Come back tomorrow 🌿");
      return;
    }

    setWaterAnimating(true);
    setTimeout(() => setWaterAnimating(false), 800);

    const newWater = waterCount + 1;
    let newTreeLevel = treeLevel;
    let finalWater = newWater;

    if (newWater >= MAX_WATER) {
      newTreeLevel = treeLevel + 1;
      finalWater = 0;
      toast.success("🎉 Your tree leveled up! It grew to Level " + newTreeLevel + "!");
    } else {
      toast.success(`💧 Tree watered! ${newWater}/${MAX_WATER}`);
    }

    try {
      await updateUserData({
        progress: {
          ...userData.progress,
          waterCount: finalWater,
          treeLevel: newTreeLevel,
        },
      });
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
            <IoNotificationsOutline className="text-2xl text-white" />
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

          {/* Tree Area */}
          <div className="flex justify-center items-center mt-10 relative">

            {/* Prev preview */}
            {currentLevel > 0 && (
              <div className="absolute left-[18%] top-[70%] -translate-y-1/2">
                <div className="w-[160px] h-[160px] rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                  <Image src={levels[currentLevel - 1].img} width={110} height={110} alt="" />
                </div>
              </div>
            )}

            {/* Next preview */}
            {currentLevel < levels.length - 1 && (
              <div className="absolute right-[18%] top-[70%] -translate-y-1/2">
                <div className={`w-[160px] h-[160px] rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center ${isNextLocked ? "opacity-40" : ""}`}>
                  <Image src={levels[currentLevel + 1].img} width={110} height={110} alt="" />
                  {isNextLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      <IoLockClosed className="text-white text-3xl" />
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

              <div className="w-[320px] h-[320px] rounded-full backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <Image
                  src={levels[currentLevel].img}
                  width={190}
                  height={190}
                  alt="tree"
                  className={`transition-all duration-500 ${
                    currentLevel === 0
                      ? "animate-pulse"
                      : levels[currentLevel].blur
                      ? "blur-[1px] opacity-80"
                      : "blur-0 opacity-100"
                  }`}
                />
              </div>

              {/* Lock icon on blurred levels */}
              {levels[currentLevel].blur && (
                <div className="absolute top-[60px] right-[80px] bg-black/60 p-2 rounded-full">
                  <IoLockClosed className="text-white text-[30px]" />
                </div>
              )}
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
              className={`absolute right-[22%] top-1/2 -translate-y-1/2 p-2 rounded-full transition ${
                isNextLocked ? "opacity-40 hover:opacity-60" : "hover:opacity-80"
              }`}
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
              disabled={waterCount >= MAX_WATER}
              className={`w-full rounded-full px-3 py-2 text-center font-semibold transition active:scale-95 ${
                waterCount >= MAX_WATER
                  ? "bg-gray-300/50 text-gray-500 cursor-not-allowed"
                  : waterAnimating
                  ? "bg-blue-300/70 scale-95"
                  : "bg-white/40 text-[#3c3c3c] hover:bg-blue-100/60 cursor-pointer"
              }`}
            >
              {waterCount >= MAX_WATER ? "✅ Fully Watered!" : "💧 Water My Tree"}
            </button>

            {/* Level up hint */}
            {waterCount > 0 && waterCount < MAX_WATER && (
              <p className="text-[9px] text-center text-white/80 mt-1">
                {MAX_WATER - waterCount} more waters to level up! 🌱
              </p>
            )}
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