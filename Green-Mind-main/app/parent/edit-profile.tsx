"use client";

import { useState } from "react";
import Image from "next/image";

export default function EditProfilePopup({ onClose, userData, updateUserData }: { onClose: () => void; userData?: any; updateUserData?: any }) {
  const [selectedAvatar, setSelectedAvatar] = useState(userData?.avatar || "/SCreen/cute.png");
  const [childName, setChildName] = useState(userData?.childName || "Adam");
  const [age, setAge] = useState(userData?.age || "7 Years");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (updateUserData) {
        await updateUserData({ childName, age, avatar: selectedAvatar });
      }
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      
      {/* Box */}
      <div className="bg-white rounded-[40px] shadow-2xl w-[450px] p-8 relative animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-2xl transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800" dir="rtl">
          Edit Profile
        </h2>

        <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Image
              src={selectedAvatar}
              width={120}
              height={120}
              alt="profile"
              className="rounded-full border-4 border-green-500 shadow-xl object-cover h-[120px] w-[120px]"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">✨</div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="font-bold text-gray-700 mb-2 block text-right" dir="rtl">
              Child Name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-green-500 transition text-right"
              dir="rtl"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 mb-2 block text-right" dir="rtl">
              Age
            </label>
            <select 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-green-500 transition text-right appearance-none"
              dir="rtl"
            >
              {["7 Years", "8 Years", "9 Years", "10 Years"].map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="font-bold text-gray-700 mb-4 block text-right" dir="rtl">
              Choose Photo
            </label>
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                id="avatar-upload-main"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSelectedAvatar(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="avatar-upload-main"
                className="bg-green-50 text-green-700 px-8 py-3 rounded-2xl border-2 border-green-200 cursor-pointer hover:bg-green-100 transition font-bold shadow-sm"
              >
                Upload from Device 📁
              </label>
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg mt-8 shadow-lg hover:bg-green-700 transition active:scale-95 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
