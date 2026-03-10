"use client";
import Link from "next/link";

const tools = [
  { name: "图片压缩", desc: "智能压缩，保持画质，支持批量", href: "/compress", icon: "📦" },
  { name: "格式转换", desc: "PNG / JPG / WebP 互转", href: "/convert", icon: "🔄" },
  { name: "图片裁剪", desc: "自由裁剪、按比例裁切", href: "/crop", icon: "✂️" },
  { name: "图片缩放", desc: "按尺寸或比例缩放", href: "/resize", icon: "🔍" },
  { name: "图片信息", desc: "查看尺寸、大小、格式等", href: "/info", icon: "ℹ️" },
];

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🖼️ 图片工具箱</h1>
        <p className="text-gray-500 text-lg">免费在线图片处理，浏览器本地运行，无需上传服务器</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="text-3xl mb-3">{t.icon}</div>
            <h2 className="text-xl font-semibold mb-1">{t.name}</h2>
            <p className="text-gray-500 text-sm">{t.desc}</p>
          </Link>
        ))}
      </div>
      <footer className="text-center text-gray-400 text-sm mt-16">
        © 2026 图片工具箱 · 所有处理均在浏览器本地完成
      </footer>
    </main>
  );
}
