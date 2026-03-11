"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import DropZone from "@/components/DropZone";

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string | null>(null);

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResult(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = URL.createObjectURL(files[0]);
  }, []);

  const renderCanvas = useCallback((targetCanvas: HTMLCanvasElement, scale: number) => {
    if (!imgEl) return;
    const ctx = targetCanvas.getContext("2d")!;
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const w = imgEl.width * scale;
    const h = imgEl.height * scale;
    const newW = Math.round(w * cos + h * sin);
    const newH = Math.round(w * sin + h * cos);

    targetCanvas.width = newW;
    targetCanvas.height = newH;

    ctx.translate(newW / 2, newH / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imgEl, -w / 2, -h / 2, w, h);
  }, [imgEl, rotation, flipH, flipV]);

  useEffect(() => {
    if (!canvasRef.current || !imgEl) return;
    const maxW = 500;
    const s = imgEl.width > maxW ? maxW / imgEl.width : 1;
    renderCanvas(canvasRef.current, s);
  }, [renderCanvas, imgEl]);

  const generate = useCallback(() => {
    if (!imgEl) return;
    const c = document.createElement("canvas");
    renderCanvas(c, 1);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, renderCanvas]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">旋转翻转</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">旋转任意角度，水平/垂直翻转</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900 flex justify-center p-4">
              <canvas ref={canvasRef} className="max-w-full max-h-72" />
            </div>

            {/* Quick rotate */}
            <div>
              <p className="text-xs text-gray-400 mb-2">快速旋转</p>
              <div className="flex gap-2">
                {[
                  { label: "↶ 左转90°", r: -90 },
                  { label: "↷ 右转90°", r: 90 },
                  { label: "180°", r: 180 },
                  { label: "复位", r: 0, reset: true },
                ].map((btn) => (
                  <button key={btn.label} onClick={() => setRotation((btn as any).reset ? 0 : (rotation + btn.r) % 360)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600 transition-colors">{btn.label}</button>
                ))}
              </div>
            </div>

            {/* Custom rotation */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-20">角度</span>
              <input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(+e.target.value)} className="flex-1 accent-indigo-500" />
              <input type="number" value={rotation} onChange={(e) => setRotation(+e.target.value)} className="w-20 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-2 py-1 text-sm text-center" />
            </div>

            {/* Flip */}
            <div>
              <p className="text-xs text-gray-400 mb-2">翻转</p>
              <div className="flex gap-2">
                <button onClick={() => setFlipH(!flipH)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${flipH ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "border-gray-200 dark:border-gray-600 text-gray-500"}`}>
                  ↔ 水平翻转
                </button>
                <button onClick={() => setFlipV(!flipV)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${flipV ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "border-gray-200 dark:border-gray-600 text-gray-500"}`}>
                  ↕ 垂直翻转
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={generate} className="btn-primary flex-1 py-3">导出</button>
              <button onClick={() => { setFile(null); setImgEl(null); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900 dark:text-white">导出结果</p>
          <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900">
            <img src={result} alt="rotated" className="w-full max-h-72 object-contain" />
          </div>
          <a href={result} download="rotated.png" className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
