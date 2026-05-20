"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface MenuItemProps {
  title: string;
  icon: string;
  href: string;
  active?: boolean;
  isImage?: boolean;
}

function MenuItem({ title, icon, href, active, isImage }: MenuItemProps) {
  return (
    <Link href={href} className="block">
      <div
        className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-base cursor-pointer font-medium transition-all ${
          active
            ? "text-white shadow-lg border border-white/30 bg-gradient-to-r from-[#18E3C8] to-[#52F294]"
            : "text-white hover:bg-white/20"
        }`}
      >
        <Image 
          src={icon} 
          width={isImage ? 32 : 24} 
          height={isImage ? 32 : 24} 
          alt={title} 
          className={`${isImage ? "rounded-full object-cover" : "brightness-0 invert"} drop-shadow-md`} 
        />
        <span className="drop-shadow-sm">{title}</span>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { title: "Dashboard", icon: "/SCreen/dash.png", href: "/dashboard" },
    { title: "Lessons", icon: "/SCreen/start lesson.png", href: "/lessons" },
    { title: "Games", icon: "/SCreen/games.png", href: "/games" },
    { title: "AI Scan", icon: "/SCreen/ai.png", href: "/ai-scan" },
    { title: "Tree Growth", icon: "/SCreen/tree-gro.png", href: "/growth" },
    { title: "Album", icon: "/SCreen/album.png", href: "/album" },
  ];

  return (
    <div className="w-[280px] h-full bg-gradient-to-b from-[#00C9FF]/70 to-[#92FE9D]/70 backdrop-blur-lg shadow-lg rounded-tr-3xl rounded-br-3xl p-6 border border-white/30 flex-shrink-0 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Image src="/SCreen/logo.png" width={48} height={48} alt="logo" />
        <h2 className="text-xl font-semibold text-white">Green Mind</h2>
      </div>

      <div className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <MenuItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </div>

      {/* Parent Hub Section */}
      <div className="mt-auto pt-6 border-t border-white/20 flex flex-col gap-3">
        <MenuItem 
          title="Parent Hub" 
          icon="/SCreen/Union.png" 
          href="/parent" 
          active={pathname === "/parent"} 
          isImage={true}
        />

      </div>
    </div>
  );
}