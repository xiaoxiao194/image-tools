import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "图片工具箱 - 免费在线图片处理",
  description: "免费在线图片压缩、格式转换、裁剪缩放工具，无需上传服务器，浏览器本地处理",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
