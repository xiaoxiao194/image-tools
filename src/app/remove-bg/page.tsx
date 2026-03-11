"use client";
import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");

  const onFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setPreview(URL.createObjectURL(files[0]));
    setResult(null);
  }, []);

  const removeBg = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setProgress("正在加载 AI 模型（首次约 30 秒）...");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setProgress("正在处理图片...");
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (key === "compute:inference") {
            setProgress(`AI 处理中... ${Math.round((current / total) * 100)}%`);
          }
        },
      });
      setResult(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      setProgress("处理失败，请换一张图片试试");
    }
    setProcessing(false);
  }, [file]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI 抠图</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">一键去除背景，AI 本地运行，无需上传服务器</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        {!file ? (
          <DropZone onFiles={onFile} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-2 text-center">原图</p>
                <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50">
                  <img src={preview} alt="original" className="w-full h-48 object-contain" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2 text-center">结果</p>
                <div className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden h-48 flex items-center justify-center" style={{ backgroundImage: "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }}>
                  {result ? (
                    <img src={result} alt="result" className="w-full h-48 object-contain" />
                  ) : (
                    <span className="text-gray-300 text-sm">{processing ? progress : "等待处理"}</span>
                  )}
                </div>
              </div>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                </div>
                <p className="text-sm text-indigo-600 text-center">{progress}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={removeBg} disabled={processing} className="btn-primary flex-1 py-3">
                {processing ? "⏳ 处理中..." : "✨ 一键去背景"}
              </button>
              <button onClick={() => { setFile(null); setPreview(""); setResult(null); }} className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">重选</button>
            </div>

            {result && (
              <div className="flex gap-3 fade-in">
                <a href={result} download="nobg.png" className="btn-primary flex-1 py-3 text-center">下载 PNG（透明背景）</a>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6 bg-indigo-50 rounded-2xl p-5 text-sm text-indigo-700 space-y-1">
        <p className="font-semibold">💡 提示</p>
        <p>• 首次使用需加载 AI 模型（约 40MB），之后会缓存</p>
        <p>• 所有处理在浏览器本地完成，图片不会上传</p>
        <p>• 人像、商品、动物等主体效果最佳</p>
      </div>
    </main>
  );
}
