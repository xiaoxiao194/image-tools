"use client";
import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";

type Direction = "vertical" | "horizontal";

export default function StitchPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [direction, setDirection] = useState<Direction>("vertical");
  const [gap, setGap] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const onFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
    setResult(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const moveFile = (index: number, dir: -1 | 1) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= files.length) return;
    const newFiles = [...files];
    const newPreviews = [...previews];
    [newFiles[index], newFiles[newIdx]] = [newFiles[newIdx], newFiles[index]];
    [newPreviews[index], newPreviews[newIdx]] = [newPreviews[newIdx], newPreviews[index]];
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const stitch = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);

    const imgs = await Promise.all(
      files.map((f) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = URL.createObjectURL(f);
        });
      })
    );

    let totalW = 0, totalH = 0;
    const totalGap = gap * (imgs.length - 1);

    if (direction === "vertical") {
      totalW = Math.max(...imgs.map((i) => i.width));
      totalH = imgs.reduce((s, i) => s + i.height, 0) + totalGap;
    } else {
      totalW = imgs.reduce((s, i) => s + i.width, 0) + totalGap;
      totalH = Math.max(...imgs.map((i) => i.height));
    }

    const canvas = document.createElement("canvas");
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalW, totalH);

    let offset = 0;
    for (const img of imgs) {
      if (direction === "vertical") {
        const x = Math.round((totalW - img.width) / 2);
        ctx.drawImage(img, x, offset);
        offset += img.height + gap;
      } else {
        const y = Math.round((totalH - img.height) / 2);
        ctx.drawImage(img, offset, y);
        offset += img.width + gap;
      }
    }

    canvas.toBlob((b) => {
      if (b) setResult(URL.createObjectURL(b));
      setProcessing(false);
    }, "image/png");
  }, [files, direction, gap, bgColor]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">拼图拼接</h1>
        <p className="text-gray-500 mt-2">多张图片横排或竖排拼接，支持间距和背景色</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <DropZone onFiles={onFiles} multiple>
          <div className="space-y-2">
            <p className="text-indigo-600 font-medium">{files.length > 0 ? `已选 ${files.length} 张，继续添加` : "拖拽或点击添加图片"}</p>
            <p className="text-gray-400 text-sm">至少需要 2 张图片</p>
          </div>
        </DropZone>

        {files.length > 0 && (
          <>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">图片顺序（拖拽调整）</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {previews.map((url, i) => (
                  <div key={i} className="relative flex-shrink-0 group">
                    <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                    <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button onClick={() => moveFile(i, -1)} className="text-white text-xs bg-white/20 rounded px-1">←</button>
                      <button onClick={() => removeFile(i)} className="text-white text-xs bg-red-500/80 rounded px-1">✕</button>
                      <button onClick={() => moveFile(i, 1)} className="text-white text-xs bg-white/20 rounded px-1">→</button>
                    </div>
                    <span className="absolute -top-2 -left-2 bg-indigo-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">排列方向</p>
                <div className="flex gap-2">
                  <button onClick={() => setDirection("vertical")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${direction === "vertical" ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500"}`}>竖排 ↓</button>
                  <button onClick={() => setDirection("horizontal")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${direction === "horizontal" ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500"}`}>横排 →</button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">间距 (px)</p>
                <input type="number" min="0" max="100" value={gap} onChange={(e) => setGap(+e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">背景色</p>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <span className="text-sm text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>

            <button onClick={stitch} disabled={files.length < 2 || processing} className="btn-primary w-full py-3">
              {processing ? "⏳ 拼接中..." : "开始拼接"}
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900">拼接结果</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <img src={result} alt="stitched" className="w-full max-h-96 object-contain" />
          </div>
          <a href={result} download="stitched.png" className="btn-primary inline-block">下载</a>
        </div>
      )}
    </main>
  );
}
