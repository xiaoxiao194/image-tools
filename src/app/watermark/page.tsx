"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import DropZone from "@/components/DropZone";

type Position = "tile" | "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("PixelKit");
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>("tile");
  const [rotation, setRotation] = useState(-30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string | null>(null);

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResult(null);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = URL.createObjectURL(files[0]);
  }, []);

  const renderPreview = useCallback(() => {
    if (!imgEl || !canvasRef.current) return;
    const c = canvasRef.current;
    const maxW = 640;
    const s = imgEl.width > maxW ? maxW / imgEl.width : 1;
    c.width = Math.round(imgEl.width * s);
    c.height = Math.round(imgEl.height * s);
    const ctx = c.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0, c.width, c.height);

    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `${Math.round(fontSize * s)}px sans-serif`;
    ctx.textBaseline = "middle";

    if (position === "tile") {
      const stepX = Math.round(fontSize * s * 6);
      const stepY = Math.round(fontSize * s * 3);
      ctx.save();
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      for (let y = -c.height; y < c.height * 2; y += stepY) {
        for (let x = -c.width; x < c.width * 2; x += stepX) {
          ctx.fillText(text, x - c.width, y - c.height);
        }
      }
      ctx.restore();
    } else {
      const m = Math.round(20 * s);
      const tw = ctx.measureText(text).width;
      let x = m, y = m + fontSize * s / 2;
      if (position === "center") { x = (c.width - tw) / 2; y = c.height / 2; }
      else if (position === "bottom-right") { x = c.width - tw - m; y = c.height - m; }
      else if (position === "bottom-left") { x = m; y = c.height - m; }
      else if (position === "top-right") { x = c.width - tw - m; y = m + fontSize * s / 2; }
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
  }, [imgEl, text, fontSize, color, opacity, position, rotation]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  const generate = useCallback(() => {
    if (!imgEl) return;
    const c = document.createElement("canvas");
    c.width = imgEl.width;
    c.height = imgEl.height;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0);

    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textBaseline = "middle";

    if (position === "tile") {
      const stepX = fontSize * 6;
      const stepY = fontSize * 3;
      ctx.save();
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      for (let y = -c.height; y < c.height * 2; y += stepY) {
        for (let x = -c.width; x < c.width * 2; x += stepX) {
          ctx.fillText(text, x - c.width, y - c.height);
        }
      }
      ctx.restore();
    } else {
      const m = 20;
      const tw = ctx.measureText(text).width;
      let x = m, y = m + fontSize / 2;
      if (position === "center") { x = (c.width - tw) / 2; y = c.height / 2; }
      else if (position === "bottom-right") { x = c.width - tw - m; y = c.height - m; }
      else if (position === "bottom-left") { x = m; y = c.height - m; }
      else if (position === "top-right") { x = c.width - tw - m; y = m + fontSize / 2; }
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, text, fontSize, color, opacity, position, rotation]);

  const positions: { label: string; value: Position }[] = [
    { label: "平铺", value: "tile" },
    { label: "居中", value: "center" },
    { label: "左上", value: "top-left" },
    { label: "右上", value: "top-right" },
    { label: "左下", value: "bottom-left" },
    { label: "右下", value: "bottom-right" },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">加水印</h1>
        <p className="text-gray-500 mt-2">添加文字水印，支持平铺、定位、透明度调节</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex justify-center">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs text-gray-400 mb-1 block">水印文字</span>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-400 mb-1 block">字号</span>
                  <input type="number" min="10" max="200" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400 mb-1 block">颜色</span>
                  <div className="flex items-center gap-2">
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400 mb-1 block">透明度 {Math.round(opacity * 100)}%</span>
                  <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-indigo-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400 mb-1 block">旋转 {rotation}°</span>
                  <input type="range" min="-90" max="90" value={rotation} onChange={(e) => setRotation(+e.target.value)} className="w-full accent-indigo-500" />
                </label>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">位置</p>
                <div className="flex gap-2 flex-wrap">
                  {positions.map((p) => (
                    <button key={p.value} onClick={() => setPosition(p.value)} className={`px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${position === p.value ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>{p.label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={generate} className="btn-primary flex-1 py-3">生成水印图片</button>
              <button onClick={() => { setFile(null); setImgEl(null); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900">生成结果</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <img src={result} alt="watermarked" className="w-full max-h-72 object-contain" />
          </div>
          <a href={result} download="watermarked.png" className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
