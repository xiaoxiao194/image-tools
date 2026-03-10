"use client";
import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";

interface ImageInfo {
  name: string;
  size: string;
  type: string;
  width: number;
  height: number;
  lastModified: string;
  aspectRatio: string;
  megapixels: string;
}

export default function InfoPage() {
  const [info, setInfo] = useState<ImageInfo | null>(null);
  const [preview, setPreview] = useState("");

  const onFile = useCallback((files: File[]) => {
    const f = files[0];
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const d = gcd(img.width, img.height);
      setInfo({
        name: f.name,
        size: f.size > 1048576 ? (f.size / 1048576).toFixed(2) + " MB" : (f.size / 1024).toFixed(1) + " KB",
        type: f.type || "未知",
        width: img.width,
        height: img.height,
        lastModified: new Date(f.lastModified).toLocaleString("zh-CN"),
        aspectRatio: `${img.width / d}:${img.height / d}`,
        megapixels: ((img.width * img.height) / 1000000).toFixed(2) + " MP",
      });
    };
    img.src = url;
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">图片信息</h1>
        <p className="text-gray-500 mt-2">查看图片尺寸、大小、格式等详细信息</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <DropZone onFiles={onFile} />

        {info && (
          <div className="fade-in space-y-6">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <img src={preview} alt="preview" className="w-full max-h-72 object-contain bg-gray-50" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "文件名", value: info.name },
                { label: "格式", value: info.type },
                { label: "尺寸", value: `${info.width} × ${info.height} px` },
                { label: "文件大小", value: info.size },
                { label: "宽高比", value: info.aspectRatio },
                { label: "像素数", value: info.megapixels },
                { label: "修改时间", value: info.lastModified },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
