"use client";
import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";

const presets = [
  { label: "自定义", w: 0, h: 0 },
  { label: "1080p", w: 1920, h: 1080 },
  { label: "720p", w: 1280, h: 720 },
  { label: "公众号封面", w: 900, h: 383 },
  { label: "头像 400×400", w: 400, h: 400 },
];

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    setFile(f);
    setResult(null);
    const img = new Image();
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setW(img.width); setH(img.height); setImgEl(img); };
    img.src = URL.createObjectURL(f);
  }, []);

  const changeW = (nw: number) => { setW(nw); if (lock && origW) setH(Math.round((nw / origW) * origH)); };
  const changeH = (nh: number) => { setH(nh); if (lock && origH) setW(Math.round((nh / origH) * origW)); };

  const resize = useCallback(() => {
    if (!imgEl) return;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.drawImage(imgEl, 0, 0, w, h);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, w, h]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">图片缩放</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">按尺寸或比例等比缩放</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg">🖼</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{origW} × {origH} · {(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => { setFile(null); setResult(null); }} className="text-gray-400 hover:text-gray-600 text-sm">更换</button>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">常用尺寸</p>
              <div className="flex gap-2 flex-wrap">
                {presets.map((p) => (
                  <button key={p.label} onClick={() => { if (p.w) { setW(p.w); setH(p.h); setLock(false); } else { setW(origW); setH(origH); setLock(true); } }} className="px-4 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600 transition-colors">{p.label}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex-1">
                <span className="text-xs text-gray-400 block mb-1">宽度 (px)</span>
                <input type="number" value={w} onChange={(e) => changeW(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </label>
              <button onClick={() => setLock(!lock)} className="mt-5 w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title={lock ? "等比锁定" : "自由缩放"}>
                {lock ? "🔗" : "🔓"}
              </button>
              <label className="flex-1">
                <span className="text-xs text-gray-400 block mb-1">高度 (px)</span>
                <input type="number" value={h} onChange={(e) => changeH(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </label>
            </div>

            <button onClick={resize} className="btn-primary w-full py-3">缩放</button>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900 dark:text-white">缩放结果 <span className="text-sm text-gray-400 font-normal ml-2">{w} × {h}</span></p>
          <img src={result} alt="resized" className="max-h-48 rounded-xl border border-gray-200 dark:border-gray-600" />
          <a href={result} download="resized.png" className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
