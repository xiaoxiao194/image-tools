"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; original: number; compressed: number; url: string }[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
    setResults([]);
  }, []);

  const compress = useCallback(async () => {
    setProcessing(true);
    const out: typeof results = [];
    for (const file of files) {
      const img = new Image();
      const bmp = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bmp.width;
      canvas.height = bmp.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bmp, 0, 0);
      const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", quality));
      out.push({ name: file.name, original: file.size, compressed: blob.size, url: URL.createObjectURL(blob) });
    }
    setResults(out);
    setProcessing(false);
  }, [files, quality]);

  const fmt = (n: number) => (n / 1024).toFixed(1) + " KB";

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-500 hover:underline text-sm">← 返回首页</Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">📦 图片压缩</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">质量: {Math.round(quality * 100)}%</label>
          <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(+e.target.value)} className="flex-1" />
        </div>

        <button onClick={compress} disabled={!files.length || processing} className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors">
          {processing ? "压缩中..." : "开始压缩"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-xs text-gray-500">{fmt(r.original)} → {fmt(r.compressed)}（节省 {Math.round((1 - r.compressed / r.original) * 100)}%）</p>
              </div>
              <a href={r.url} download={r.name.replace(/\.\w+$/, "") + "_compressed.jpg"} className="text-blue-600 text-sm font-semibold hover:underline">下载</a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
