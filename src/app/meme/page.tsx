"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import DropZone from "@/components/DropZone";

export default function MemePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [style, setStyle] = useState<"overlay" | "caption">("overlay");
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
    const imgW = Math.round(imgEl.width * s);
    const imgH = Math.round(imgEl.height * s);
    const fs = Math.round(fontSize * s);
    const padding = Math.round(fs * 0.8);

    const topH = style === "caption" && topText ? padding * 2 : 0;
    const bottomH = style === "caption" && bottomText ? padding * 2 : 0;

    c.width = imgW;
    c.height = imgH + topH + bottomH;
    const ctx = c.getContext("2d")!;

    // Background for caption style
    if (style === "caption") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, c.width, c.height);
    }

    ctx.drawImage(imgEl, 0, topH, imgW, imgH);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (style === "overlay") {
      ctx.font = `bold ${fs}px Impact, Arial Black, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.round(fs / 12);
      ctx.lineJoin = "round";

      if (topText) {
        ctx.strokeText(topText, c.width / 2, fs * 0.8);
        ctx.fillText(topText, c.width / 2, fs * 0.8);
      }
      if (bottomText) {
        ctx.strokeText(bottomText, c.width / 2, c.height - fs * 0.5);
        ctx.fillText(bottomText, c.width / 2, c.height - fs * 0.5);
      }
    } else {
      ctx.font = `bold ${fs}px sans-serif`;
      ctx.fillStyle = "#000000";
      if (topText) {
        ctx.fillText(topText, c.width / 2, topH / 2);
      }
      if (bottomText) {
        ctx.fillText(bottomText, c.width / 2, topH + imgH + bottomH / 2);
      }
    }
  }, [imgEl, topText, bottomText, fontSize, textColor, strokeColor, bgColor, style]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  const generate = useCallback(() => {
    if (!imgEl) return;
    const c = document.createElement("canvas");
    const fs = fontSize;
    const padding = Math.round(fs * 0.8);
    const topH = style === "caption" && topText ? padding * 2 : 0;
    const bottomH = style === "caption" && bottomText ? padding * 2 : 0;

    c.width = imgEl.width;
    c.height = imgEl.height + topH + bottomH;
    const ctx = c.getContext("2d")!;

    if (style === "caption") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, c.width, c.height);
    }

    ctx.drawImage(imgEl, 0, topH);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (style === "overlay") {
      ctx.font = `bold ${fs}px Impact, Arial Black, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.round(fs / 12);
      ctx.lineJoin = "round";
      if (topText) { ctx.strokeText(topText, c.width / 2, fs * 0.8); ctx.fillText(topText, c.width / 2, fs * 0.8); }
      if (bottomText) { ctx.strokeText(bottomText, c.width / 2, c.height - fs * 0.5); ctx.fillText(bottomText, c.width / 2, c.height - fs * 0.5); }
    } else {
      ctx.font = `bold ${fs}px sans-serif`;
      ctx.fillStyle = "#000000";
      if (topText) ctx.fillText(topText, c.width / 2, topH / 2);
      if (bottomText) ctx.fillText(bottomText, c.width / 2, topH + imgEl.height + bottomH / 2);
    }

    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, topText, bottomText, fontSize, textColor, strokeColor, bgColor, style]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">表情包制作</h1>
        <p className="text-gray-500 mt-2">上传图片，添加上下文字，一秒生成表情包</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex justify-center">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">风格</p>
              <div className="flex gap-2">
                <button onClick={() => setStyle("overlay")} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${style === "overlay" ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500"}`}>经典叠加</button>
                <button onClick={() => setStyle("caption")} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${style === "caption" ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500"}`}>上下字幕</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-gray-400 mb-1 block">上方文字</span>
                <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="在这输入..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400 mb-1 block">下方文字</span>
                <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="在这输入..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="block">
                <span className="text-xs text-gray-400 mb-1 block">字号</span>
                <input type="number" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </label>
              {style === "overlay" ? (
                <>
                  <label className="block">
                    <span className="text-xs text-gray-400 mb-1 block">文字颜色</span>
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-gray-400 mb-1 block">描边颜色</span>
                    <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  </label>
                </>
              ) : (
                <label className="block">
                  <span className="text-xs text-gray-400 mb-1 block">背景色</span>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer" />
                </label>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={generate} className="btn-primary flex-1 py-3">生成表情包</button>
              <button onClick={() => { setFile(null); setImgEl(null); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900">生成结果</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
            <img src={result} alt="meme" className="w-full max-h-72 object-contain" />
          </div>
          <a href={result} download="meme.png" className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
