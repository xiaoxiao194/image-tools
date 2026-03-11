import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "图片缩放 - PhotoLab",
  description: "按尺寸或比例等比缩放 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
