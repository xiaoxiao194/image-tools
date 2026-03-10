"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

export default function InfoPage() {
  const [info, setInfo] = useState<{ name: string; size: string; type: string; width: number; height: number; lastModified: string } | null>(null);
  const [preview, setPreview] = useState("");

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setInfo({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + " KB" + (f.size > 1048576 ? ` (${(f.size / 1048576).toFixed(2)} MB)` : ""),
        type: f.type || "未知",
        width: img.width,
        height: img.height,
        lastModified: new Date(f.lastModified).toLocaleString("zh-CN"),
      });
    };
    img.src = url;
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-500 hover:underline text-sm">← 返回首页</Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">ℹ️ 图片信息</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {info && (
          <div className="space-y-2 text-sm">
            <img src={preview} alt="preview" className="max-h-48 rounded-lg border mb-4" />
            <p><span className="text-gray-500">文件名:</span> {info.name}</p>
            <p><span className="text-gray-500">格式:</span> {info.type}</p>
            <p><span className="text-gray-500">尺寸:</span> {info.width} × {info.height} px</p>
            <p><span className="text-gray-500">大小:</span> {info.size}</p>
            <p><span className="text-gray-500">修改时间:</span> {info.lastModified}</p>
          </div>
        )}
      </div>
    </main>
  );
}
