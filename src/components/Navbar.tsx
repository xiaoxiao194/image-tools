"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg">P</div>
          <span className="font-bold text-xl text-gray-900">PixelKit</span>
        </Link>
        {!isHome && (
          <div className="hidden sm:flex items-center gap-1 text-sm">
            {[
              { name: "压缩", href: "/compress" },
              { name: "转换", href: "/convert" },
              { name: "裁剪", href: "/crop" },
              { name: "缩放", href: "/resize" },
              { name: "信息", href: "/info" },
              { name: "AI抠图", href: "/remove-bg" },
              { name: "去水印", href: "/remove-watermark" },
              { name: "拼图", href: "/stitch" },
              { name: "水印", href: "/watermark" },
              { name: "表情包", href: "/meme" },
              { name: "封面", href: "/wechat-cover" },
              { name: "适配", href: "/social-resize" },
              { name: "美化", href: "/mockup" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === t.href ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <a href="https://github.com/xiaoxiao194/image-tools" target="_blank" className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
