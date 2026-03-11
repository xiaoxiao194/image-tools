"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import DropZone from "@/components/DropZone";

interface Layout {
  name: string;
  icon: string;
  count: number;
  // Each cell: x, y, w, h as fractions of total (0-1)
  cells: { x: number; y: number; w: number; h: number }[];
  aspect: number; // width/height
}

const layouts: Layout[] = [
  {
    name: "竖排拼接", icon: "⬇️", count: 0, aspect: 0,
    cells: [], // dynamic
  },
  {
    name: "横排拼接", icon: "➡️", count: 0, aspect: 0,
    cells: [],
  },
  {
    name: "两宫格", icon: "◻️◻️", count: 2, aspect: 2,
    cells: [
      { x: 0, y: 0, w: 0.5, h: 1 },
      { x: 0.5, y: 0, w: 0.5, h: 1 },
    ],
  },
  {
    name: "田字格", icon: "⊞", count: 4, aspect: 1,
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    name: "三宫格横版", icon: "☰", count: 3, aspect: 3,
    cells: [
      { x: 0, y: 0, w: 1 / 3, h: 1 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 1 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 1 },
    ],
  },
  {
    name: "三宫格竖版", icon: "☷", count: 3, aspect: 1 / 3 * 1,
    cells: [
      { x: 0, y: 0, w: 1, h: 1 / 3 },
      { x: 0, y: 1 / 3, w: 1, h: 1 / 3 },
      { x: 0, y: 2 / 3, w: 1, h: 1 / 3 },
    ],
  },
  {
    name: "左一右二", icon: "◧", count: 3, aspect: 1,
    cells: [
      { x: 0, y: 0, w: 0.5, h: 1 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    name: "右一左二", icon: "◨", count: 3, aspect: 1,
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 1 },
    ],
  },
  {
    name: "上一下二", icon: "⬒", count: 3, aspect: 1,
    cells: [
      { x: 0, y: 0, w: 1, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    name: "下一上二", icon: "⬓", count: 3, aspect: 1,
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 1, h: 0.5 },
    ],
  },
  {
    name: "九宫格", icon: "▦", count: 9, aspect: 1,
    cells: Array.from({ length: 9 }, (_, i) => ({
      x: (i % 3) / 3,
      y: Math.floor(i / 3) / 3,
      w: 1 / 3,
      h: 1 / 3,
    })),
  },
  {
    name: "左大右三", icon: "◫", count: 4, aspect: 1,
    cells: [
      { x: 0, y: 0, w: 0.6, h: 1 },
      { x: 0.6, y: 0, w: 0.4, h: 1 / 3 },
      { x: 0.6, y: 1 / 3, w: 0.4, h: 1 / 3 },
      { x: 0.6, y: 2 / 3, w: 0.4, h: 1 / 3 },
    ],
  },
  {
    name: "六宫格", icon: "⚏", count: 6, aspect: 1.5,
    cells: Array.from({ length: 6 }, (_, i) => ({
      x: (i % 3) / 3,
      y: Math.floor(i / 3) / 2,
      w: 1 / 3,
      h: 1 / 2,
    })),
  },
];

const bgPresets = [
  { label: "白色", value: "#ffffff" },
  { label: "黑色", value: "#000000" },
  { label: "粉色", value: "#fce4ec" },
  { label: "薰衣草", value: "#e8eaf6" },
  { label: "薄荷", value: "#e0f2f1" },
  { label: "奶油", value: "#fff8e1" },
  { label: "蜜桃", value: "#fbe9e7" },
  { label: "天蓝", value: "#e3f2fd" },
];

export default function StitchPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imgEls, setImgEls] = useState<HTMLImageElement[]>([]);
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [gap, setGap] = useState(8);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [rounded, setRounded] = useState(8);
  const [outerRounded, setOuterRounded] = useState(0);
  const [outputSize, setOutputSize] = useState(1080);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFiles = useCallback((newFiles: File[]) => {
    const updated = [...files, ...newFiles];
    setFiles(updated);
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
    setResult(null);

    // Load images
    newFiles.forEach((f, i) => {
      const img = new Image();
      img.onload = () => {
        setImgEls((prev) => {
          const next = [...prev];
          next[files.length + i] = img;
          return next;
        });
      };
      img.src = URL.createObjectURL(f);
    });
  }, [files]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImgEls((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const moveFile = (index: number, dir: -1 | 1) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= files.length) return;
    const swap = <T,>(arr: T[]) => { const n = [...arr]; [n[index], n[newIdx]] = [n[newIdx], n[index]]; return n; };
    setFiles(swap);
    setPreviews(swap);
    setImgEls(swap);
  };

  const renderToCanvas = useCallback((targetCanvas: HTMLCanvasElement, size: number) => {
    if (imgEls.length < 2) return;
    const layout = layouts[layoutIdx];
    const ctx = targetCanvas.getContext("2d")!;

    // For dynamic layouts (vertical/horizontal stitch)
    if (layout.count === 0) {
      const isVertical = layoutIdx === 0;
      const totalGap = gap * (imgEls.length - 1);

      if (isVertical) {
        // Scale all to same width
        const w = size;
        let totalH = totalGap;
        const scaledHeights = imgEls.map((img) => Math.round((w / img.width) * img.height));
        totalH += scaledHeights.reduce((s, h) => s + h, 0);

        targetCanvas.width = w;
        targetCanvas.height = totalH;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, totalH);

        if (outerRounded > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, w, totalH, outerRounded);
          ctx.clip();
          ctx.fillRect(0, 0, w, totalH);
        }

        let y = 0;
        imgEls.forEach((img, i) => {
          const h = scaledHeights[i];
          if (rounded > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(0, y, w, h, rounded);
            ctx.clip();
          }
          ctx.drawImage(img, 0, y, w, h);
          if (rounded > 0) ctx.restore();
          y += h + gap;
        });
      } else {
        const h = size;
        let totalW = totalGap;
        const scaledWidths = imgEls.map((img) => Math.round((h / img.height) * img.width));
        totalW += scaledWidths.reduce((s, w) => s + w, 0);

        targetCanvas.width = totalW;
        targetCanvas.height = h;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, totalW, h);

        if (outerRounded > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, totalW, h, outerRounded);
          ctx.clip();
          ctx.fillRect(0, 0, totalW, h);
        }

        let x = 0;
        imgEls.forEach((img, i) => {
          const w = scaledWidths[i];
          if (rounded > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, 0, w, h, rounded);
            ctx.clip();
          }
          ctx.drawImage(img, x, 0, w, h);
          if (rounded > 0) ctx.restore();
          x += w + gap;
        });
      }
      return;
    }

    // Grid layouts
    const totalW = size;
    const totalH = Math.round(size / layout.aspect);
    targetCanvas.width = totalW;
    targetCanvas.height = totalH;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalW, totalH);

    if (outerRounded > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, totalW, totalH, outerRounded);
      ctx.clip();
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalW, totalH);
    }

    const halfGap = gap / 2;

    layout.cells.forEach((cell, i) => {
      if (i >= imgEls.length) return;
      const img = imgEls[i];
      const cx = cell.x * totalW + halfGap;
      const cy = cell.y * totalH + halfGap;
      const cw = cell.w * totalW - gap;
      const ch = cell.h * totalH - gap;

      // Cover fit
      const imgRatio = img.width / img.height;
      const cellRatio = cw / ch;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgRatio > cellRatio) {
        sw = img.height * cellRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / cellRatio;
        sy = (img.height - sh) / 2;
      }

      if (rounded > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cx, cy, cw, ch, rounded);
        ctx.clip();
      }
      ctx.drawImage(img, sx, sy, sw, sh, cx, cy, cw, ch);
      if (rounded > 0) ctx.restore();
    });

    if (outerRounded > 0) ctx.restore();
  }, [imgEls, layoutIdx, gap, bgColor, rounded, outerRounded]);

  // Preview
  useEffect(() => {
    if (!canvasRef.current || imgEls.length < 2) return;
    const previewSize = Math.min(640, outputSize);
    renderToCanvas(canvasRef.current, previewSize);
  }, [renderToCanvas, outputSize, imgEls]);

  const generate = useCallback(() => {
    setProcessing(true);
    const c = document.createElement("canvas");
    renderToCanvas(c, outputSize);
    c.toBlob((b) => {
      if (b) setResult(URL.createObjectURL(b));
      setProcessing(false);
    }, "image/png");
  }, [renderToCanvas, outputSize]);

  const layout = layouts[layoutIdx];
  const needCount = layout.count || 2;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">拼图拼接</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">多种模板布局，圆角间距随心调，拼出好看的图</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <DropZone onFiles={onFiles} multiple>
          <div className="space-y-2">
            <p className="text-indigo-600 font-medium">{files.length > 0 ? `已选 ${files.length} 张，继续添加` : "拖拽或点击添加图片"}</p>
            <p className="text-gray-400 text-sm">{layout.count ? `当前模板需要 ${layout.count} 张` : "至少需要 2 张"}</p>
          </div>
        </DropZone>

        {files.length > 0 && (
          <>
            {/* Image order */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">图片顺序</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {previews.map((url, i) => (
                  <div key={i} className="relative flex-shrink-0 group">
                    <img src={url} alt="" className="h-16 w-16 object-cover rounded-xl border border-gray-200 dark:border-gray-600" />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button onClick={() => moveFile(i, -1)} className="text-white text-xs bg-white/20 rounded px-1">←</button>
                      <button onClick={() => removeFile(i)} className="text-white text-xs bg-red-500/80 rounded px-1">✕</button>
                      <button onClick={() => moveFile(i, 1)} className="text-white text-xs bg-white/20 rounded px-1">→</button>
                    </div>
                    <span className="absolute -top-2 -left-2 bg-indigo-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout selection */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">选择布局</p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {layouts.map((l, i) => (
                  <button key={i} onClick={() => setLayoutIdx(i)} className={`p-2 rounded-xl border-2 text-center transition-all ${layoutIdx === i ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="text-lg mb-0.5">{l.icon}</div>
                    <div className="text-xs text-gray-500 leading-tight">{l.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {imgEls.length >= 2 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-100 flex justify-center p-4">
                <canvas ref={canvasRef} className="max-w-full max-h-96 shadow-lg" />
              </div>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">背景色</p>
                <div className="flex gap-2 flex-wrap">
                  {bgPresets.map((b) => (
                    <button key={b.value} onClick={() => setBgColor(b.value)} className={`w-9 h-9 rounded-lg border-2 transition-all ${bgColor === b.value ? "border-indigo-500 scale-110" : "border-gray-200"}`} style={{ backgroundColor: b.value }} title={b.label} />
                  ))}
                  <label className="w-9 h-9 rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer" title="自定义">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-12 -mt-1 -ml-1 cursor-pointer" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="block">
                  <span className="text-xs text-gray-400">间距 {gap}px</span>
                  <input type="range" min="0" max="30" value={gap} onChange={(e) => setGap(+e.target.value)} className="w-full accent-indigo-500 mt-1" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400">圆角 {rounded}px</span>
                  <input type="range" min="0" max="30" value={rounded} onChange={(e) => setRounded(+e.target.value)} className="w-full accent-indigo-500 mt-1" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400">外圆角 {outerRounded}px</span>
                  <input type="range" min="0" max="40" value={outerRounded} onChange={(e) => setOuterRounded(+e.target.value)} className="w-full accent-indigo-500 mt-1" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400">输出宽度</span>
                  <select value={outputSize} onChange={(e) => setOutputSize(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm mt-1">
                    <option value={720}>720px</option>
                    <option value={1080}>1080px</option>
                    <option value={1440}>1440px</option>
                    <option value={1920}>1920px</option>
                  </select>
                </label>
              </div>
            </div>

            <button onClick={generate} disabled={imgEls.length < 2 || processing} className="btn-primary w-full py-3">
              {processing ? "⏳ 拼接中..." : "开始拼接"}
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900 dark:text-white">拼接结果</p>
          <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50">
            <img src={result} alt="stitched" className="w-full max-h-96 object-contain" />
          </div>
          <a href={result} download="collage.png" className="btn-primary inline-block">下载</a>
        </div>
      )}

      <div className="mt-6 bg-indigo-50 rounded-2xl p-5 text-sm text-indigo-700 space-y-1">
        <p className="font-semibold">💡 小技巧</p>
        <p>• 九宫格适合朋友圈，三宫格横版适合小红书</p>
        <p>• 加点圆角和间距，拼图更精致</p>
        <p>• 试试粉色、薰衣草背景，少女感拉满 ✨</p>
      </div>
    </main>
  );
}
