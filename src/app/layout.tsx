import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PhotoLab - 免费在线图片处理工具",
  description: "PhotoLab 免费在线图片压缩、格式转换、裁剪缩放、AI抠图工具。100% 浏览器本地处理，无需上传服务器，保护隐私。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
