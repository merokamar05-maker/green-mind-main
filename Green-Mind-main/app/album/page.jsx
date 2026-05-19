"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoNotificationsOutline,
  IoSettingsOutline,
  IoSearch,
  IoLogOutOutline,
} from "react-icons/io5";
import Sidebar from "@/app/_components/Sidebar";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AlbumPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  /* ================= States ================= */
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [album, setAlbum] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [search, setSearch] = useState("");

  /* ================= Load Album ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("album")) || [];
    setAlbum(saved);
  }, []);

  /* ================= Logout ================= */
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    router.push("/login");
  };

  /* ================= Filter ================= */
  const filteredAlbum = album.filter((item) =>
    item?.result?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return null;

  return (
    <div
      className="w-full min-h-screen flex bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/SCreen/growth.png')" }}
    >
      
     <div className="relative z-10 flex w-full h-screen">
        <Sidebar /> 

        {/* ================= Main ================= */}
        <div className="flex-1 p-6 overflow-y-auto h-screen">

          {/* ================= Navbar ================= */}
          <div className="flex justify-end items-center gap-4 mb-8 backdrop-blur-md p-4 rounded-xl shadow relative z-[999]">
            <Link href="/" className="hover:text-green-600 transition">
              Home
            </Link>

            <IoNotificationsOutline className="text-2xl cursor-pointer" />

            <div className="relative">
              <IoSettingsOutline
                className="text-2xl cursor-pointer hover:rotate-90 transition"
                onClick={() => setOpenDropdown(!openDropdown)}
              />

              {openDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl border py-2">
                  <button
                    onClick={() => setShowLogoutPopup(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
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

          {/* ================= Title ================= */}
          <h1 className="text-2xl font-semibold text-center mb-6">
            My Plant Album 🌿
          </h1>

          {/* ================= Search ================= */}
          <div className="relative mb-8 w-[60%] mx-auto">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Plant Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border outline-none shadow-sm"
            />
          </div>

          {/* ================= Album Grid ================= */}
          {filteredAlbum.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">
              No plants scanned yet 🌱
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-6 pb-20">
              {filteredAlbum.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPlant(item)}
                  className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:scale-105 transition"
                >
                  <Image
                    src={item.image}
                    width={200}
                    height={150}
                    alt="plant"
                    className="rounded-xl mx-auto"
                  />
                  <h3 className="mt-3 font-semibold text-green-700 text-center">
                    {item.result?.title || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= Plant Details Popup ================= */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-3xl max-w-[500px] w-full relative">
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute top-3 right-4 text-xl"
            >
              ✖
            </button>

            <Image
              src={selectedPlant.image}
              width={300}
              height={200}
              alt="plant"
              className="rounded-xl mx-auto"
            />

            <h2 className="text-xl font-bold mt-4 text-center">
              {selectedPlant.result?.title || "Unknown"}
            </h2>

            <p className="mt-2 text-gray-600 text-sm">
              {selectedPlant.result?.description || "No description available."}
            </p>

            <ul className="mt-3 list-disc pl-5 text-sm">
              {selectedPlant.result?.advice?.map((a, i) => (
                <li key={i}>{a}</li>
              )) || <li>No advice provided.</li>}
            </ul>

            <p className="text-xs mt-3 text-gray-400 text-center">
              {selectedPlant.date}
            </p>
          </div>
        </div>
      )}

      {/* ================= Logout Popup ================= */}
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
              0%,
              100% {
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
      )}
    </div>
  );
}