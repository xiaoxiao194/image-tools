import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "图片压缩 - PhotoLab",
  description: "智能压缩图片体积，保持高画质，支持批量处理 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
