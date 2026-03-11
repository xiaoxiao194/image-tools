"use client";
import { useState, useCallback, useRef } from "react";
import DropZone from "@/components/DropZone";

interface Result {
  name: string;
  original: number;
  compressed: number;
  origUrl: string;
  url: string;
}

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);
  const [compareIdx, setCompareIdx] = useState<number | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const compareRef = useRef<HTMLDivElement>(null);

  const compress = useCallback(async () => {
    setProcessing(true);
    const out: Result[] = [];
    for (const file of files) {
      const bmp = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bmp.width;
      canvas.height = bmp.height;
      canvas.getContext("2d")!.drawImage(bmp, 0, 0);
      const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", quality));
      out.push({
        name: file.name,
        original: file.size,
        compressed: blob.size,
        origUrl: URL.createObjectURL(file),
        url: URL.createObjectURL(blob),
      });
    }
    setResults(out);
    setProcessing(false);
  }, [files, quality]);

  const downloadZip = useCallback(async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const r of results) {
      const resp = await fetch(r.url);
      const blob = await resp.blob();
      zip.file(r.name.replace(/\.\w+$/, "") + "_compressed.jpg", blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "compressed_images.zip";
    a.click();
  }, [results]);

  const downloadAll = useCallback(() => {
    for (const r of results) {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name.replace(/\.\w+$/, "") + "_compressed.jpg";
      a.click();
    }
  }, [results]);

  const fmt = (n: number) => n > 1048576 ? (n / 1048576).toFixed(2) + " MB" : (n / 1024).toFixed(1) + " KB";
  const totalSaved = results.reduce((s, r) => s + r.original - r.compressed, 0);
  const totalOrig = results.reduce((s, r) => s + r.original, 0);

  const handleCompareMove = (e: React.MouseEvent) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    setSliderPos(((e.clientX - rect.left) / rect.width) * 100);
  };

  const compareResult = compareIdx !== null ? results[compareIdx] : null;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">图片压缩</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">智能压缩图片体积，保持高画质</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <DropZone onFiles={(f) => { setFiles(f); setResults([]); setCompareIdx(null); }} multiple>
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-indigo-600 font-medium">已选择 {files.length} 个文件</p>
              <p className="text-gray-400 text-sm">点击重新选择或拖拽替换</p>
            </div>
          )}
        </DropZone>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 w-20">质量</span>
          <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(+e.target.value)} className="flex-1 accent-indigo-500" />
          <span className="text-sm font-semibold text-indigo-600 w-12 text-right">{Math.round(quality * 100)}%</span>
        </div>

        <button onClick={compress} disabled={!files.length || processing} className="btn-primary w-full py-3">
          {processing ? "⏳ 压缩中..." : "开始压缩"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-8 fade-in space-y-4">
          {/* Stats */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">总共节省</p>
              <p className="text-2xl font-bold">{fmt(totalSaved)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80">平均压缩率</p>
              <p className="text-2xl font-bold">{totalOrig > 0 ? Math.round((totalSaved / totalOrig) * 100) : 0}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">{results.length} 张图片</p>
              <div className="flex gap-2 mt-1">
                <button onClick={downloadZip} className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full transition-colors">ZIP 打包下载</button>
              </div>
            </div>
          </div>

          {/* Compare viewer */}
          {compareResult && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">对比预览 — {compareResult.name}</p>
                <button onClick={() => setCompareIdx(null)} className="text-xs text-gray-400 hover:text-gray-600">关闭</button>
              </div>
              <div
                ref={compareRef}
                className="relative rounded-xl overflow-hidden cursor-col-resize select-none h-72"
                onMouseMove={handleCompareMove}
              >
                {/* Compressed (full) */}
                <img src={compareResult.url} alt="compressed" className="absolute inset-0 w-full h-full object-contain" />
                {/* Original (clipped) */}
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                  <img src={compareResult.origUrl} alt="original" className="w-full h-full object-contain" style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }} />
                </div>
                {/* Slider line */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${sliderPos}%` }}>
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M8 15l4 4 4-4" /></svg>
                  </div>
                </div>
                {/* Labels */}
                <span className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">原图 {fmt(compareResult.original)}</span>
                <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">压缩后 {fmt(compareResult.compressed)}</span>
              </div>
            </div>
          )}

          {/* Results list */}
          <div className="space-y-3">
            {results.map((r, i) => {
              const pct = Math.round((1 - r.compressed / r.original) * 100);
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{r.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fmt(r.original)} → {fmt(r.compressed)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button onClick={() => { setCompareIdx(i); setSliderPos(50); }} className="text-xs text-indigo-600 hover:underline">对比</button>
                      <a href={r.url} download={r.name.replace(/\.\w+$/, "") + "_compressed.jpg"} className="btn-primary text-xs px-4 py-1.5">下载</a>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all" style={{ width: `${100 - pct}%` }}></div>
                  </div>
                  <p className="text-xs text-green-500 font-medium mt-1">节省 {pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
