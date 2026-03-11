import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "表情包制作 - PhotoLab",
  description: "多文本、贴纸、涂鸦、滤镜，打造专属表情包 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
