"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import NotificationBell from "@/components/NotificationBell";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

/* ===============================================================
   ADD CHILD MODAL
=============================================================== */
function AddChildModal({
  onClose,
  onAdd,
  isAdding,
}: {
  onClose: () => void;
  onAdd: (data: { childName: string; age: string; avatar: string }) => void;
  isAdding: boolean;
}) {
  const [name, setName]       = useState("");
  const [age, setAge]         = useState("7 Years");
  const [avatar, setAvatar]   = useState("/SCreen/cute.png");

  const avatars = [
    "/SCreen/boy-avatar.png",
    "/SCreen/girl-avatar.png",
    "/SCreen/cute.png",
    "/SCreen/child.png",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-[40px] shadow-2xl w-[440px] p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Add New Child 🌱
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Each child gets their own progress & tree
        </p>

        {/* Avatar preview */}
        <div className="flex justify-center mb-4">
          <Image
            src={avatar}
            width={100}
            height={100}
            alt="avatar"
            className="rounded-full border-4 border-green-400 shadow-lg object-cover h-[100px] w-[100px]"
          />
        </div>

        {/* Avatar picker */}
        <div className="flex gap-3 justify-center mb-6">
          {avatars.map((src) => (
            <Image
              key={src}
              src={src}
              width={50}
              height={50}
              alt="av"
              onClick={() => setAvatar(src)}
              className={`rounded-full cursor-pointer border-2 object-cover h-[50px] w-[50px] transition ${
                avatar === src ? "border-green-500 scale-110" : "border-transparent"
              }`}
            />
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 mb-1 block">Child Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sara"
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-green-500 transition"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 mb-1 block">Age</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-green-500 transition"
            >
              {["6 Years","7 Years","8 Years","9 Years","10 Years","11 Years","12 Years"].map(
                (o) => <option key={o}>{o}</option>
              )}
            </select>
          </div>
        </div>

        <button
          onClick={() => onAdd({ childName: name.trim(), age, avatar })}
          disabled={isAdding || !name.trim()}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg mt-6 hover:bg-green-700 transition active:scale-95 disabled:opacity-50"
        >
          {isAdding ? "Creating…" : "Create Child Profile"}
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
   EDIT PROFILE POPUP
=============================================================== */
function EditProfilePopup({
  onClose,
  userData,
  updateUserData,
}: {
  onClose: () => void;
  userData: any;
  updateUserData: any;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(userData?.avatar || "/SCreen/cute.png");
  const [childName, setChildName]           = useState(userData?.childName || "Adam");
  const [age, setAge]                       = useState(userData?.age || "7 Years");
  const [isSaving, setIsSaving]             = useState(false);

  const avatars = [
    "/SCreen/boy-avatar.png",
    "/SCreen/girl-avatar.png",
    "/SCreen/cute.png",
    "/SCreen/child.png",
    "/SCreen/boy-girl.png",
  ];

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateUserData({ childName, age, avatar: selectedAvatar });
      toast.success("Profile updated! ✅");
      onClose();
    } catch {
      toast.error("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-[40px] shadow-2xl w-[450px] p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Profile</h2>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image src={selectedAvatar} width={120} height={120} alt="profile"
              className="rounded-full border-4 border-green-500 shadow-xl object-cover h-[120px] w-[120px]" />
            <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">✨</div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-bold text-gray-700 mb-2 block">Child Name</label>
            <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-green-500 transition" />
          </div>
          <div>
            <label className="font-bold text-gray-700 mb-2 block">Age</label>
            <select value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-green-500 transition">
              {["7 Years","8 Years","9 Years","10 Years"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="font-bold text-gray-700 mb-2 block">Pick Avatar</label>
            <div className="flex gap-2 justify-between">
              {avatars.map((src, i) => (
                <Image key={i} src={src} width={55} height={55} alt="av"
                  onClick={() => setSelectedAvatar(src)}
                  className={`rounded-full cursor-pointer border-2 object-cover h-[55px] w-[55px] transition ${
                    selectedAvatar === src ? "border-green-500 scale-110" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={isSaving}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg mt-8 shadow-lg hover:bg-green-700 transition active:scale-95 disabled:opacity-50">
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
   MAIN DASHBOARD
=============================================================== */
export default function ParentDashboard() {
  const {
    user, userData, loading, updateUserData,
    childrenList, activeChildIndex, switchChild, addChild,
  } = useAuth();
  const router = useRouter();

  const [showEdit, setShowEdit]           = useState(false);
  const [openDropdown, setOpenDropdown]   = useState(false);
  const [showLogout, setShowLogout]       = useState(false);
  const [showAddChild, setShowAddChild]   = useState(false);
  const [addingChild, setAddingChild]     = useState(false);
  const [switching, setSwitching]         = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSwitchChild = async (i: number) => {
    setSwitching(i);
    await switchChild(i);
    setSwitching(null);
  };

  const handleAddChild = async (data: { childName: string; age: string; avatar: string }) => {
    try {
      setAddingChild(true);
      await addChild(data);
      setShowAddChild(false);
      toast.success(`${data.childName}'s profile created! 🌱`);
    } catch (err: any) {
      toast.error(err.message || "Failed to add child");
    } finally {
      setAddingChild(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!userData?.mood) { toast.info("Please select a mood first 😊"); return; }
    try {
      const randMsg = Math.floor(Math.random() * 5);
      const randVid = Math.floor(Math.random() * 3);
      await updateUserData({
        mood: userData.mood,
        moodMessageIndex: randMsg,
        moodVideoIndex: randVid
      });
      toast.success("Mood feedback saved! ✅");
    } catch {
      toast.error("Failed to save feedback.");
    }
  };

  /* ---------- Derived progress ---------- */
  const progress = userData?.progress || {
    scansCount: 0, lessonsCompleted: [], quizScores: {},
    gamesProgress: { puzzle: 0, memory: 0, matching: 0 },
    weeklyProgress: [0,0,0,0,0,0,0],
  };

  const weeklyData = (progress.weeklyProgress || [0,0,0,0,0,0,0]).map(
    (val: number, i: number) => ({ name: `Week ${i + 1}`, progress: val })
  );

  const quizScores = Object.entries(progress.quizScores || {})
    .map(([, score]: [string, any], i: number) => ({ label: `Quiz ${i + 1}`, value: score }))
    .slice(0, 4);

  const displayQuizScores = quizScores.length > 0 ? quizScores : [
    { label: "Quiz 1", value: 0 }, { label: "Quiz 2", value: 0 },
    { label: "Quiz 3", value: 0 }, { label: "Quiz 4", value: 0 },
  ];

  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b.value, 0) / quizScores.length)
    : 0;

  if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F5FFF9]">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const childName   = userData?.childName || "Adam";
  const childAvatar = userData?.avatar    || "/SCreen/cute.png";

  return (
    <div
      className="w-full min-h-screen flex relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/sCreen/growth.png')" }}
    >
      <div className="relative z-10 flex w-full h-screen">

        {/* =============== SIDEBAR =============== */}
        <div className="w-[280px] h-full bg-gradient-to-b from-[#00C9FF]/70 to-[#92FE9D]/70 backdrop-blur-lg shadow-lg rounded-tr-3xl rounded-br-3xl p-6 border border-white/30 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Image src="/SCreen/logo.png" width={48} height={48} alt="logo" />
            <h2 className="text-xl font-semibold text-white">Green Mind</h2>
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-3">
            <div className="px-4 py-3 rounded-2xl flex items-center gap-3 text-white font-medium bg-gradient-to-r from-[#18E3C8] to-[#52F294] shadow-lg border border-white/30">
              <Image src="/SCreen/dash.png" width={24} height={24} alt="dash" className="brightness-0 invert" />
              <span>Parent Hub</span>
            </div>
          </div>

          {/* Bottom: Switch User */}
          <div className="mt-auto pt-6 border-t border-white/20 flex flex-col gap-3">
            <Link href="/dashboard" className="block">
              <div className="px-4 py-3 rounded-2xl flex items-center gap-3 text-white hover:bg-white/20 transition font-medium cursor-pointer">
                <Image src="/SCreen/dash.png" width={24} height={24} alt="child" className="brightness-0 invert" />
                <span>Child Dashboard</span>
              </div>
            </Link>
          </div>
        </div>

        {/* =============== MAIN CONTENT =============== */}
        <div className="flex-1 p-6 overflow-y-auto h-full">

          {/* Navbar */}
          <div className="flex justify-end items-center gap-4 mb-6 backdrop-blur-md p-4 rounded-xl shadow relative z-[999]">
            <div className="mr-auto pl-2">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{user?.email}</span>
            </div>
            <Link href="/" className="hover:text-green-600 transition">Home</Link>
            <NotificationBell />
            <div className="relative">
              <IoSettingsOutline className="text-2xl cursor-pointer hover:rotate-90 transition" onClick={() => setOpenDropdown(!openDropdown)} />
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl border border-gray-100 py-2 z-[9999]">
                  <button onClick={() => setShowLogout(true)} className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
                    <IoLogOutOutline /> Logout
                  </button>
                </div>
              )}
            </div>
            <Image src={childAvatar} width={45} height={45} alt="avatar"
              className="rounded-full cursor-pointer border-2 border-green-400 object-cover h-[45px] w-[45px]" />
          </div>

          {/* ===== CHILD TABS ===== */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {childrenList.map((child, i) => (
              <button
                key={child.id}
                onClick={() => handleSwitchChild(i)}
                disabled={switching !== null}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition font-semibold text-sm ${
                  i === activeChildIndex
                    ? "bg-green-600 border-green-600 text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-600 hover:border-green-400"
                }`}
              >
                <Image src={child.avatar || "/SCreen/cute.png"} width={26} height={26} alt=""
                  className="rounded-full object-cover h-[26px] w-[26px]" />
                {switching === i ? "Switching…" : child.childName}
              </button>
            ))}

            {childrenList.length < 3 && (
              <button
                onClick={() => setShowAddChild(true)}
                className="px-4 py-2 rounded-2xl border-2 border-dashed border-green-400 text-green-600 hover:bg-green-50 transition font-semibold text-sm"
              >
                + Add Child
              </button>
            )}

            {childrenList.length >= 3 && (
              <span className="text-xs text-gray-400 italic">Max 3 children reached</span>
            )}
          </div>

          <h1 className="text-2xl font-semibold text-center mb-2">
            Parent Hub — {childName}
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard" className="block">
              <StatCard title="Quizzes" subtitle="Score Avg" value={`${avgQuizScore}%`} icon="/SCreen/check.png" />
            </Link>
            <Link href="/lessons" className="block">
              <StatCard title="Lessons" subtitle="Completed" value={progress.lessonsCompleted.length.toString()} icon="/SCreen/Book.png" />
            </Link>
            <Link href="/album" className="block">
              <StatCard title="Plants" subtitle="Scanned" value={progress.scansCount.toString()} icon="/SCreen/plant.png" />
            </Link>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-white rounded-3xl shadow-md p-6">
              <h3 className="font-semibold text-center mb-4">Learning Performance</h3>
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#22C55E" strokeWidth={2} dot={{ fill: "#22C55E" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-md p-6 text-center">
              <h3 className="font-semibold mb-4">Quiz Scores</h3>
              <div className="flex justify-between items-end h-[180px]">
                {displayQuizScores.map((q, i) => <AnimatedBar key={i} label={q.label} value={q.value} />)}
              </div>
            </div>
          </div>

          {/* Mood + Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 pb-20 items-stretch">
            <div className="bg-white rounded-[32px] shadow-sm p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Child's Daily Mood Assessment</h3>
              <p className="text-gray-500 mb-6 text-sm">How was your child's learning experience today?</p>

              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {[
                  { id: "Calm",    icon: "😌", label: "Calm"    },
                  { id: "Kind",    icon: "😁", label: "Kind"    },
                  { id: "Excited", icon: "🤩", label: "Excited" },
                  { id: "Focused", icon: "🎯", label: "Focused" },
                  { id: "Angry",   icon: "😠", label: "Angry"   },
                  { id: "Sad",     icon: "😢", label: "Sad"     },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      const randMsg = Math.floor(Math.random() * 5);
                      const randVid = Math.floor(Math.random() * 3);
                      updateUserData({
                        mood: m.id,
                        moodMessageIndex: randMsg,
                        moodVideoIndex: randVid
                      });
                    }}
                    className={`h-[88px] flex flex-col items-center justify-center rounded-3xl transition-all duration-300 border-2 font-medium ${
                      userData?.mood === m.id
                        ? "bg-green-50 border-green-600 text-green-700 shadow-md scale-105"
                        : "bg-white border-gray-100 text-gray-600 hover:border-green-200"
                    }`}
                  >
                    <span className="text-3xl mb-1">{m.icon}</span>
                    <span className="text-[10px] font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitFeedback}
                className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-md"
              >
                Submit Feedback ✅
              </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-[32px] shadow-sm p-8 border border-gray-100 flex flex-col items-center justify-center text-center">
              <Image src={childAvatar} width={100} height={100} alt="child"
                className="rounded-full shadow-md border-4 border-green-400 mb-4 h-[100px] w-[100px] object-cover" />
              <h3 className="font-bold text-2xl mb-1 text-gray-800">{childName}</h3>
              <p className="text-gray-500 mb-2">Age: {userData?.age || "7 Years"}</p>
              <p className="text-sm text-green-600 font-semibold mb-6">
                🌳 Tree Level {userData?.progress?.treeLevel ?? 1}
              </p>
              <button
                onClick={() => setShowEdit(true)}
                className="bg-green-50 text-green-600 px-10 py-3 rounded-2xl hover:bg-green-100 transition font-bold border border-green-100 mb-3"
              >
                Edit Profile
              </button>
              <Link href="/dashboard">
                <button className="bg-green-600 text-white px-10 py-3 rounded-2xl hover:bg-green-700 transition font-bold shadow-md">
                  Child's Dashboard →
                </button>
              </Link>
            </div>
          </div>

          {/* Popups */}
          {showEdit && (
            <EditProfilePopup userData={userData} updateUserData={updateUserData} onClose={() => setShowEdit(false)} />
          )}
          {showAddChild && (
            <AddChildModal onClose={() => setShowAddChild(false)} onAdd={handleAddChild} isAdding={addingChild} />
          )}
          {showLogout && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[10000]">
              <div className="bg-white rounded-3xl shadow-2xl p-10 w-[90%] max-w-[480px] text-center relative">
                <div className="flex justify-center mb-4">
                  <Image src="/SCreen/Group 45.png" width={120} height={120} alt="character" className="animate-bounce" />
                </div>
                <h2 className="text-3xl font-bold text-green-700 mb-3">Logout?</h2>
                <div className="flex justify-center gap-6 mt-8">
                  <button onClick={handleLogout} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition">Yes, Logout</button>
                  <button onClick={() => setShowLogout(false)} className="bg-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-400 transition">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */
function StatCard({ title, subtitle, value, icon }: { title: string; subtitle: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-4 hover:scale-105 transition cursor-pointer">
      <Image src={icon} width={40} height={40} alt={title} />
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
        <p className="text-lg font-bold text-green-600">{value}</p>
      </div>
    </div>
  );
}

function AnimatedBar({ value, label }: { value: number; label: string }) {
  const [height, setHeight] = useState("0%");
  useEffect(() => {
    const t = setTimeout(() => setHeight(`${value}%`), 200);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="flex flex-col items-center gap-1 transition-all duration-700 ease-in-out">
      <span className="text-xs font-medium">{value}%</span>
      <div className="w-10 bg-gradient-to-t from-green-600 to-green-400 rounded-full" style={{ height }} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
