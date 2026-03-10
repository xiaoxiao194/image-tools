"use client";
import Link from "next/link";

const tools = [
  { name: "图片压缩", desc: "智能压缩图片体积，保持高画质，支持批量处理", href: "/compress", icon: "📦", color: "from-blue-500 to-cyan-400" },
  { name: "格式转换", desc: "PNG、JPG、WebP 格式自由互转", href: "/convert", icon: "🔄", color: "from-violet-500 to-purple-400" },
  { name: "图片裁剪", desc: "精确裁剪，自定义区域和比例", href: "/crop", icon: "✂️", color: "from-rose-500 to-pink-400" },
  { name: "图片缩放", desc: "按尺寸或比例等比缩放", href: "/resize", icon: "🔍", color: "from-amber-500 to-orange-400" },
  { name: "图片信息", desc: "查看图片尺寸、大小、格式等详细信息", href: "/info", icon: "ℹ️", color: "from-emerald-500 to-teal-400" },
  { name: "AI 抠图", desc: "一键去除背景，AI 本地运行，保护隐私", href: "/remove-bg", icon: "✨", color: "from-fuchsia-500 to-pink-400", badge: "AI" },
  { name: "去水印", desc: "涂抹标记水印区域，智能填充修复", href: "/remove-watermark", icon: "🧹", color: "from-sky-500 to-blue-400", badge: "AI" },
];

const features = [
  { icon: "🔒", title: "隐私安全", desc: "所有处理在浏览器本地完成，图片不会上传到任何服务器" },
  { icon: "⚡", title: "极速处理", desc: "利用浏览器原生能力，毫秒级完成图片处理" },
  { icon: "💰", title: "完全免费", desc: "无水印、无限制、无需注册，所有功能永久免费" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            100% 浏览器本地处理，无需上传
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight">
            <span className="gradient-text">专业图片处理</span>
            <br />
            <span className="text-gray-900">触手可及</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            免费在线图片工具箱，支持压缩、转换、裁剪、缩放等功能。
            <br className="hidden sm:block" />
            无需下载软件，打开浏览器即可使用。
          </p>
          <Link href="#tools" className="btn-primary inline-block text-base px-8 py-3">
            开始使用 →
          </Link>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">选择工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="card-hover block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                {t.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1.5 text-gray-900">{t.name} {(t as any).badge && <span className="inline-block text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full ml-1.5 align-middle">{(t as any).badge}</span>}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
