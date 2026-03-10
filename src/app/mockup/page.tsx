"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import DropZone from "@/components/DropZone";

const frames = [
  { label: "无边框", value: "none" },
  { label: "浏览器", value: "browser" },
  { label: "手机", value: "phone" },
];

const backgrounds = [
  { label: "渐变紫蓝", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", css: "bg-gradient-to-br from-indigo-400 to-purple-600" },
  { label: "渐变粉橙", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)", css: "bg-gradient-to-br from-pink-400 to-orange-400" },
  { label: "渐变青绿", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", css: "bg-gradient-to-br from-green-400 to-teal-300" },
  { label: "渐变暗蓝", value: "linear-gradient(135deg, #0c3483 0%, #a2b6df 50%, #6b8cce 100%)", css: "bg-gradient-to-br from-blue-900 to-blue-300" },
  { label: "纯白", value: "#ffffff", css: "bg-white" },
  { label: "纯黑", value: "#000000", css: "bg-black" },
];

export default function MockupPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [frame, setFrame] = useState("browser");
  const [bg, setBg] = useState(0);
  const [padding, setPadding] = useState(60);
  const [shadow, setShadow] = useState(true);
  const [rounded, setRounded] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string | null>(null);

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResult(null);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = URL.createObjectURL(files[0]);
  }, []);

  const render = useCallback((targetCanvas: HTMLCanvasElement, scale: number) => {
    if (!imgEl) return;
    const ctx = targetCanvas.getContext("2d")!;
    const p = padding * scale;
    const r = rounded * scale;
    const barH = frame === "browser" ? 36 * scale : frame === "phone" ? 28 * scale : 0;
    const frameP = frame !== "none" ? 3 * scale : 0;

    const imgW = imgEl.width * scale;
    const imgH = imgEl.height * scale;
    const totalW = imgW + p * 2 + frameP * 2;
    const totalH = imgH + p * 2 + barH + frameP * 2;

    targetCanvas.width = totalW;
    targetCanvas.height = totalH;

    // Background
    const bgVal = backgrounds[bg].value;
    if (bgVal.startsWith("linear-gradient")) {
      const grad = ctx.createLinearGradient(0, 0, totalW, totalH);
      // Parse gradient colors simply
      const colors = bgVal.match(/#[0-9a-f]{6}/gi) || ["#667eea", "#764ba2"];
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bgVal;
    }
    ctx.fillRect(0, 0, totalW, totalH);

    const frameX = p;
    const frameY = p;
    const frameW = imgW + frameP * 2;
    const frameH = imgH + barH + frameP * 2;

    // Shadow
    if (shadow) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 40 * scale;
      ctx.shadowOffsetY = 10 * scale;
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, frameH, r);
      ctx.fillStyle = "rgba(0,0,0,0.01)";
      ctx.fill();
      ctx.restore();
    }

    // Frame background
    if (frame !== "none") {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, frameH, r);
      ctx.clip();
      ctx.fillStyle = frame === "browser" ? "#e5e7eb" : "#1a1a1a";
      ctx.fillRect(frameX, frameY, frameW, frameH);

      // Top bar
      if (frame === "browser") {
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(frameX, frameY, frameW, barH);
        // Dots
        const dotY = frameY + barH / 2;
        const dotR = 5 * scale;
        [["#ef4444", 0], ["#eab308", 1], ["#22c55e", 2]].forEach(([color, i]) => {
          ctx.beginPath();
          ctx.arc(frameX + 16 * scale + (i as number) * 18 * scale, dotY, dotR, 0, Math.PI * 2);
          ctx.fillStyle = color as string;
          ctx.fill();
        });
        // URL bar
        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.roundRect(frameX + 80 * scale, dotY - 10 * scale, frameW - 160 * scale, 20 * scale, 10 * scale);
        ctx.fill();
      } else if (frame === "phone") {
        ctx.fillStyle = "#2a2a2a";
        ctx.fillRect(frameX, frameY, frameW, barH);
        // Notch
        const notchW = 80 * scale;
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.roundRect(frameX + (frameW - notchW) / 2, frameY, notchW, 18 * scale, [0, 0, 8 * scale, 8 * scale]);
        ctx.fill();
      }

      ctx.restore();
    }

    // Image
    const imgX = frameX + frameP;
    const imgY = frameY + barH + frameP;

    if (frame === "none" && r > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, r);
      ctx.clip();
    }
    ctx.drawImage(imgEl, imgX, imgY, imgW, imgH);
    if (frame === "none" && r > 0) ctx.restore();
  }, [imgEl, frame, bg, padding, shadow, rounded]);

  useEffect(() => {
    if (!canvasRef.current || !imgEl) return;
    const maxW = 640;
    const s = imgEl.width > maxW - padding * 2 ? (maxW - padding * 2) / imgEl.width : 1;
    render(canvasRef.current, s);
  }, [render, imgEl, padding]);

  const generate = useCallback(() => {
    if (!imgEl) return;
    const c = document.createElement("canvas");
    render(c, 1);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, render]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">截图美化</h1>
        <p className="text-gray-500 mt-2">添加设备边框、阴影和渐变背景，让截图更专业</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex justify-center p-2">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">设备边框</p>
                <div className="flex gap-2">
                  {frames.map((f) => (
                    <button key={f.value} onClick={() => setFrame(f.value)} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${frame === f.value ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500"}`}>{f.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">背景</p>
                <div className="flex gap-2">
                  {backgrounds.map((b, i) => (
                    <button key={i} onClick={() => setBg(i)} className={`w-10 h-10 rounded-lg border-2 transition-all ${bg === i ? "border-indigo-500 scale-110" : "border-gray-200"} ${b.css}`} title={b.label} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="text-xs text-gray-400 mb-1 block">内边距 {padding}px</span>
                  <input type="range" min="20" max="120" value={padding} onChange={(e) => setPadding(+e.target.value)} className="w-full accent-indigo-500" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400 mb-1 block">圆角 {rounded}px</span>
                  <input type="range" min="0" max="30" value={rounded} onChange={(e) => setRounded(+e.target.value)} className="w-full accent-indigo-500" />
                </label>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} className="accent-indigo-500" />
                  <span className="text-sm text-gray-600">阴影</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={generate} className="btn-primary flex-1 py-3">生成美化图</button>
              <button onClick={() => { setFile(null); setImgEl(null); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900">美化结果</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <img src={result} alt="mockup" className="w-full object-contain" />
          </div>
          <a href={result} download="mockup.png" className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
