import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "截图美化 - PhotoLab",
  description: "添加设备框、阴影和渐变背景 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
