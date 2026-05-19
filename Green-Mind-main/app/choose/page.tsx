"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";

export default function SelectRole() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If not logged in, redirect to login
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F5FFF9]">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start pt-14">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/sCreen/tree pic.png')",
        }}
      />

      {/* TRANSPARENT LAYER */}
      <div className="absolute inset-0 bg-white/10" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-[45px] font-bold mb-10 whitespace-nowrap overflow-x-auto text-center">
          Let's get started! Please select your role
        </h1>

        <div className="flex gap-20 flex-wrap justify-center mt-5">

          {/* PARENT CARD */}
          <div className="w-[270px] h-[350px] bg-[#F6FF4B] rounded-2xl shadow-xl flex flex-col items-center p-4
                          transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex-1"></div>

            <img
              src="/sCreen/Union.png"
              className="w-[140px] h-[170px] rounded-xl object-cover transform transition-transform duration-300 hover:scale-110"
            />

            <Link href="/parent">
              <button className="mt-2 bg-[#4C0000] text-white w-[150px] py-0 rounded-xl text-[22px] font-medium cursor-pointer">
                I'm a parent
              </button>
            </Link>

            <div className="flex-1"></div>
          </div>

          {/* CHILD CARD */}
          <div className="w-[270px] h-[350px] bg-[#FFD9D3] rounded-2xl shadow-xl flex flex-col items-center p-4
                          transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex-1"></div>

            <img
              src="/sCreen/child.png"
              className="w-[140px] h-[170px] rounded-xl object-cover transform transition-transform duration-300 hover:scale-110"
            />

            <Link href="/dashboard">
              <button className="mt-2 bg-[#4C0000] text-white w-[150px] py-0 rounded-xl text-[22px] font-medium cursor-pointer">
                I'm a child
              </button>
            </Link>

            <div className="flex-1"></div>
          </div>

        </div>
      </div>

    </div>
  );
}