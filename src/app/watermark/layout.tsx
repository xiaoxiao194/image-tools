import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "加水印 - PhotoLab",
  description: "添加文字水印，支持平铺、定位、透明度调节 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
