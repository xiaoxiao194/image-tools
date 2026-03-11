"use client";
import { useState, useRef, useCallback } from "react";
import DropZone from "@/components/DropZone";

const presets = [
  { label: "自由", w: 0, h: 0 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "16:9", w: 16, h: 9 },
  { label: "3:4", w: 3, h: 4 },
];

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setImgUrl(url);
    const img = new Image();
    img.onload = () => {
      setImgSize({ w: img.width, h: img.height });
      imgRef.current = img;
      setCrop({ x: 0, y: 0, w: img.width, h: img.height });
    };
    img.src = url;
  }, []);

  const applyPreset = (pw: number, ph: number) => {
    if (!pw || !ph) { setCrop({ x: 0, y: 0, w: imgSize.w, h: imgSize.h }); return; }
    const ratio = pw / ph;
    let w = imgSize.w, h = Math.round(w / ratio);
    if (h > imgSize.h) { h = imgSize.h; w = Math.round(h * ratio); }
    setCrop({ x: Math.round((imgSize.w - w) / 2), y: Math.round((imgSize.h - h) / 2), w, h });
  };

  const doCrop = useCallback(() => {
    if (!imgRef.current) return;
    const c = document.createElement("canvas");
    c.width = crop.w;
    c.height = crop.h;
    c.getContext("2d")!.drawImage(imgRef.current, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [crop]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">图片裁剪</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">精确裁剪，自定义区域和比例</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="relative">
              <img src={imgUrl} alt="preview" className="w-full rounded-xl border border-gray-200 dark:border-gray-600" />
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {imgSize.w} × {imgSize.h}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">比例预设</p>
              <div className="flex gap-2 flex-wrap">
                {presets.map((p) => (
                  <button key={p.label} onClick={() => applyPreset(p.w, p.h)} className="px-4 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600 transition-colors">{p.label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "X", key: "x" as const },
                { label: "Y", key: "y" as const },
                { label: "宽", key: "w" as const },
                { label: "高", key: "h" as const },
              ].map((f) => (
                <label key={f.key} className="block">
                  <span className="text-xs text-gray-400 mb-1 block">{f.label}</span>
                  <input type="number" value={crop[f.key]} onChange={(e) => setCrop({ ...crop, [f.key]: +e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={doCrop} className="btn-primary flex-1 py-3">裁剪</button>
              <button onClick={() => { setFile(null); setImgUrl(""); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900 dark:text-white">裁剪结果 <span className="text-sm text-gray-400 font-normal ml-2">{crop.w} × {crop.h}</span></p>
          <img src={result} alt="cropped" className="max-h-64 rounded-xl border border-gray-200 dark:border-gray-600" />
          <a href={result} download="cropped.png" className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
