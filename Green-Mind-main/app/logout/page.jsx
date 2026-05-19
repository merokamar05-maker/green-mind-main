"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";

export default function LogoutPage() {
  const [showPopup, setShowPopup] = useState(true);

  const handleLogout = () => {
    // Perform actual logout logic
    // e.g. clear session data and redirect to login
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FFFB] flex flex-col justify-center items-center relative">
      {/* Soft background */}
      <div className="absolute inset-0 bg-[url('/SCreen/screen-home.jpg')] bg-cover bg-center brightness-75"></div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Popup modal */}
      {showPopup && (
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 w-[90%] max-w-[480px] text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/SCreen/Group 45.png"
              width={120}
              height={120}
              alt="green character"
              className="animate-bounce-fast"
            />
          </div>

          <h2 className="text-3xl font-bold text-green-700 mb-3">
            Are you sure you want to logout?
          </h2>
          <p className="text-gray-600 mb-8">
            You’ll be redirected to the login page.
          </p>

          <div className="flex justify-center gap-6">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition font-medium text-lg"
            >
              Yes, Logout
            </button>

            <button
              onClick={() => (window.location.href = "/child")}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition font-medium text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Green mascot bounce animation */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-fast {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
}
