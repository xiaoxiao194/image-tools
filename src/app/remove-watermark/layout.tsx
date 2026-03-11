import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "去水印 - PhotoLab",
  description: "涂抹标记水印区域，智能填充修复 — 100% 浏览器本地处理，无需上传服务器",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
