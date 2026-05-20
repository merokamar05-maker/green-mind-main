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
    <>
      <style>{`
        /* ── card entrance & float ── */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-8px); }
        }

        .card-parent {
          animation:
            cardIn    0.7s cubic-bezier(0.34,1.4,0.64,1) 0.2s both,
            floatCard 4s  ease-in-out               1s    infinite;
        }
        .card-child {
          animation:
            cardIn    0.7s cubic-bezier(0.34,1.4,0.64,1) 0.4s both,
            floatCard 4s  ease-in-out               1.7s  infinite;
        }
        .card-parent:hover,
        .card-child:hover {
          animation-play-state: paused;
          transform: translateY(-10px) scale(1.03) !important;
        }

        /* ── button shimmer ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(76,0,0,0.35); }
          50%       { box-shadow: 0 6px 24px rgba(76,0,0,0.55); }
        }

        .role-btn {
          background: linear-gradient(
            105deg,
            #4C0000 0%,
            #4C0000 40%,
            #7a1010 50%,
            #4C0000 60%,
            #4C0000 100%
          );
          background-size: 200% auto;
          animation:
            shimmer  2.8s linear        infinite,
            btnPulse 2.2s ease-in-out   infinite;
          transition: transform 0.2s ease, letter-spacing 0.2s ease;
        }

        .role-btn:hover {
          transform: scale(1.06);
          letter-spacing: 0.5px;
          animation-play-state: paused;
          background: linear-gradient(105deg, #6b0000, #9b1515);
          background-size: 200% auto;
          box-shadow: 0 8px 28px rgba(76,0,0,0.55);
        }

        .role-btn:active {
          transform: scale(0.96);
        }
      `}</style>

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
            Let&apos;s get started! Please select your role
          </h1>

          <div className="flex gap-20 flex-wrap justify-center mt-5">

            {/* PARENT CARD */}
            <div className="card-parent w-[270px] h-[350px] bg-[#F6FF4B] rounded-2xl shadow-xl flex flex-col items-center p-4 cursor-pointer">
              <div className="flex-1" />

              <img
                src="/sCreen/Union.png"
                className="w-[140px] h-[170px] rounded-xl object-cover transform transition-transform duration-300 hover:scale-110"
              />

              <Link href="/parent">
                <button className="role-btn mt-2 text-white w-[150px] py-[6px] rounded-xl text-[22px] font-medium cursor-pointer">
                  I&apos;m a parent
                </button>
              </Link>

              <div className="flex-1" />
            </div>

            {/* CHILD CARD */}
            <div className="card-child w-[270px] h-[350px] bg-[#FFD9D3] rounded-2xl shadow-xl flex flex-col items-center p-4 cursor-pointer">
              <div className="flex-1" />

              <img
                src="/sCreen/child.png"
                className="w-[140px] h-[170px] rounded-xl object-cover transform transition-transform duration-300 hover:scale-110"
              />

              <Link href="/dashboard">
                <button className="role-btn mt-2 text-white w-[150px] py-[6px] rounded-xl text-[22px] font-medium cursor-pointer">
                  I&apos;m a child
                </button>
              </Link>

              <div className="flex-1" />
            </div>

          </div>
        </div>

      </div>
    </>
  );
}