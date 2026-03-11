import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "格式转换 - PhotoLab",
  description: "PNG、JPG、WebP 格式自由互转 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
