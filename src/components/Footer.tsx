export default function Footer() {
  return (
    <footer className="border-t border-indigo-50/50 mt-20 bg-white/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">© 2026 PhotoLab · 所有图片处理均在浏览器本地完成，不上传服务器</p>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
          <span className="text-xs text-gray-400">100% 客户端处理</span>
        </div>
      </div>
    </footer>
  );
}
