"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import DropZone from "@/components/DropZone";

const shapes = [
  { label: "圆形", value: "circle" },
  { label: "圆角方形", value: "rounded" },
  { label: "圆角小", value: "rounded-sm" },
  { label: "方形", value: "square" },
];

const sizes = [200, 400, 600, 800, 1024];

const borderStyles = [
  { label: "无边框", width: 0, color: "#ffffff" },
  { label: "白色细边", width: 4, color: "#ffffff" },
  { label: "白色粗边", width: 8, color: "#ffffff" },
  { label: "彩虹渐变", width: 6, color: "rainbow" },
];

export default function AvatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [shape, setShape] = useState("circle");
  const [size, setSize] = useState(400);
  const [borderIdx, setBorderIdx] = useState(0);
  const [bgColor, setBgColor] = useState("#f3f4f6");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string | null>(null);

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResult(null);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = URL.createObjectURL(files[0]);
  }, []);

  const renderCanvas = useCallback((targetCanvas: HTMLCanvasElement, sz: number) => {
    if (!imgEl) return;
    const ctx = targetCanvas.getContext("2d")!;
    targetCanvas.width = sz;
    targetCanvas.height = sz;
    const border = borderStyles[borderIdx];
    const bw = border.width * (sz / 400);
    const inner = sz - bw * 2;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, sz, sz);

    // Clip path
    const getClip = (x: number, y: number, s: number) => {
      ctx.beginPath();
      if (shape === "circle") {
        ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
      } else if (shape === "rounded") {
        ctx.roundRect(x, y, s, s, s * 0.2);
      } else if (shape === "rounded-sm") {
        ctx.roundRect(x, y, s, s, s * 0.08);
      } else {
        ctx.rect(x, y, s, s);
      }
    };

    // Border
    if (bw > 0) {
      getClip(0, 0, sz);
      if (border.color === "rainbow") {
        const grad = ctx.createConicGradient(0, sz / 2, sz / 2);
        grad.addColorStop(0, "#ef4444");
        grad.addColorStop(0.17, "#f97316");
        grad.addColorStop(0.33, "#eab308");
        grad.addColorStop(0.5, "#22c55e");
        grad.addColorStop(0.67, "#3b82f6");
        grad.addColorStop(0.83, "#8b5cf6");
        grad.addColorStop(1, "#ef4444");
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = border.color;
      }
      ctx.fill();
    }

    // Image
    ctx.save();
    getClip(bw, bw, inner);
    ctx.clip();

    const imgRatio = imgEl.width / imgEl.height;
    let drawW, drawH;
    if (imgRatio > 1) {
      drawH = inner * zoom;
      drawW = drawH * imgRatio;
    } else {
      drawW = inner * zoom;
      drawH = drawW / imgRatio;
    }
    const dx = bw + (inner - drawW) / 2 + offsetX * inner;
    const dy = bw + (inner - drawH) / 2 + offsetY * inner;
    ctx.drawImage(imgEl, dx, dy, drawW, drawH);
    ctx.restore();
  }, [imgEl, shape, borderIdx, bgColor, zoom, offsetX, offsetY]);

  useEffect(() => {
    if (!canvasRef.current || !imgEl) return;
    renderCanvas(canvasRef.current, Math.min(400, size));
  }, [renderCanvas, imgEl, size]);

  const generate = useCallback(() => {
    if (!imgEl) return;
    const c = document.createElement("canvas");
    renderCanvas(c, size);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, renderCanvas, size]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">圆角头像</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">生成圆形、圆角头像，支持边框和缩放调整</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="flex justify-center" style={{ background: `repeating-conic-gradient(#f3f4f6 0% 25%, white 0% 50%) 50% / 20px 20px` }}>
              <canvas ref={canvasRef} className="max-w-full" style={{ maxHeight: 400 }} />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">形状</p>
              <div className="flex gap-2">
                {shapes.map((s) => (
                  <button key={s.value} onClick={() => setShape(s.value)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${shape === s.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "border-gray-200 dark:border-gray-600 text-gray-500"}`}>{s.label}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">边框</p>
              <div className="flex gap-2">
                {borderStyles.map((b, i) => (
                  <button key={i} onClick={() => setBorderIdx(i)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${borderIdx === i ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "border-gray-200 dark:border-gray-600 text-gray-500"}`}>{b.label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="block">
                <span className="text-xs text-gray-400">输出尺寸</span>
                <select value={size} onChange={(e) => setSize(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-2 py-1.5 text-sm mt-1">
                  {sizes.map((s) => <option key={s} value={s}>{s}×{s}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">缩放 {Math.round(zoom * 100)}%</span>
                <input type="range" min="0.5" max="2" step="0.05" value={zoom} onChange={(e) => setZoom(+e.target.value)} className="w-full accent-indigo-500 mt-2" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">水平偏移</span>
                <input type="range" min="-0.5" max="0.5" step="0.02" value={offsetX} onChange={(e) => setOffsetX(+e.target.value)} className="w-full accent-indigo-500 mt-2" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">垂直偏移</span>
                <input type="range" min="-0.5" max="0.5" step="0.02" value={offsetY} onChange={(e) => setOffsetY(+e.target.value)} className="w-full accent-indigo-500 mt-2" />
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={generate} className="btn-primary flex-1 py-3">生成头像</button>
              <button onClick={() => { setFile(null); setImgEl(null); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900 dark:text-white">生成结果 <span className="text-sm text-gray-400 font-normal ml-2">{size}×{size}</span></p>
          <div className="flex justify-center" style={{ background: `repeating-conic-gradient(#f3f4f6 0% 25%, white 0% 50%) 50% / 20px 20px` }}>
            <img src={result} alt="avatar" className="max-h-64" />
          </div>
          <a href={result} download={`avatar_${size}x${size}.png`} className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
