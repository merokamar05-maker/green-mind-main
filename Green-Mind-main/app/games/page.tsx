"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import NotificationBell from "@/components/NotificationBell";
import Sidebar from "@/app/_components/Sidebar";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

/* ─── Lock messages per game ─── */
const LOCK_MESSAGES: Record<string, string> = {
  puzzle:
    "🔒 This game is locked!\nComplete Quiz 1 first to unlock the Puzzle game.",
  memory:
    "🔒 This game is locked!\nComplete Quiz 2 first to unlock the Memory Card game.",
  farm:
    "🔒 This game is locked!\nComplete Quiz 3 first to unlock the Sundew Valley game.",
};

/* ─── Which quiz unlocks which game ─── */
const UNLOCK_QUIZ: Record<string, string> = {
  puzzle: "video1",
  memory: "video2",
  farm:   "video3",
};

export default function GamesPage() {
  const { user, userData, loading, activeChildIndex } = useAuth();
  const router = useRouter();

  const [openDropdown, setOpenDropdown]     = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activeGame, setActiveGame]         = useState<string | null>(null);
  const [lockedAlert, setLockedAlert]       = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "closeGame") setActiveGame(null);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    router.push("/login");
  };

  const games = [
    {
      id: "puzzle",
      title: "Puzzle",
      icon: "/SCreen/puzzel.png",
      url: "/puzzle-game-main/start2.html",
      color: "bg-[#00AEEF]",
    },
    {
      id: "memory",
      title: "Memory",
      icon: "/SCreen/tree-memory.png",
      icon2: "/SCreen/tree-me2.png",
      url: "/othergames/start.html",
      color: "bg-[#FF6F6F]",
    },
    {
      id: "farm",
      title: "Sundew Valley",
      icon: "/SCreen/farm-ge.png",
      url: "/SundewValley-master-main/index.html",
      color: "bg-[#57D93F]",
      isWide: true,
    },
  ];

  /* ─── Determines whether a game is locked for the current child ─── */
  const isGameLocked = (gameId: string): boolean => {
    // Only lock for child accounts 2 & 3 (index 1 & 2)
    if (activeChildIndex !== 1 && activeChildIndex !== 2) return false;
    const requiredQuiz = UNLOCK_QUIZ[gameId];
    if (!requiredQuiz) return false;
    const completed = userData?.progress?.lessonsCompleted ?? [];
    return !completed.includes(requiredQuiz);
  };

  /* ─── Handle click on a game card ─── */
  const handleGameClick = (game: typeof games[0]) => {
    if (isGameLocked(game.id)) {
      setLockedAlert(LOCK_MESSAGES[game.id]);
    } else {
      setActiveGame(game.url);
    }
  };

  if (loading) return null;

  return (
    <div
      className="w-full min-h-screen flex bg-cover bg-center relative"
      style={{ backgroundImage: "url('/SCreen/back-gam.png')" }}
    >
      <div className="absolute inset-0 bg-white/30 z-0" />
      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        {!activeGame && <Sidebar />}

        <div className={`flex-1 flex flex-col h-full relative transition-all duration-500 ${activeGame ? "p-0" : ""}`}>

          {!activeGame && (
            <div className="p-6 pb-0">
              <div className="flex justify-end items-center gap-6 p-6 backdrop-blur-md rounded-xl shadow border border-white/20 relative z-[999]">
                <NotificationBell />
                <div className="relative">
                  <IoSettingsOutline
                    className="text-2xl cursor-pointer hover:rotate-90 transition"
                    onClick={() => setOpenDropdown(!openDropdown)}
                  />
                  {openDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl border border-gray-100 py-2 z-50">
                      <button
                        onClick={() => setShowLogoutPopup(true)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <IoLogOutOutline /> Logout
                      </button>
                    </div>
                  )}
                </div>
                <Image
                  src={userData?.avatar || "/SCreen/cute.png"}
                  width={45} height={45} alt="avatar"
                  className="rounded-full border-2 border-green-400 object-cover h-[45px] w-[45px]"
                />
              </div>
            </div>
          )}

          <div className={`flex-1 overflow-y-auto scrollbar-hide ${activeGame ? "h-screen w-screen" : "p-6"}`}>
            {activeGame ? (
              <div className="w-full h-full bg-white relative animate-in fade-in zoom-in duration-500">
                <iframe
                  src={activeGame}
                  className="w-full h-full border-none"
                  title="Game View"
                />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-center mb-3">Games</h1>
                <div className="bg-[#7a4a00] text-white text-center py-3 px-6 rounded-2xl mb-6 text-base font-bold max-w-2xl mx-auto shadow-lg">
                  choose A Fun Eco-Friendly Games And Earn XP 🌱
                </div>

                <div className="flex flex-col items-center gap-5">
                  {/* ── Row: Puzzle + Memory ── */}
                  <div className="flex flex-wrap justify-center gap-6">
                    {games.filter(g => !g.isWide).map(game => {
                      const locked = isGameLocked(game.id);
                      return (
                        <div
                          key={game.id}
                          onClick={() => handleGameClick(game)}
                          className={`relative ${game.color} w-[360px] h-[260px] rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 mt-2 transition cursor-pointer group
                            ${locked ? "opacity-70 saturate-50" : "hover:scale-105"}`}
                        >
                          {/* lock overlay */}
                          {locked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-3xl z-10 gap-3">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
                                <span className="text-4xl">🔒</span>
                              </div>
                              <span className="text-white font-extrabold text-sm text-center px-4 leading-tight drop-shadow">
                                Complete a quiz to unlock!
                              </span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Image
                              src={game.icon}
                              width={game.icon2 ? 140 : 220}
                              height={game.icon2 ? 60 : 100}
                              alt={game.title}
                              className="object-contain group-hover:rotate-3 transition"
                            />
                            {game.icon2 && (
                              <Image
                                src={game.icon2}
                                width={140} height={60}
                                alt={game.title}
                                className="object-contain group-hover:-rotate-3 transition"
                              />
                            )}
                          </div>
                          <span className="text-white text-xl font-bold">{game.title}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Row: Sundew Valley (wide) ── */}
                  {games.filter(g => g.isWide).map(game => {
                    const locked = isGameLocked(game.id);
                    return (
                      <div
                        key={game.id}
                        onClick={() => handleGameClick(game)}
                        className={`relative ${game.color} w-[744px] h-[200px] rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 transition cursor-pointer group
                          ${locked ? "opacity-70 saturate-50" : "hover:scale-105"}`}
                      >
                        {/* lock overlay */}
                        {locked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-3xl z-10 gap-3">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
                              <span className="text-4xl">🔒</span>
                            </div>
                            <span className="text-white font-extrabold text-sm text-center px-4 leading-tight drop-shadow">
                              Complete Quiz 3 to unlock Sundew Valley!
                            </span>
                          </div>
                        )}
                        <Image
                          src={game.icon}
                          width={180} height={90}
                          alt={game.title}
                          className="object-contain group-hover:scale-110 transition"
                        />
                        <span className="text-white text-2xl font-bold tracking-wide">{game.title}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Locked Game Alert Modal ── */}
      {lockedAlert && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[36px] shadow-2xl p-8 w-full max-w-[420px] flex flex-col items-center gap-5 relative border border-gray-100">
            {/* Decorative glow */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl" />

            {/* Lock icon */}
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center shadow-inner border-2 border-amber-100">
              <span className="text-5xl">🔒</span>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-800 text-center">
              Game Locked!
            </h2>

            {/* Message lines */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 w-full text-center">
              {lockedAlert.split("\n").filter(l => l.trim()).slice(1).map((line, i) => (
                <p key={i} className="text-gray-700 font-semibold text-[15px] leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            <button
              onClick={() => setLockedAlert(null)}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold py-3.5 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-lg"
            >
              OK, Got it! 👍
            </button>
          </div>
        </div>
      )}

      {/* ── Logout Popup ── */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-[90%] max-w-[480px] text-center relative">
            <div className="flex justify-center mb-4">
              <Image src="/SCreen/Group 45.png" width={120} height={120} alt="green character" className="animate-bounce-custom" />
            </div>
            <h2 className="text-3xl font-bold text-green-700 mb-3">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-6 mt-8">
              <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition font-medium text-lg shadow-lg">Yes, Logout</button>
              <button onClick={() => setShowLogoutPopup(false)} className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition font-medium text-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-custom { animation: bounce 1s infinite; }
      `}</style>
    </div>
  );
}
