import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "公众号封面 - PhotoLab",
  description: "一键生成公众号标准尺寸封面图 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
