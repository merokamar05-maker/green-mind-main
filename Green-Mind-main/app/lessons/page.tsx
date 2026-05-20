"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import NotificationBell from "@/components/NotificationBell";
import { Poppins } from "next/font/google";
import { useAuth } from "@/lib/AuthContext";
import Sidebar from "@/app/_components/Sidebar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});


export default function LessonsPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    router.push("/login");
  };

  const lessons = [
    {
      id: "video1",
      title: "Recycling Basics",
      level: "Level 1 - 2 Min",
      img: "https://img.youtube.com/vi/FpOWG4GDvx4/maxresdefault.jpg",
      button: "Start Lesson",
      video: "https://www.youtube.com/embed/FpOWG4GDvx4",
    },
    {
      id: "video2",
      title: "Waste Sorting",
      level: "Level 1 - 2 Min",
      img: "https://img.youtube.com/vi/V_1vpEEnXW0/maxresdefault.jpg",
      button: "Start Lesson",
      video: "https://www.youtube.com/embed/V_1vpEEnXW0",
    },
    {
      id: "video3",
      title: "Ocean Protection",
      level: "Level 1 - 2 Min",
      img: "https://img.youtube.com/vi/aLY46g18hWk/maxresdefault.jpg",
      button: "Start Lesson",
      video: "https://www.youtube.com/embed/aLY46g18hWk",
    },
    {
      id: "video4",
      title: "Parts of A Plant",
      level: "Level 2 - 4 Min",
      img: "https://img.youtube.com/vi/tNbTppAbEVc/maxresdefault.jpg",
      button: "Start Lesson",
      video: "https://www.youtube.com/embed/tNbTppAbEVc",
    },
    {
      id: "video5",
      title: "Plant Growth",
      level: "Level 2 - 4 Min",
      img: "https://img.youtube.com/vi/AltruHFIBAQ/maxresdefault.jpg",
      button: "Start Lesson",
      video: "https://www.youtube.com/embed/AltruHFIBAQ",
    },
    {
      id: "video6",
      title: "Save Our Earth",
      level: "Level 2 - 4 Min",
      img: "https://img.youtube.com/vi/xpAnLXc_bIU/maxresdefault.jpg",
      button: "Start Lesson",
      video: "https://www.youtube.com/embed/xpAnLXc_bIU",
    },
  ];

  if (loading) return null;

  return (
    <div
      className="w-full min-h-screen flex bg-cover bg-center relative"
      style={{ backgroundImage: "url('/SCreen/growth.png')" }}
    >


      <div className="relative z-10 flex w-full h-screen">
        <Sidebar />

        {/* Main */}
        <div className={`${poppins.className} flex-1 p-4 overflow-y-auto h-full`}>
          {/* Navbar */}
          <div className="flex justify-end items-center gap-4 mb-3 backdrop-blur-md p-4 rounded-xl shadow relative z-[999]">
            <Link href="/" className="hover:text-green-600 transition">
              Home
            </Link>

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

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-2 text-center">Lessons</h1>
          <div className="w-full h-[1px] bg-gray-300 mb-4"></div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lessons.map((item, i) => {
              return (
                <div key={i} className="bg-white rounded-2xl shadow p-2 hover:shadow-md transition">
                  <Image
                    src={item.img}
                    width={210}
                    height={150}
                    className="w-full h-[140px] object-cover rounded-2xl"
                    alt={item.title}
                  />

                  <div className="text-center mt-8">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.level}</p>

                    <Link
                      href={`/lesson-page?video=${encodeURIComponent(item.video)}&title=${encodeURIComponent(item.title)}&level=${encodeURIComponent(item.level)}`}
                      className="mt-3 px-5 py-2 rounded-2xl font-medium inline-block text-white text-[18px] bg-[#3EF772] hover:bg-green-500 transition"
                    >
                      {item.button}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-[90%] max-w-[480px] text-center relative">
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
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition font-medium text-lg"
              >
                Cancel
              </button>
            </div>
          </div>

          <style jsx global>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .animate-bounce-fast {
              animation: bounce 1s infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}