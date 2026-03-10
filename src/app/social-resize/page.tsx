"use client";
import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";

const platforms = [
  { name: "小红书", sizes: [{ label: "竖版", w: 1080, h: 1440 }, { label: "方形", w: 1080, h: 1080 }, { label: "横版", w: 1080, h: 810 }] },
  { name: "抖音", sizes: [{ label: "视频封面", w: 1080, h: 1920 }, { label: "横版", w: 1920, h: 1080 }] },
  { name: "微博", sizes: [{ label: "配图", w: 1080, h: 1080 }, { label: "头图", w: 980, h: 300 }] },
  { name: "B站", sizes: [{ label: "封面", w: 1146, h: 717 }, { label: "头图", w: 1920, h: 300 }] },
  { name: "Twitter/X", sizes: [{ label: "帖图", w: 1200, h: 675 }, { label: "头图", w: 1500, h: 500 }] },
  { name: "Instagram", sizes: [{ label: "方形", w: 1080, h: 1080 }, { label: "竖版", w: 1080, h: 1350 }, { label: "Story", w: 1080, h: 1920 }] },
];

export default function SocialResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [mode, setMode] = useState<"cover" | "contain">("cover");
  const [results, setResults] = useState<{ label: string; w: number; h: number; url: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResults([]);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = URL.createObjectURL(files[0]);
  }, []);

  const toggleSize = (key: string) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const generate = useCallback(async () => {
    if (!imgEl || selectedSizes.size === 0) return;
    setProcessing(true);
    const out: typeof results = [];

    for (const p of platforms) {
      for (const s of p.sizes) {
        const key = `${p.name}-${s.label}`;
        if (!selectedSizes.has(key)) continue;

        const c = document.createElement("canvas");
        c.width = s.w;
        c.height = s.h;
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
        const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), "image/png"));
        out.push({ label: `${p.name} ${s.label}`, w: s.w, h: s.h, url: URL.createObjectURL(blob) });
      }
    }

    setResults(out);
    setProcessing(false);
  }, [imgEl, selectedSizes, bgColor, mode]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">社交平台尺寸适配</h1>
        <p className="text-gray-500 mt-2">一键生成各社交平台标准尺寸图片</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg">🖼</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{imgEl?.width} × {imgEl?.height}</p>
              </div>
              <button onClick={() => { setFile(null); setImgEl(null); setResults([]); }} className="text-gray-400 hover:text-gray-600 text-sm">更换</button>
            </div>

            <div>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {platforms.map((p, i) => (
                  <button key={i} onClick={() => setSelectedPlatform(i)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedPlatform === i ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p.name}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {platforms[selectedPlatform].sizes.map((s) => {
                  const key = `${platforms[selectedPlatform].name}-${s.label}`;
                  const isSelected = selectedSizes.has(key);
                  return (
                    <button key={key} onClick={() => toggleSize(key)} className={`p-3 rounded-xl border-2 text-left transition-all ${isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                        {isSelected && <span className="text-indigo-500">✓</span>}
                      </div>
                      <p className="text-xs text-gray-400">{s.w} × {s.h}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
            </div>

            <button onClick={generate} disabled={selectedSizes.size === 0 || processing} className="btn-primary w-full py-3">
              {processing ? "⏳ 生成中..." : `批量生成 (${selectedSizes.size} 个尺寸)`}
            </button>
          </>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-8 space-y-4 fade-in">
          <p className="font-semibold text-gray-900">生成结果（{results.length} 张）</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                  <img src={r.url} alt={r.label} className="w-full h-40 object-contain" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.label}</p>
                    <p className="text-xs text-gray-400">{r.w} × {r.h}</p>
                  </div>
                  <a href={r.url} download={`${r.label.replace(/\s+/g, "_")}_${r.w}x${r.h}.png`} className="btn-primary text-xs px-4 py-1.5">下载</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
