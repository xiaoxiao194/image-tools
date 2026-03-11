import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI 抠图 - PhotoLab",
  description: "一键去除背景，AI 本地运行，保护隐私 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
