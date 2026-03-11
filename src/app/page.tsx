"use client";
import Link from "next/link";
import icons from "@/components/ToolIcons";

const tools = [
  { name: "图片压缩", desc: "智能压缩图片体积，保持高画质，支持批量处理", href: "/compress", icon: "compress", color: "from-blue-500 to-cyan-400" },
  { name: "格式转换", desc: "PNG、JPG、WebP 格式自由互转", href: "/convert", icon: "convert", color: "from-violet-500 to-purple-400" },
  { name: "图片裁剪", desc: "精确裁剪，自定义区域和比例", href: "/crop", icon: "crop", color: "from-rose-500 to-pink-400" },
  { name: "图片缩放", desc: "按尺寸或比例等比缩放", href: "/resize", icon: "resize", color: "from-amber-500 to-orange-400" },
  { name: "图片信息", desc: "查看图片尺寸、大小、格式等详细信息", href: "/info", icon: "info", color: "from-emerald-500 to-teal-400" },
  { name: "AI 抠图", desc: "一键去除背景，AI 本地运行，保护隐私", href: "/remove-bg", icon: "removeBg", color: "from-fuchsia-500 to-pink-400", badge: "AI" },
  { name: "去水印", desc: "涂抹标记水印区域，智能填充修复", href: "/remove-watermark", icon: "removeWatermark", color: "from-sky-500 to-blue-400", badge: "AI" },
  { name: "拼图拼接", desc: "多种模板布局，圆角间距随心调", href: "/stitch", icon: "stitch", color: "from-lime-500 to-green-400" },
  { name: "加水印", desc: "添加文字水印，支持平铺、定位、透明度调节", href: "/watermark", icon: "watermark", color: "from-cyan-500 to-blue-400" },
  { name: "表情包制作", desc: "多文本、贴纸、涂鸦、滤镜，打造专属表情包", href: "/meme", icon: "meme", color: "from-yellow-500 to-amber-400" },
  { name: "公众号封面", desc: "一键生成公众号标准尺寸封面图", href: "/wechat-cover", icon: "wechatCover", color: "from-red-500 to-rose-400", badge: "自媒体" },
  { name: "社交平台适配", desc: "一键适配小红书、抖音、微博等平台尺寸", href: "/social-resize", icon: "socialResize", color: "from-indigo-500 to-blue-400", badge: "自媒体" },
  { name: "截图美化", desc: "添加设备框、阴影和渐变背景", href: "/mockup", icon: "mockup", color: "from-gray-600 to-gray-400", badge: "自媒体" },
];

const featureIcons = {
  privacy: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M12 2l8 4v6c0 5.25-3.4 9.74-8 11-4.6-1.26-8-5.75-8-11V6l8-4z" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  speed: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  free: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <circle cx="12" cy="12" r="9" stroke="#6366f1" strokeWidth="2"/>
      <path d="M15 9.5a3 3 0 00-3-2.5c-1.7 0-3 1.3-3 3s1.3 3 3 3a3 3 0 013 3c0 1.7-1.3 3-3 3s-3-1.3-3-3M12 5v2m0 10v2" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const features = [
  { icon: featureIcons.privacy, title: "隐私安全", desc: "所有处理在浏览器本地完成，图片不会上传到任何服务器" },
  { icon: featureIcons.speed, title: "极速处理", desc: "利用浏览器原生能力，毫秒级完成图片处理" },
  { icon: featureIcons.free, title: "完全免费", desc: "无水印、无限制、无需注册，所有功能永久免费" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow bg-indigo-500" style={{ top: "-200px", left: "20%" }}></div>
        <div className="hero-glow bg-purple-500" style={{ top: "-100px", right: "10%" }}></div>
        <div className="hero-glow bg-blue-400" style={{ bottom: "-200px", left: "50%" }}></div>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-indigo-100/50 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            100% 浏览器本地处理，无需上传
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-8 tracking-tight leading-tight">
            <span className="gradient-text">专业图片处理</span>
            <br />
            <span className="text-gray-900">触手可及</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-loose">
            免费在线图片工具箱，支持压缩、转换、裁剪、缩放等功能。
            <br className="hidden sm:block" />
            <span className="mt-1 inline-block">无需下载软件，打开浏览器即可使用。</span>
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
            <Link key={t.href} href={t.href} className="card-hover block glass-card rounded-2xl p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-sm`}>
                {icons[t.icon]}
              </div>
              <h3 className="text-lg font-semibold mb-1.5 text-gray-900 mt-4">{t.name} {(t as any).badge && <span className="inline-block text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full ml-1.5 align-middle">{(t as any).badge}</span>}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="feature-section">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  {f.icon}
                </div>
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
