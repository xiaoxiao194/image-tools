import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "旋转翻转 - PhotoLab",
  description: "旋转任意角度，水平/垂直翻转 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
