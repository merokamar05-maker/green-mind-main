"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F5FFF9]">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9FFFB] flex flex-col">
      {/* ================= HERO ================= */}
      <section
        className="relative text-white py-24 px-10 rounded-b-[70px] shadow-lg bg-cover bg-center"
        style={{
          backgroundImage: "url('/SCreen/screen-home.jpg')",
        }}
      >
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-black/40 rounded-b-[70px]"></div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Explore, Learn, and <br /> Build Positive Habits
            </h1>

            <p className="mb-6 text-lg opacity-90">
              Green Mind helps children develop responsibility, empathy, and
              environmental awareness through interactive learning, games, and
              real-world actions.
            </p>

            <div className="flex gap-4">
              <Link href="/choose">
                <button className="bg-white text-green-700 px-7 py-3 rounded-xl font-semibold hover:scale-105 transition">
                  Get Started
                </button>
              </Link>

              {!user && (
                <Link href="/login">
                  <button className="border border-white px-7 py-3 rounded-xl hover:bg-white hover:text-green-700 transition">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* ================= IMAGE SECTION ================= */}
          <div className="relative flex justify-center items-center mt-16">
            {/* Glowing background */}
            <div className="absolute w-[420px] h-[420px] bg-gradient-to-br from-green-300/40 to-teal-200/30 rounded-full blur-3xl"></div>

            {/* Background Image */}
            <Image
              src="/SCreen/perant-sce.png"
              width={350}
              height={350}
              alt="dashboard back"
              className="absolute -left-8 rotate-[-8deg] rounded-3xl shadow-xl opacity-90 z-0"
            />

            {/* Foreground Image */}
            <Image
              src="/SCreen/dash-sce.png"
              width={420}
              height={420}
              alt="dashboard front"
              className="relative z-10 rotate-[3deg] rounded-3xl shadow-2xl"
            />

            {/* Green mascot */}
            <Image
              src="/SCreen/Group 45.png"
              width={180}
              height={180}
              alt="green character"
              className="absolute -bottom-6 -right-10 z-20 drop-shadow-2xl animate-bounce-fast"
            />
          </div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="py-24 px-10 bg-[#F5FFF9]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-700">
            Why Green Mind?
          </h2>

          <p className="text-gray-600 mb-14 max-w-2xl mx-auto">
            Modern education often focuses on knowledge alone. Green Mind goes
            further by helping children build character, confidence, and care
            for the planet. With Green Mind, children don’t just learn — they
            practice, engage, and grow.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              title="Positive Education"
              desc="Build empathy and kindness"
              img="/SCreen/le-1.jpg"
            />
            <Feature
              title="Learning by Playing"
              desc="Fun and interactive lessons"
              img="/SCreen/le-2.jpg"
            />
            <Feature
              title="Real Practice"
              desc="Apply learning in real life"
              img="/SCreen/le-3.png"
            />
          </div>
        </div>
      </section>

      {/* ================= HOW ================= */}
      <section className="py-24 px-10 bg-white shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-14 text-green-700">
            How Green Mind Works
          </h2>

          <div className="grid md:grid-cols-2 gap-16 p-10">
            <Step num="1" title="Learn" img="/SCreen/learn.jpg" />
            <Step num="2" title="Play" img="/SCreen/play.jpg" />
          </div>

          <div className="grid md:grid-cols-2 gap-16 mt-10 p-10">
            <Step num="3" title="Scan" img="/SCreen/scan.png" />
            <Step num="4" title="Grow" img="/SCreen/grow.jpg" />
          </div>
        </div>
      </section>

      {/* ================= FOR ================= */}
      <section className="bg-[#F5FFF9] py-24 px-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl font-bold text-green-700 text-center mb-16">
            For Parents & Children
          </h2>

          {/* Children Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
            {/* Text Content */}
            <div className="flex-1 text-left">
              <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                🌱 For Children
              </h3>
              <ul className="space-y-3 text-gray-700 ml-2">
                <li>• Learn through play</li>
                <li>• Grow responsibility</li>
                <li>• Care for plants and planet</li>
              </ul>
            </div>

            {/* Image */}
            <div className="flex-1 flex justify-center md:justify-end">
              <Image
                src="/SCreen/hum-chi.jpg"
                width={380}
                height={300}
                alt="child"
                className="rounded-[50%] shadow-xl object-cover w-[340px] h-[280px]"
              />
            </div>
          </div>

          {/* Parents Section */}
          <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-10">
            {/* Text Content */}
            <div className="flex-1 text-left md:text-right">
              <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2 justify-start md:justify-end">
                🌱 For Parents
              </h3>
              <ul className="space-y-3 text-gray-700 md:mr-2">
                <li>• Track learning progress</li>
                <li>• View performance report</li>
                <li>• Support positive behavior</li>
              </ul>
            </div>

            {/* Image */}
            <div className="flex-1 flex justify-center md:justify-start">
              <Image
                src="/SCreen/hum-par.jpg"
                width={380}
                height={300}
                alt="parent"
                className="rounded-[50%] shadow-xl object-cover w-[340px] h-[360px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        className="relative text-white py-12 px-10 mt-auto bg-cover bg-center rounded-t-[40px]"
        style={{
          backgroundImage: "url('/SCreen/screen-home.jpg')",
        }}
      >
        {/* Transparent layer */}
        <div className="absolute inset-0 bg-black/50 rounded-t-[40px]"></div>

        {/* Core footer content */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-10">
          {/* Logo */}
          <div>
            <Image
              src="/SCreen/Group 45.png"
              width={100}
              height={100}
              alt="logo"
              className="mb-2"
            />
            <h3 className="text-xl font-bold mb-2">🌱 Green Mind</h3>
            <p className="text-sm opacity-80">Fun eco-learning for kids</p>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="font-semibold mb-3">Pages</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/signup">Signup</Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm opacity-80">team_greenmind@gmail.com</p>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="relative z-10 border-t border-white/30 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © 2026 <span className="font-semibold text-white">Green Mind</span>. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Fast bounce animation for mascot */}
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

/* ================= Components ================= */
function Feature({ title, desc, img }: { title: string; desc: string; img: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow hover:scale-105 transition">
      <Image
        src={img}
        width={200}
        height={200}
        alt={title}
        className="mx-auto mb-4 rounded-2xl object-cover"
      />
      <h3 className="font-semibold mb-2 text-lg">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function Step({ num, title, img }: { num: string; title: string; img: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg hover:scale-105 transition">
      <div className="text-green-600 font-bold text-xl mb-4">{num}</div>
      <Image
        src={img}
        width={300}
        height={200}
        alt={title}
        className="mx-auto mb-4 rounded-2xl object-cover shadow"
      />
      <h4 className="font-semibold text-lg">{title}</h4>
    </div>
  );
}