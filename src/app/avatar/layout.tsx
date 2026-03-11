import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "圆角头像 - PhotoLab",
  description: "生成圆形、圆角头像，支持边框和缩放 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
