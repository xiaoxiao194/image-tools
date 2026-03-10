"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setImgUrl(url);
    const img = new Image();
    img.onload = () => { setImgSize({ w: img.width, h: img.height }); imgRef.current = img; setCrop({ x: 0, y: 0, w: img.width, h: img.height }); };
    img.src = url;
  }, []);

  const doCrop = useCallback(() => {
    if (!imgRef.current) return;
    const c = document.createElement("canvas");
    c.width = crop.w;
    c.height = crop.h;
    c.getContext("2d")!.drawImage(imgRef.current, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [crop]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-500 hover:underline text-sm">← 返回首页</Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">✂️ 图片裁剪</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {imgUrl && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="text-xs text-gray-500">X <input type="number" value={crop.x} onChange={(e) => setCrop({ ...crop, x: +e.target.value })} className="w-full border rounded px-2 py-1 text-sm mt-1" /></label>
              <label className="text-xs text-gray-500">Y <input type="number" value={crop.y} onChange={(e) => setCrop({ ...crop, y: +e.target.value })} className="w-full border rounded px-2 py-1 text-sm mt-1" /></label>
              <label className="text-xs text-gray-500">宽 <input type="number" value={crop.w} onChange={(e) => setCrop({ ...crop, w: +e.target.value })} className="w-full border rounded px-2 py-1 text-sm mt-1" /></label>
              <label className="text-xs text-gray-500">高 <input type="number" value={crop.h} onChange={(e) => setCrop({ ...crop, h: +e.target.value })} className="w-full border rounded px-2 py-1 text-sm mt-1" /></label>
            </div>
            <p className="text-xs text-gray-400">原图: {imgSize.w} × {imgSize.h}</p>
            <img src={imgUrl} alt="preview" className="max-h-64 rounded-lg border" />
            <button onClick={doCrop} className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">裁剪</button>
          </>
        )}
      </div>
      {result && (
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <img src={result} alt="cropped" className="max-h-48 rounded-lg border" />
          <a href={result} download="cropped.png" className="text-blue-600 text-sm font-semibold hover:underline">下载裁剪结果</a>
        </div>
      )}
    </main>
  );
}
