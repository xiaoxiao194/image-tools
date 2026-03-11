"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import DropZone from "@/components/DropZone";

export default function RemoveWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painting, setPainting] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [mask, setMask] = useState<ImageData | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scale, setScale] = useState(1);

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResult(null);
    const url = URL.createObjectURL(files[0]);
    setImgUrl(url);
    const img = new Image();
    img.onload = () => {
      setImgEl(img);
    };
    img.src = url;
  }, []);

  useEffect(() => {
    if (!imgEl || !canvasRef.current || !maskCanvasRef.current) return;
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    // Scale to fit container (max 640px wide)
    const maxW = 640;
    const s = imgEl.width > maxW ? maxW / imgEl.width : 1;
    setScale(s);
    canvas.width = Math.round(imgEl.width * s);
    canvas.height = Math.round(imgEl.height * s);
    maskCanvas.width = imgEl.width;
    maskCanvas.height = imgEl.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    // Clear mask
    const mctx = maskCanvas.getContext("2d")!;
    mctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  }, [imgEl]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!painting || !canvasRef.current || !maskCanvasRef.current) return;
    const pos = getPos(e);
    // Draw on visible canvas (red overlay)
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Draw on mask canvas (actual coordinates)
    const mctx = maskCanvasRef.current.getContext("2d")!;
    mctx.fillStyle = "#ffffff";
    mctx.beginPath();
    mctx.arc(pos.x / scale, pos.y / scale, brushSize / 2 / scale, 0, Math.PI * 2);
    mctx.fill();
  }, [painting, brushSize, scale]);

  const processWatermark = useCallback(async () => {
    if (!imgEl || !maskCanvasRef.current) return;
    setProcessing(true);

    const w = imgEl.width;
    const h = imgEl.height;

    // Get original image data
    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = w;
    srcCanvas.height = h;
    const srcCtx = srcCanvas.getContext("2d")!;
    srcCtx.drawImage(imgEl, 0, 0);
    const srcData = srcCtx.getImageData(0, 0, w, h);

    // Get mask data
    const maskCtx = maskCanvasRef.current.getContext("2d")!;
    const maskData = maskCtx.getImageData(0, 0, w, h);

    // Inpainting: for each masked pixel, average surrounding non-masked pixels
    const outData = srcCtx.createImageData(w, h);
    outData.data.set(srcData.data);

    const isMasked = (x: number, y: number) => {
      const i = (y * w + x) * 4;
      return maskData.data[i] > 128;
    };

    // Multi-pass inpainting (expand from edges)
    const maxPasses = 50;
    let remaining = true;
    const filled = new Uint8Array(w * h);

    // Mark non-masked as filled
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!isMasked(x, y)) filled[y * w + x] = 1;
      }
    }

    for (let pass = 0; pass < maxPasses && remaining; pass++) {
      remaining = false;
      const newFilled: [number, number, number, number, number][] = [];

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (filled[y * w + x]) continue;
          // Check neighbors
          let r = 0, g = 0, b = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx, ny = y + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h && filled[ny * w + nx]) {
                const i = (ny * w + nx) * 4;
                r += outData.data[i];
                g += outData.data[i + 1];
                b += outData.data[i + 2];
                count++;
              }
            }
          }
          if (count > 0) {
            newFilled.push([x, y, Math.round(r / count), Math.round(g / count), Math.round(b / count)]);
          } else {
            remaining = true;
          }
        }
      }

      for (const [x, y, r, g, b] of newFilled) {
        const i = (y * w + x) * 4;
        outData.data[i] = r;
        outData.data[i + 1] = g;
        outData.data[i + 2] = b;
        outData.data[i + 3] = 255;
        filled[y * w + x] = 1;
      }
    }

    const outCanvas = document.createElement("canvas");
    outCanvas.width = w;
    outCanvas.height = h;
    outCanvas.getContext("2d")!.putImageData(outData, 0, 0);
    outCanvas.toBlob((b) => {
      if (b) setResult(URL.createObjectURL(b));
      setProcessing(false);
    }, "image/png");
  }, [imgEl]);

  const redrawCanvas = useCallback(() => {
    if (!imgEl || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0, canvasRef.current.width, canvasRef.current.height);
    // Redraw mask overlay
    if (maskCanvasRef.current) {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(maskCanvasRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.globalAlpha = 1;
    }
  }, [imgEl]);

  const clearMask = useCallback(() => {
    if (!maskCanvasRef.current || !imgEl || !canvasRef.current) return;
    const mctx = maskCanvasRef.current.getContext("2d")!;
    mctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [imgEl]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">去水印</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">涂抹标记水印区域，智能填充修复</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">用鼠标涂抹水印区域（红色标记）</p>
                <button onClick={clearMask} className="text-sm text-indigo-600 hover:underline">清除标记</button>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="cursor-crosshair"
                  onMouseDown={(e) => { setPainting(true); draw(e); }}
                  onMouseMove={draw}
                  onMouseUp={() => setPainting(false)}
                  onMouseLeave={() => setPainting(false)}
                />
              </div>
              <canvas ref={maskCanvasRef} className="hidden" />

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 w-16">画笔</span>
                <input type="range" min="5" max="80" value={brushSize} onChange={(e) => setBrushSize(+e.target.value)} className="flex-1 accent-indigo-500" />
                <span className="text-sm font-semibold text-indigo-600 w-12 text-right">{brushSize}px</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={processWatermark} disabled={processing} className="btn-primary flex-1 py-3">
                {processing ? "⏳ 处理中..." : "✨ 去除水印"}
              </button>
              <button onClick={() => { setFile(null); setImgUrl(""); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900 dark:text-white">处理结果</p>
          <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50">
            <img src={result} alt="result" className="w-full max-h-72 object-contain" />
          </div>
          <a href={result} download="no_watermark.png" className="btn-primary inline-block">下载</a>
        </div>
      )}

      <div className="mt-6 bg-indigo-50 rounded-2xl p-5 text-sm text-indigo-700 space-y-1">
        <p className="font-semibold">💡 使用技巧</p>
        <p>• 用鼠标在水印区域涂抹，尽量只覆盖水印部分</p>
        <p>• 适合去除简单文字水印，纯色/渐变背景效果最佳</p>
        <p>• 复杂纹理背景上的水印可能需要多次处理</p>
      </div>
    </main>
  );
}
