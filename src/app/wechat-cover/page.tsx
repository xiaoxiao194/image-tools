"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import DropZone from "@/components/DropZone";

const covers = [
  { label: "公众号首图", w: 900, h: 383, desc: "2.35:1" },
  { label: "公众号次图", w: 500, h: 500, desc: "1:1" },
  { label: "公众号文章内图", w: 1080, h: 720, desc: "3:2" },
];

export default function WechatCoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [selected, setSelected] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [mode, setMode] = useState<"cover" | "contain">("cover");
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
    const spec = covers[selected];
    const scale = Math.min(640 / spec.w, 400 / spec.h);
    c.width = Math.round(spec.w * scale);
    c.height = Math.round(spec.h * scale);
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, c.width, c.height);

    const imgRatio = imgEl.width / imgEl.height;
    const canvasRatio = c.width / c.height;
    let sx = 0, sy = 0, sw = imgEl.width, sh = imgEl.height;
    let dx = 0, dy = 0, dw = c.width, dh = c.height;

    if (mode === "cover") {
      if (imgRatio > canvasRatio) {
        sw = imgEl.height * canvasRatio;
        sx = (imgEl.width - sw) / 2;
      } else {
        sh = imgEl.width / canvasRatio;
        sy = (imgEl.height - sh) / 2;
      }
    } else {
      if (imgRatio > canvasRatio) {
        dh = c.width / imgRatio;
        dy = (c.height - dh) / 2;
      } else {
        dw = c.height * imgRatio;
        dx = (c.width - dw) / 2;
      }
      sx = 0; sy = 0; sw = imgEl.width; sh = imgEl.height;
    }

    ctx.drawImage(imgEl, sx, sy, sw, sh, dx, dy, dw, dh);
  }, [imgEl, selected, bgColor, mode]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  const generate = useCallback(() => {
    if (!imgEl) return;
    const spec = covers[selected];
    const c = document.createElement("canvas");
    c.width = spec.w;
    c.height = spec.h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, c.width, c.height);

    const imgRatio = imgEl.width / imgEl.height;
    const canvasRatio = c.width / c.height;
    let sx = 0, sy = 0, sw = imgEl.width, sh = imgEl.height;
    let dx = 0, dy = 0, dw = c.width, dh = c.height;

    if (mode === "cover") {
      if (imgRatio > canvasRatio) { sw = imgEl.height * canvasRatio; sx = (imgEl.width - sw) / 2; }
      else { sh = imgEl.width / canvasRatio; sy = (imgEl.height - sh) / 2; }
    } else {
      if (imgRatio > canvasRatio) { dh = c.width / imgRatio; dy = (c.height - dh) / 2; }
      else { dw = c.height * imgRatio; dx = (c.width - dw) / 2; }
      sx = 0; sy = 0; sw = imgEl.width; sh = imgEl.height;
    }

    ctx.drawImage(imgEl, sx, sy, sw, sh, dx, dy, dw, dh);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, selected, bgColor, mode]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">公众号封面生成</h1>
        <p className="text-gray-500 mt-2">一键生成公众号标准尺寸封面图</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div>
              <p className="text-sm text-gray-500 mb-3">封面类型</p>
              <div className="grid grid-cols-3 gap-3">
                {covers.map((c, i) => (
                  <button key={i} onClick={() => setSelected(i)} className={`p-3 rounded-xl border-2 text-left transition-all ${selected === i ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <p className="text-sm font-semibold text-gray-900">{c.label}</p>
                    <p className="text-xs text-gray-400">{c.w}×{c.h} ({c.desc})</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex justify-center p-4">
              <canvas ref={canvasRef} className="max-w-full shadow-lg rounded-lg" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">填充模式</p>
                <div className="flex gap-2">
                  <button onClick={() => setMode("cover")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${mode === "cover" ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500"}`}>裁切填满</button>
                  <button onClick={() => setMode("contain")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${mode === "contain" ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500"}`}>完整显示</button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">背景色</p>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <span className="text-sm text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={generate} className="btn-primary flex-1 py-3">生成封面</button>
              <button onClick={() => { setFile(null); setImgEl(null); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">重选</button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900">生成结果 <span className="text-sm text-gray-400 font-normal ml-2">{covers[selected].w}×{covers[selected].h}</span></p>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <img src={result} alt="cover" className="w-full object-contain" />
          </div>
          <a href={result} download={`cover_${covers[selected].w}x${covers[selected].h}.png`} className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
