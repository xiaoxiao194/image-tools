"use client";
import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";

const formats = ["image/png", "image/jpeg", "image/webp"] as const;
const labels: Record<string, string> = { "image/png": "PNG", "image/jpeg": "JPG", "image/webp": "WebP" };

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("image/png");
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);

  const convert = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    const bmp = await createImageBitmap(file);
    const c = document.createElement("canvas");
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext("2d")!.drawImage(bmp, 0, 0);
    const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), target, 0.95));
    const ext = target.split("/")[1] === "jpeg" ? "jpg" : target.split("/")[1];
    setResult({ url: URL.createObjectURL(blob), name: file.name.replace(/\.\w+$/, "") + "." + ext, size: blob.size });
    setProcessing(false);
  }, [file, target]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">格式转换</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">PNG、JPG、WebP 格式自由互转</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <DropZone onFiles={(f) => { setFile(f[0]); setResult(null); }}>
          {file && (
            <div className="space-y-2">
              <p className="text-indigo-600 font-medium">{file.name}</p>
              <p className="text-gray-400 text-sm">{file.type} · {(file.size / 1024).toFixed(1)} KB</p>
            </div>
          )}
        </DropZone>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">目标格式</p>
          <div className="flex gap-3">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => setTarget(f)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${target === f ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                {labels[f]}
              </button>
            ))}
          </div>
        </div>

        <button onClick={convert} disabled={!file || processing} className="btn-primary w-full py-3">
          {processing ? "⏳ 转换中..." : "开始转换"}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm fade-in flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{result.name}</p>
            <p className="text-sm text-gray-400 mt-0.5">{(result.size / 1024).toFixed(1)} KB</p>
          </div>
          <a href={result.url} download={result.name} className="btn-primary">下载</a>
        </div>
      )}
    </main>
  );
}
