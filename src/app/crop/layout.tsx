import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "图片裁剪 - PhotoLab",
  description: "精确裁剪，自定义区域和比例 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
