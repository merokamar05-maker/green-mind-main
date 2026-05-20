"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Lock, RefreshCw, LogOut } from "lucide-react";
import Image from "next/image";

export default function ChildLockManager() {
  const { user, userData, parentData, isLocked, lockedAt, unlockChild } = useAuth();
  const pathname = usePathname() || "";
  const router = useRouter();

  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const isChildRoute = (path: string) => {
    const childPaths = [
      "/dashboard",
      "/lessons",
      "/lesson-page",
      "/games",
      "/ai-scan",
      "/album",
      "/growth",
      "/quiz"
    ];
    return childPaths.some(p => path === p || path.startsWith(p + "/"));
  };

  const activeOnChildRoute = isChildRoute(pathname);

  // Countdown timer for 12 hours lock
  useEffect(() => {
    if (!isLocked || lockedAt <= 0) return;

    const updateCountdown = () => {
      const remainingMs = 12 * 60 * 60 * 1000 - (Date.now() - lockedAt);
      if (remainingMs <= 0) {
        setCountdown("0 seconds");
        return;
      }
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [isLocked, lockedAt]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter the child code first!");
      return;
    }

    setIsVerifying(true);

    const parentChildCode = String(parentData?.childCode || "").trim();
    const inputCode = code.trim();

    if (parentChildCode && inputCode === parentChildCode) {
      try {
        await unlockChild();
        setCode("");
        toast.success("Account successfully unlocked! Enjoy your time 🌳");
      } catch (err: any) {
        toast.error("An error occurred while trying to unlock.");
      }
    } else {
      toast.error("Incorrect child code! Please try again.");
    }
    setIsVerifying(false);
  };

  const handleSwitchUser = () => {
    router.push("/choose");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      toast.success("Logged out successfully.");
    } catch (err) {
      toast.error("Failed to logout.");
    }
  };

  // Render overlay only if child route is active and child profile is locked
  if (!user || !userData || !isLocked || !activeOnChildRoute) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Container card */}
      <div className="w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl p-8 border border-green-100 flex flex-col items-center relative overflow-hidden animate-fade-in">
        {/* Background gradient decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-200/30 rounded-full blur-3xl" />

        {/* Lock header illustration */}
        <div className="relative mb-6 flex justify-center items-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
            <Lock className="w-12 h-12 text-green-600 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-2 border-2 border-white shadow-lg animate-bounce">
            🌳
          </div>
        </div>

        {/* Warning Messages */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
          Daily Screen Time Limit Reached! ⏳
        </h2>
        
        <p className="text-gray-600 text-[15px] font-medium text-center leading-relaxed mb-6">
          Hi {userData.childName}, you have completed your <strong>1 hour</strong> of learning time today.
          To protect your eyes and health, please take a break and step away from the screen.
        </p>

        {/* Code Form for parent/unlock */}
        <form onSubmit={handleUnlock} className="w-full bg-green-50/60 rounded-3xl p-5 border border-green-100 mb-6 flex flex-col gap-4">
          <label className="text-sm font-bold text-green-800 text-left block">
            🔑 Enter Child Code to unlock:
          </label>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter child code"
              className="flex-1 bg-white border-2 border-green-100 rounded-2xl px-4 py-3 text-center text-lg font-bold outline-none focus:border-green-500 transition-all shadow-sm"
              disabled={isVerifying}
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Unlock 🔓"}
            </button>
          </div>
        </form>

        {/* Countdown */}
        <div className="w-full text-center py-4 bg-gray-50 border border-gray-100 rounded-3xl mb-6">
          <p className="text-xs text-gray-400 font-semibold mb-1">
            ⏱️ Or wait for auto-unlock in:
          </p>
          <p className="text-base font-bold text-gray-700 font-mono tracking-wide">
            {countdown || "Calculating..."}
          </p>
        </div>

        {/* Action Buttons to Switch User or Logout */}
        <div className="flex gap-4 w-full mt-2">
          <button
            onClick={handleSwitchUser}
            className="flex-1 border-2 border-gray-200 hover:border-green-400 text-gray-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-50/30 active:scale-95 transition-all cursor-pointer text-sm"
          >
            <RefreshCw className="w-4 h-4 text-green-600" />
            Switch Account
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 border-2 border-red-100 hover:border-red-400 hover:bg-red-50/30 text-red-600 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
