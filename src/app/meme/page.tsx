"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import DropZone from "@/components/DropZone";

interface TextBox {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadowBlur: number;
  rotation: number;
  bold: boolean;
  italic: boolean;
}

interface Sticker {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

interface DrawPath {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

const fonts = [
  { label: "Impact", value: "Impact, Arial Black, sans-serif" },
  { label: "黑体", value: "'Microsoft YaHei', 'PingFang SC', sans-serif" },
  { label: "楷体", value: "'KaiTi', 'STKaiti', serif" },
  { label: "宋体", value: "'SimSun', 'STSong', serif" },
  { label: "圆体", value: "'Yuanti SC', 'Microsoft YaHei', sans-serif" },
  { label: "手写", value: "'Comic Sans MS', 'Chalkboard SE', cursive" },
  { label: "等宽", value: "'Courier New', monospace" },
];

const filters = [
  { label: "无", value: "none" },
  { label: "灰度", value: "grayscale(100%)" },
  { label: "复古", value: "sepia(80%)" },
  { label: "高对比", value: "contrast(150%)" },
  { label: "高亮", value: "brightness(130%)" },
  { label: "暗调", value: "brightness(70%)" },
  { label: "模糊", value: "blur(2px)" },
  { label: "饱和", value: "saturate(200%)" },
  { label: "反色", value: "invert(100%)" },
];

const emojiList = ["😂", "🤣", "😭", "😍", "🥺", "😎", "🤔", "😤", "💀", "🔥", "❤️", "👍", "👎", "🙄", "😱", "🤡", "💩", "✨", "⭐", "💯", "🎉", "😈", "👀", "🫠", "😮‍💨", "🥲", "😏", "🤯", "🫡", "🤗"];

let nextId = 1;

export default function MemePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedText, setSelectedText] = useState<number | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<number | null>(null);
  const [filter, setFilter] = useState("none");
  const [tab, setTab] = useState<"text" | "sticker" | "draw" | "filter">("text");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  // Drawing state
  const [drawing, setDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [drawColor, setDrawColor] = useState("#ff0000");
  const [drawWidth, setDrawWidth] = useState(4);
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const currentPath = useRef<DrawPath | null>(null);

  // Drag state
  const [dragging, setDragging] = useState<{ type: "text" | "sticker"; id: number; offsetX: number; offsetY: number } | null>(null);

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResult(null);
    setTextBoxes([]);
    setStickers([]);
    setPaths([]);
    setFilter("none");
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = URL.createObjectURL(files[0]);
  }, []);

  const addTextBox = () => {
    const id = nextId++;
    const newBox: TextBox = {
      id, text: "在这里输入", x: 0.5, y: textBoxes.length === 0 ? 0.12 : 0.88,
      fontSize: 48, fontFamily: fonts[0].value, color: "#ffffff", strokeColor: "#000000",
      strokeWidth: 3, shadowBlur: 0, rotation: 0, bold: true, italic: false,
    };
    setTextBoxes((prev) => [...prev, newBox]);
    setSelectedText(id);
  };

  const updateTextBox = (id: number, updates: Partial<TextBox>) => {
    setTextBoxes((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const removeTextBox = (id: number) => {
    setTextBoxes((prev) => prev.filter((t) => t.id !== id));
    if (selectedText === id) setSelectedText(null);
  };

  const addSticker = (emoji: string) => {
    const id = nextId++;
    setStickers((prev) => [...prev, { id, emoji, x: 0.5, y: 0.5, size: 64 }]);
    setSelectedSticker(id);
  };

  const updateSticker = (id: number, updates: Partial<Sticker>) => {
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeSticker = (id: number) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedSticker === id) setSelectedSticker(null);
  };

  const renderCanvas = useCallback((targetCanvas: HTMLCanvasElement, s: number) => {
    if (!imgEl) return;
    const ctx = targetCanvas.getContext("2d")!;
    const w = imgEl.width * s;
    const h = imgEl.height * s;
    targetCanvas.width = w;
    targetCanvas.height = h;

    // Filter
    ctx.filter = filter;
    ctx.drawImage(imgEl, 0, 0, w, h);
    ctx.filter = "none";

    // Draw paths
    for (const path of paths) {
      if (path.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width * s;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(path.points[0].x * w, path.points[0].y * h);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x * w, path.points[i].y * h);
      }
      ctx.stroke();
    }

    // Stickers
    for (const sticker of stickers) {
      const sz = sticker.size * s;
      ctx.font = `${sz}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sticker.emoji, sticker.x * w, sticker.y * h);
    }

    // Text boxes
    for (const tb of textBoxes) {
      const fs = tb.fontSize * s;
      ctx.save();
      ctx.translate(tb.x * w, tb.y * h);
      ctx.rotate((tb.rotation * Math.PI) / 180);
      const style = `${tb.bold ? "bold " : ""}${tb.italic ? "italic " : ""}`;
      ctx.font = `${style}${fs}px ${tb.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (tb.shadowBlur > 0) {
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = tb.shadowBlur * s;
        ctx.shadowOffsetX = 2 * s;
        ctx.shadowOffsetY = 2 * s;
      }

      if (tb.strokeWidth > 0) {
        ctx.strokeStyle = tb.strokeColor;
        ctx.lineWidth = tb.strokeWidth * s;
        ctx.lineJoin = "round";
        ctx.strokeText(tb.text, 0, 0);
      }

      ctx.fillStyle = tb.color;
      ctx.fillText(tb.text, 0, 0);
      ctx.restore();
    }
  }, [imgEl, textBoxes, stickers, paths, filter]);

  useEffect(() => {
    if (!canvasRef.current || !imgEl) return;
    const maxW = 640;
    const s = imgEl.width > maxW ? maxW / imgEl.width : 1;
    setScale(s);
    renderCanvas(canvasRef.current, s);
  }, [renderCanvas, imgEl]);

  const getCanvasPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);

    if (drawMode) {
      setDrawing(true);
      currentPath.current = { points: [pos], color: drawColor, width: drawWidth };
      return;
    }

    // Check stickers
    for (const s of [...stickers].reverse()) {
      const dist = Math.sqrt((pos.x - s.x) ** 2 + (pos.y - s.y) ** 2);
      if (dist < 0.05) {
        setDragging({ type: "sticker", id: s.id, offsetX: pos.x - s.x, offsetY: pos.y - s.y });
        setSelectedSticker(s.id);
        setSelectedText(null);
        return;
      }
    }

    // Check text boxes
    for (const tb of [...textBoxes].reverse()) {
      const dist = Math.sqrt((pos.x - tb.x) ** 2 + (pos.y - tb.y) ** 2);
      if (dist < 0.08) {
        setDragging({ type: "text", id: tb.id, offsetX: pos.x - tb.x, offsetY: pos.y - tb.y });
        setSelectedText(tb.id);
        setSelectedSticker(null);
        return;
      }
    }

    setSelectedText(null);
    setSelectedSticker(null);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);

    if (drawing && currentPath.current) {
      currentPath.current.points.push(pos);
      // Force re-render by updating paths
      setPaths((prev) => [...prev.slice(0, -1), { ...currentPath.current! }]);
      if (paths.length === 0 || paths[paths.length - 1] !== currentPath.current) {
        setPaths((prev) => [...prev, currentPath.current!]);
      }
      return;
    }

    if (!dragging) return;
    const newX = pos.x - dragging.offsetX;
    const newY = pos.y - dragging.offsetY;

    if (dragging.type === "text") updateTextBox(dragging.id, { x: newX, y: newY });
    else updateSticker(dragging.id, { x: newX, y: newY });
  };

  const onMouseUp = () => {
    if (drawing && currentPath.current) {
      setPaths((prev) => {
        const filtered = prev.filter((p) => p !== currentPath.current);
        return [...filtered, { ...currentPath.current! }];
      });
      currentPath.current = null;
    }
    setDrawing(false);
    setDragging(null);
  };

  const generate = useCallback(() => {
    if (!imgEl) return;
    const c = document.createElement("canvas");
    renderCanvas(c, 1);
    c.toBlob((b) => { if (b) setResult(URL.createObjectURL(b)); }, "image/png");
  }, [imgEl, renderCanvas]);

  const selectedTB = textBoxes.find((t) => t.id === selectedText);
  const selectedSK = stickers.find((s) => s.id === selectedSticker);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">表情包制作</h1>
        <p className="text-gray-500 mt-2">多文本、贴纸、涂鸦、滤镜，打造专属表情包</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex justify-center">
                <canvas
                  ref={canvasRef}
                  className={`max-w-full ${drawMode ? "cursor-crosshair" : dragging ? "cursor-grabbing" : "cursor-grab"}`}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={generate} className="btn-primary flex-1 py-3">生成表情包</button>
                <button onClick={() => { setFile(null); setImgEl(null); setResult(null); setTextBoxes([]); setStickers([]); setPaths([]); }} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">重选</button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {[
                  { key: "text" as const, label: "文字" },
                  { key: "sticker" as const, label: "贴纸" },
                  { key: "draw" as const, label: "涂鸦" },
                  { key: "filter" as const, label: "滤镜" },
                ].map((t) => (
                  <button key={t.key} onClick={() => { setTab(t.key); setDrawMode(t.key === "draw"); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}>{t.label}</button>
                ))}
              </div>

              {/* Text Tab */}
              {tab === "text" && (
                <div className="space-y-4">
                  <button onClick={addTextBox} className="w-full py-2 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors">+ 添加文字</button>

                  {/* Text list */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {textBoxes.map((tb) => (
                      <div key={tb.id} onClick={() => { setSelectedText(tb.id); setSelectedSticker(null); }} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${selectedText === tb.id ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 hover:bg-gray-100"}`}>
                        <span className="text-sm flex-1 truncate">{tb.text}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeTextBox(tb.id); }} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Selected text editor */}
                  {selectedTB && (
                    <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
                      <input type="text" value={selectedTB.text} onChange={(e) => updateTextBox(selectedTB.id, { text: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="输入文字" />

                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <span className="text-xs text-gray-400">字体</span>
                          <select value={selectedTB.fontFamily} onChange={(e) => updateTextBox(selectedTB.id, { fontFamily: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs mt-1">
                            {fonts.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs text-gray-400">字号 {selectedTB.fontSize}</span>
                          <input type="range" min="16" max="120" value={selectedTB.fontSize} onChange={(e) => updateTextBox(selectedTB.id, { fontSize: +e.target.value })} className="w-full accent-indigo-500 mt-2" />
                        </label>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <label className="block text-center">
                          <span className="text-xs text-gray-400">文字色</span>
                          <input type="color" value={selectedTB.color} onChange={(e) => updateTextBox(selectedTB.id, { color: e.target.value })} className="w-full h-8 rounded border border-gray-200 cursor-pointer mt-1" />
                        </label>
                        <label className="block text-center">
                          <span className="text-xs text-gray-400">描边色</span>
                          <input type="color" value={selectedTB.strokeColor} onChange={(e) => updateTextBox(selectedTB.id, { strokeColor: e.target.value })} className="w-full h-8 rounded border border-gray-200 cursor-pointer mt-1" />
                        </label>
                        <label className="block">
                          <span className="text-xs text-gray-400">描边</span>
                          <input type="range" min="0" max="10" value={selectedTB.strokeWidth} onChange={(e) => updateTextBox(selectedTB.id, { strokeWidth: +e.target.value })} className="w-full accent-indigo-500 mt-2" />
                        </label>
                        <label className="block">
                          <span className="text-xs text-gray-400">阴影</span>
                          <input type="range" min="0" max="20" value={selectedTB.shadowBlur} onChange={(e) => updateTextBox(selectedTB.id, { shadowBlur: +e.target.value })} className="w-full accent-indigo-500 mt-2" />
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => updateTextBox(selectedTB.id, { bold: !selectedTB.bold })} className={`w-8 h-8 rounded-lg text-sm font-bold border transition-all ${selectedTB.bold ? "bg-indigo-100 border-indigo-300 text-indigo-600" : "border-gray-200 text-gray-400"}`}>B</button>
                        <button onClick={() => updateTextBox(selectedTB.id, { italic: !selectedTB.italic })} className={`w-8 h-8 rounded-lg text-sm italic border transition-all ${selectedTB.italic ? "bg-indigo-100 border-indigo-300 text-indigo-600" : "border-gray-200 text-gray-400"}`}>I</button>
                        <label className="flex items-center gap-1 flex-1">
                          <span className="text-xs text-gray-400">旋转</span>
                          <input type="range" min="-180" max="180" value={selectedTB.rotation} onChange={(e) => updateTextBox(selectedTB.id, { rotation: +e.target.value })} className="flex-1 accent-indigo-500" />
                          <span className="text-xs text-gray-500 w-8">{selectedTB.rotation}°</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sticker Tab */}
              {tab === "sticker" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-6 gap-2">
                    {emojiList.map((e) => (
                      <button key={e} onClick={() => addSticker(e)} className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-xl transition-colors">{e}</button>
                    ))}
                  </div>

                  {selectedSK && (
                    <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{selectedSK.emoji}</span>
                        <button onClick={() => removeSticker(selectedSK.id)} className="text-xs text-red-500 hover:underline">删除</button>
                      </div>
                      <label className="block">
                        <span className="text-xs text-gray-400">大小 {selectedSK.size}px</span>
                        <input type="range" min="20" max="200" value={selectedSK.size} onChange={(e) => updateSticker(selectedSK.id, { size: +e.target.value })} className="w-full accent-indigo-500" />
                      </label>
                    </div>
                  )}

                  {stickers.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">已添加贴纸（点击选中，拖拽移动）</p>
                      <div className="flex gap-2 flex-wrap">
                        {stickers.map((s) => (
                          <button key={s.id} onClick={() => { setSelectedSticker(s.id); setSelectedText(null); }} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${selectedSticker === s.id ? "bg-indigo-100 ring-2 ring-indigo-400" : "bg-gray-100"}`}>{s.emoji}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Draw Tab */}
              {tab === "draw" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">在图片上自由涂鸦</p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs text-gray-400">颜色</span>
                      <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer mt-1" />
                    </label>
                    <label className="block">
                      <span className="text-xs text-gray-400">粗细 {drawWidth}px</span>
                      <input type="range" min="1" max="20" value={drawWidth} onChange={(e) => setDrawWidth(+e.target.value)} className="w-full accent-indigo-500 mt-3" />
                    </label>
                  </div>
                  <button onClick={() => setPaths([])} className="w-full py-2 rounded-lg border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">清除涂鸦</button>
                </div>
              )}

              {/* Filter Tab */}
              {tab === "filter" && (
                <div className="grid grid-cols-3 gap-2">
                  {filters.map((f) => (
                    <button key={f.value} onClick={() => setFilter(f.value)} className={`p-2 rounded-xl text-xs font-medium border-2 transition-all ${filter === f.value ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>{f.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm fade-in space-y-4">
          <p className="font-semibold text-gray-900">生成结果</p>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
            <img src={result} alt="meme" className="w-full max-h-96 object-contain" />
          </div>
          <a href={result} download="meme.png" className="btn-primary inline-block">下载</a>
        </div>
      )}

      <div className="mt-6 bg-indigo-50 rounded-2xl p-5 text-sm text-indigo-700 space-y-1">
        <p className="font-semibold">💡 使用技巧</p>
        <p>• 鼠标拖拽可移动文字和贴纸位置</p>
        <p>• 切换到「涂鸦」标签可在图上自由画画</p>
        <p>• 多个文字框可以叠加使用，打造复杂排版</p>
      </div>
    </main>
  );
}
