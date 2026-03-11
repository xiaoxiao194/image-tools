import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "图片信息 - PhotoLab",
  description: "查看图片尺寸、大小、格式等详细信息 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
