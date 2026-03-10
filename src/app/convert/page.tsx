"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

const formats = ["image/png", "image/jpeg", "image/webp"];
const labels: Record<string, string> = { "image/png": "PNG", "image/jpeg": "JPG", "image/webp": "WebP" };

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("image/png");
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);

  const convert = useCallback(async () => {
    if (!file) return;
    const bmp = await createImageBitmap(file);
    const c = document.createElement("canvas");
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext("2d")!.drawImage(bmp, 0, 0);
    const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), target, 0.95));
    const ext = target.split("/")[1] === "jpeg" ? "jpg" : target.split("/")[1];
    setResult({ url: URL.createObjectURL(blob), name: file.name.replace(/\.\w+$/, "") + "." + ext });
  }, [file, target]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-500 hover:underline text-sm">← 返回首页</Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">🔄 格式转换</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <input type="file" accept="image/*" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); }} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <div className="flex gap-2">
          {formats.map((f) => (
            <button key={f} onClick={() => setTarget(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${target === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>{labels[f]}</button>
          ))}
        </div>
        <button onClick={convert} disabled={!file} className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors">转换</button>
      </div>
      {result && (
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="font-medium text-sm">{result.name}</p>
          <a href={result.url} download={result.name} className="text-blue-600 text-sm font-semibold hover:underline">下载</a>
        </div>
      )}
    </main>
  );
}
