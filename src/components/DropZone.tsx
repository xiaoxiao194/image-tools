"use client";
import { useRef, useState, DragEvent } from "react";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  children?: React.ReactNode;
}

export default function DropZone({ onFiles, multiple = false, accept = "image/*", children }: DropZoneProps) {
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(multiple ? files : [files[0]]);
  };

  return (
    <div
      className={`drop-zone p-10 text-center cursor-pointer ${active ? "active" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setActive(true); }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) onFiles(multiple ? files : [files[0]]);
        }}
      />
      {children || (
        <div className="space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          </div>
          <p className="text-gray-600 font-medium">拖拽图片到这里，或 <span className="text-indigo-600">点击选择</span></p>
          <p className="text-gray-400 text-sm">{multiple ? "支持批量上传" : "支持 PNG / JPG / WebP / GIF"}</p>
        </div>
      )}
    </div>
  );
}
