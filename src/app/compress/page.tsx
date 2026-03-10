"use client";
import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; original: number; compressed: number; url: string }[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);

  const compress = useCallback(async () => {
    setProcessing(true);
    const out: typeof results = [];
    for (const file of files) {
      const bmp = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bmp.width;
      canvas.height = bmp.height;
      canvas.getContext("2d")!.drawImage(bmp, 0, 0);
      const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", quality));
      out.push({ name: file.name, original: file.size, compressed: blob.size, url: URL.createObjectURL(blob) });
    }
    setResults(out);
    setProcessing(false);
  }, [files, quality]);

  const fmt = (n: number) => n > 1048576 ? (n / 1048576).toFixed(2) + " MB" : (n / 1024).toFixed(1) + " KB";
  const totalSaved = results.reduce((s, r) => s + r.original - r.compressed, 0);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">图片压缩</h1>
        <p className="text-gray-500 mt-2">智能压缩图片体积，保持高画质</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <DropZone onFiles={(f) => { setFiles(f); setResults([]); }} multiple>
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-indigo-600 font-medium">已选择 {files.length} 个文件</p>
              <p className="text-gray-400 text-sm">点击重新选择或拖拽替换</p>
            </div>
          )}
        </DropZone>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 w-20">质量</span>
          <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(+e.target.value)} className="flex-1 accent-indigo-500" />
          <span className="text-sm font-semibold text-indigo-600 w-12 text-right">{Math.round(quality * 100)}%</span>
        </div>

        <button onClick={compress} disabled={!files.length || processing} className="btn-primary w-full py-3">
          {processing ? "⏳ 压缩中..." : "开始压缩"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-8 fade-in">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-5 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">总共节省</p>
              <p className="text-2xl font-bold">{fmt(totalSaved)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">平均压缩率</p>
              <p className="text-2xl font-bold">{Math.round((totalSaved / results.reduce((s, r) => s + r.original, 0)) * 100)}%</p>
            </div>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmt(r.original)} → {fmt(r.compressed)}<span className="text-green-500 font-medium ml-2">-{Math.round((1 - r.compressed / r.original) * 100)}%</span></p>
                </div>
                <a href={r.url} download={r.name.replace(/\.\w+$/, "") + "_compressed.jpg"} className="btn-primary text-xs px-4 py-1.5">下载</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
