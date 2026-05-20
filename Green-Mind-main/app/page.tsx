"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F5FFF9]">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9FFFB] flex flex-col overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section
        className="relative text-white py-28 px-10 rounded-b-[70px] shadow-2xl bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/SCreen/screen-home.jpg')",
        }}
      >
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-black/45 rounded-b-[70px]"></div>

        {/* Decorative Floating Leaves */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <span className="absolute leaf leaf-1 text-2xl" style={{ left: "8%", top: "10%", animationDelay: "0s" }}>🍃</span>
          <span className="absolute leaf leaf-2 text-xl" style={{ left: "25%", top: "5%", animationDelay: "2s" }}>🌱</span>
          <span className="absolute leaf leaf-3 text-2xl" style={{ left: "65%", top: "8%", animationDelay: "4s" }}>🍃</span>
          <span className="absolute leaf leaf-4 text-lg" style={{ left: "82%", top: "12%", animationDelay: "1s" }}>🍂</span>
          <span className="absolute leaf leaf-1 text-xl" style={{ left: "45%", top: "18%", animationDelay: "3s" }}>🍃</span>
          <span className="absolute leaf leaf-2 text-2xl" style={{ left: "90%", top: "25%", animationDelay: "5s" }}>🌱</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-md">
              Explore, Learn, and <br />
              <span className="text-green-300">Build Positive Habits</span>
            </h1>

            <p className="mb-8 text-lg opacity-90 leading-relaxed max-w-xl drop-shadow-sm">
              Green Mind helps children develop responsibility, empathy, and
              environmental awareness through interactive learning, games, and
              real-world actions.
            </p>

            <div className="flex gap-4">
              <Link href="/choose">
                <button className="btn-primary bg-white text-green-700 px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition shadow-lg">
                  Get Started 🌱
                </button>
              </Link>

              {!user && (
                <Link href="/login">
                  <button className="border-2 border-white/80 px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-green-700 hover:scale-105 transition duration-300 shadow-md">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* ================= IMAGE SECTION ================= */}
          <div className="relative flex justify-center items-center mt-12 md:mt-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Glowing background */}
            <div className="absolute w-[440px] h-[440px] bg-gradient-to-br from-green-400/40 to-teal-300/30 rounded-full blur-3xl animate-pulse duration-[6s]"></div>

            {/* Background Image */}
            <div className="absolute -left-8 rotate-[-8deg] rounded-3xl shadow-xl opacity-90 z-0 animate-float-back transition-all hover:scale-105 duration-500">
              <Image
                src="/SCreen/perant-sce.png"
                width={350}
                height={350}
                alt="dashboard back"
                className="rounded-3xl shadow-xl"
              />
            </div>

            {/* Foreground Image */}
            <div className="relative z-10 rotate-[3deg] rounded-3xl shadow-2xl animate-float-front transition-all hover:scale-105 duration-500">
              <Image
                src="/SCreen/dash-sce.png"
                width={420}
                height={420}
                alt="dashboard front"
                className="rounded-3xl shadow-2xl"
              />
            </div>

            {/* Green mascot */}
            <div className="absolute -bottom-6 -right-10 z-20 drop-shadow-2xl animate-float-mascot transition-all hover:scale-110 duration-300">
              <Image
                src="/SCreen/Group 45.png"
                width={180}
                height={180}
                alt="green character"
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="py-24 px-10 bg-[#F5FFF9] relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-700">
              Why Green Mind?
            </h2>

            <p className="text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              Modern education often focuses on knowledge alone. Green Mind goes
              further by helping children build character, confidence, and care
              for the planet. With Green Mind, children don’t just learn — they
              practice, engage, and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="reveal reveal-delay-1">
              <Feature
                title="Positive Education"
                desc="Build empathy and kindness"
                img="/SCreen/le-1.jpg"
              />
            </div>
            <div className="reveal reveal-delay-2">
              <Feature
                title="Learning by Playing"
                desc="Fun and interactive lessons"
                img="/SCreen/le-2.jpg"
              />
            </div>
            <div className="reveal reveal-delay-3">
              <Feature
                title="Real Practice"
                desc="Apply learning in real life"
                img="/SCreen/le-3.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW ================= */}
      <section className="py-24 px-10 bg-white shadow-inner relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-green-700">
              How Green Mind Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 p-4">
            <div className="reveal reveal-delay-1">
              <Step num="1" title="Learn" img="/SCreen/learn.jpg" />
            </div>
            <div className="reveal reveal-delay-2">
              <Step num="2" title="Play" img="/SCreen/play.jpg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-6 p-4">
            <div className="reveal reveal-delay-1">
              <Step num="3" title="Scan" img="/SCreen/scan.png" />
            </div>
            <div className="reveal reveal-delay-2">
              <Step num="4" title="Grow" img="/SCreen/grow.jpg" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOR ================= */}
      <section className="bg-[#F5FFF9] py-24 px-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-20">
              For Parents & Children
            </h2>
          </div>

          {/* Children Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12 reveal">
            {/* Text Content */}
            <div className="flex-1 text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
                🌱 For Children
              </h3>
              <ul className="space-y-4 text-gray-700 text-base md:text-lg ml-2">
                <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2">
                  <span className="text-green-500 text-xl">✔</span> Learn through interactive games & quizzes
                </li>
                <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2">
                  <span className="text-green-500 text-xl">✔</span> Grow responsibility by watering their virtual tree
                </li>
                <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2">
                  <span className="text-green-500 text-xl">✔</span> Care for the planet with real-world missions
                </li>
              </ul>
            </div>

            {/* Image */}
            <div className="flex-1 flex justify-center md:justify-end transition-all hover:scale-105 duration-500">
              <Image
                src="/SCreen/hum-chi.jpg"
                width={380}
                height={300}
                alt="child"
                className="rounded-3xl shadow-2xl object-cover w-[360px] h-[300px] border-4 border-white"
              />
            </div>
          </div>

          {/* Parents Section */}
          <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-12 reveal">
            {/* Text Content */}
            <div className="flex-1 text-left md:text-right">
              <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 flex items-center gap-2 justify-start md:justify-end">
                🌱 For Parents
              </h3>
              <ul className="space-y-4 text-gray-700 text-base md:text-lg md:mr-2">
                <li className="flex items-center gap-3 justify-start md:justify-end transition-transform duration-300 hover:-translate-x-2">
                  Track dynamic learning progress <span className="text-green-500 text-xl">✔</span>
                </li>
                <li className="flex items-center gap-3 justify-start md:justify-end transition-transform duration-300 hover:-translate-x-2">
                  View performance & quiz reports <span className="text-green-500 text-xl">✔</span>
                </li>
                <li className="flex items-center gap-3 justify-start md:justify-end transition-transform duration-300 hover:-translate-x-2">
                  Support positive habits & feedback <span className="text-green-500 text-xl">✔</span>
                </li>
              </ul>
            </div>

            {/* Image */}
            <div className="flex-1 flex justify-center md:justify-start transition-all hover:scale-105 duration-500">
              <Image
                src="/SCreen/hum-par.jpg"
                width={380}
                height={300}
                alt="parent"
                className="rounded-3xl shadow-2xl object-cover w-[360px] h-[340px] border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        className="relative text-white py-16 px-10 mt-auto bg-cover bg-center rounded-t-[40px] overflow-hidden"
        style={{
          backgroundImage: "url('/SCreen/screen-home.jpg')",
        }}
      >
        {/* Transparent layer */}
        <div className="absolute inset-0 bg-black/55 rounded-t-[40px]"></div>

        {/* Core footer content */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mb-10">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Image
              src="/SCreen/Group 45.png"
              width={100}
              height={100}
              alt="logo"
              className="mb-4 hover:scale-110 transition duration-300"
            />
            <h3 className="text-2xl font-bold mb-2">🌱 Green Mind</h3>
            <p className="text-sm opacity-80 leading-relaxed">Fun and meaningful eco-learning adventures for kids.</p>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-green-300">Pages</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-green-300 transition duration-200 block">Home</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-green-300 transition duration-200 block">Login</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-green-300 transition duration-200 block">Signup</Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-green-300">Contact Us</h4>
            <p className="text-sm opacity-80 mb-2">Have questions? Reach out to our team:</p>
            <p className="text-sm font-semibold text-white hover:text-green-300 transition duration-200">
              team_greenmind@gmail.com
            </p>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="relative z-10 border-t border-white/20 pt-8 text-center mt-6">
          <p className="text-sm text-gray-300">
            © 2026 <span className="font-semibold text-white">Green Mind</span>. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Animation Styles */}
      <style jsx global>{`
        /* Hero Fade In Up on Load */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Floating Parallax for Hero Images */
        @keyframes floatBack {
          0%, 100% {
            transform: translateY(0px) rotate(-8deg);
          }
          50% {
            transform: translateY(-8px) rotate(-7deg);
          }
        }
        
        @keyframes floatFront {
          0%, 100% {
            transform: translateY(0px) rotate(3deg);
          }
          50% {
            transform: translateY(-14px) rotate(2deg);
          }
        }
        
        @keyframes floatMascot {
          0%, 100% {
            transform: translateY(0px) scale(1) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) scale(1.03) rotate(2deg);
          }
        }
        
        .animate-float-back {
          animation: floatBack 6s ease-in-out infinite;
        }
        
        .animate-float-front {
          animation: floatFront 5.2s ease-in-out infinite;
        }
        
        .animate-float-mascot {
          animation: floatMascot 4.2s ease-in-out infinite;
        }

        /* Falling Leaf Particles in Hero */
        @keyframes leafFall1 {
          0% {
            transform: translate(0, -20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translate(50px, 360px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes leafFall2 {
          0% {
            transform: translate(0, -20px) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translate(-70px, 320px) rotate(-270deg);
            opacity: 0;
          }
        }

        .leaf {
          position: absolute;
          pointer-events: none;
          opacity: 0;
        }
        
        .leaf-1 {
          animation: leafFall1 10s infinite linear;
        }
        
        .leaf-2 {
          animation: leafFall2 13s infinite linear;
        }
        
        .leaf-3 {
          animation: leafFall1 15s infinite linear;
        }
        
        .leaf-4 {
          animation: leafFall2 11s infinite linear;
        }

        /* Primary Button Pulsing Glow */
        .btn-primary {
          box-shadow: 0 4px 14px 0 rgba(74, 222, 128, 0.35);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 22px 0 rgba(74, 222, 128, 0.55);
        }

        /* Scroll Reveal Effect */
        .reveal {
          opacity: 0;
          transform: translateY(35px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .reveal-active {
          opacity: 1;
          transform: translateY(0);
        }
        
        .reveal-delay-1 {
          transition-delay: 0.1s;
        }
        
        .reveal-delay-2 {
          transition-delay: 0.25s;
        }
        
        .reveal-delay-3 {
          transition-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

/* ================= Components ================= */
function Feature({ title, desc, img }: { title: string; desc: string; img: string }) {
  return (
    <div className="bg-white p-7 rounded-[32px] shadow-md border border-green-50/50 hover:border-green-200/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full">
      <div className="overflow-hidden rounded-2xl mb-5 aspect-video relative">
        <Image
          src={img}
          fill
          alt={title}
          className="object-cover transition-transform duration-500 hover:scale-115"
        />
      </div>
      <h3 className="font-bold mb-2 text-xl text-gray-800">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ num, title, img }: { num: string; title: string; img: string }) {
  return (
    <div className="bg-white p-8 rounded-[36px] shadow-md border border-gray-50 hover:border-green-200/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col items-center">
      <div className="w-10 h-10 bg-green-50 text-green-600 font-extrabold text-xl rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-100">
        {num}
      </div>
      <div className="overflow-hidden rounded-2xl mb-5 w-full aspect-[4/3] relative">
        <Image
          src={img}
          fill
          alt={title}
          className="object-cover transition-transform duration-500 hover:scale-115"
        />
      </div>
      <h4 className="font-bold text-xl text-gray-800">{title}</h4>
    </div>
  );
}