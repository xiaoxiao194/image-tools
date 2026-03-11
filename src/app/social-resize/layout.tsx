import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "社交平台适配 - PhotoLab",
  description: "一键适配小红书、抖音、微博等平台尺寸 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
