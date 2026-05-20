"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { IoNotificationsOutline } from "react-icons/io5";
import { Clock, Play, AlertCircle } from "lucide-react";

export default function NotificationBell({ className = "" }: { className?: string }) {
  const { userData, usageTime, sessionStartTime, isLocked } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format timestamp (ms) to HH:MM AM/PM
  const formatTime = (ts: number | null) => {
    if (!ts) return "N/A";
    const date = new Date(ts);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' -> '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  // Compute remaining seconds and expected lock time
  const remainingSeconds = Math.max(0, 3600 - usageTime);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  const expectedLockTimeMs = sessionStartTime ? sessionStartTime + (3600 * 1000) : null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer ${className}`}
      >
        <IoNotificationsOutline className="text-2xl" />
        
        {/* Pulsing indicator badge */}
        {userData && !isLocked && (
          <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border border-white"></span>
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-green-50/80 z-[9999] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-4 text-white">
            <h3 className="font-bold text-base flex items-center gap-2">
              <span>🔔 Daily Screen Time Info</span>
            </h3>
            <p className="text-[11px] text-green-100 mt-1">
              Live tracking for your health & wellness 🌳
            </p>
          </div>

          {/* Body Content */}
          <div className="p-4 flex flex-col gap-3">
            {userData ? (
              <>
                {/* Active Child Profile */}
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-green-200">
                    <img 
                      src={userData.avatar || "/SCreen/cute.png"} 
                      alt="avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Active Profile</p>
                    <p className="text-sm font-bold text-gray-800">{userData.childName}</p>
                  </div>
                </div>

                {/* Lock Status */}
                {isLocked ? (
                  <div className="flex items-center gap-2.5 p-3 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-bold leading-relaxed">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span>This profile is locked for exceeding the daily 1-hour screen limit!</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 mt-1">
                    {/* Start Time Row */}
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Play className="w-4 h-4 text-green-500" />
                        <span>Session Start Time:</span>
                      </div>
                      <span className="font-bold text-gray-800">
                        {formatTime(sessionStartTime)}
                      </span>
                    </div>

                    {/* Remaining Time Row */}
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
                        <span>Remaining Time:</span>
                      </div>
                      <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs">
                        {minutes}m {seconds}s
                      </span>
                    </div>

                    {/* Expected Lock Time Row */}
                    <div className="flex items-center justify-between text-xs py-1.5">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Expected Lock Time:</span>
                      </div>
                      <span className="font-bold text-red-600">
                        {formatTime(expectedLockTimeMs)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs font-medium">
                Please select a child profile to view details
              </div>
            )}
          </div>

          {/* Footer Banner */}
          <div className="bg-green-50/50 border-t border-gray-100 px-4 py-3 text-[11px] text-green-700 text-center font-medium leading-relaxed">
            🌿 We schedule breaks after 1 hour of playtime to keep your eyes healthy!
          </div>
        </div>
      )}
    </div>
  );
}
