"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
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
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-500 hover:underline text-sm">← 返回首页</Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">🔍 图片缩放</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {file && (
          <>
            <p className="text-xs text-gray-400">原始: {origW} × {origH}</p>
            <div className="flex items-center gap-3">
              <label className="text-sm">宽 <input type="number" value={w} onChange={(e) => changeW(+e.target.value)} className="w-24 border rounded px-2 py-1 text-sm ml-1" /></label>
              <button onClick={() => setLock(!lock)} className="text-lg">{lock ? "🔗" : "🔓"}</button>
              <label className="text-sm">高 <input type="number" value={h} onChange={(e) => changeH(+e.target.value)} className="w-24 border rounded px-2 py-1 text-sm ml-1" /></label>
            </div>
            <button onClick={resize} className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">缩放</button>
          </>
        )}
      </div>
      {result && (
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <img src={result} alt="resized" className="max-h-48 rounded-lg border" />
          <a href={result} download="resized.png" className="text-blue-600 text-sm font-semibold hover:underline">下载</a>
        </div>
      )}
    </main>
  );
}
