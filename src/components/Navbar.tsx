"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { name: "AI抠图", href: "/remove-bg" },
  { name: "去水印", href: "/remove-watermark" },
  { name: "压缩", href: "/compress" },
  { name: "转换", href: "/convert" },
  { name: "裁剪", href: "/crop" },
  { name: "缩放", href: "/resize" },
  { name: "旋转", href: "/rotate" },
  { name: "信息", href: "/info" },
  { name: "拼图", href: "/stitch" },
  { name: "水印", href: "/watermark" },
  { name: "表情包", href: "/meme" },
  { name: "头像", href: "/avatar" },
  { name: "封面", href: "/wechat-cover" },
  { name: "适配", href: "/social-resize" },
  { name: "美化", href: "/mockup" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[100] glass-nav">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img src="/logo.svg" alt="PhotoLab" className="w-9 h-9 rounded-xl" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">Photo<span className="gradient-text">Lab</span></span>
        </Link>

        {/* Desktop nav */}
        {!isHome && (
          <div className="hidden lg:flex items-center gap-0.5 text-sm mx-4 flex-1 justify-center">
            {navLinks.slice(0, 8).map((t) => (
              <Link key={t.href} href={t.href} className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${pathname === t.href ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5"}`}>
                {t.name}
              </Link>
            ))}
            {/* More dropdown */}
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${menuOpen ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5"}`}>
                更多 ▾
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 min-w-[120px]">
                    {navLinks.slice(8).map((t) => (
                      <Link key={t.href} href={t.href} onClick={() => setMenuOpen(false)} className={`block px-4 py-2 text-sm transition-colors ${pathname === t.href ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile menu button */}
        {!isHome && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        )}

        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />
          <a href="https://github.com/xiaoxiao194/image-tools" target="_blank" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {!isHome && menuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-3 gap-1">
            {navLinks.map((t) => (
              <Link key={t.href} href={t.href} onClick={() => setMenuOpen(false)} className={`px-3 py-2 rounded-lg text-sm text-center transition-colors ${pathname === t.href ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
