import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "拼图拼接 - PhotoLab",
  description: "多种模板布局，圆角间距随心调 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
