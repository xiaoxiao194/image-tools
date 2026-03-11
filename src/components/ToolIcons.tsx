import React from "react";

const icons: Record<string, React.ReactNode> = {
  compress: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 3v4m0 10v4M8 7l4 4 4-4M8 17l4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  convert: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  crop: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M6 2v4H2m20 12h-4v4M6 6h10a2 2 0 012 2v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  resize: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
      <path d="M12 8h.01M12 11v5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  removeBg: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="white" strokeWidth="2"/>
      <path d="M12 3c2 2 3.5 5 3.5 9s-1.5 7-3.5 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3.5 9h17M3.5 15h17" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  removeWatermark: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M20 7l-8 8-4-4-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
      <path d="M4 4l16 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M9 3h6l1 4H8L9 3z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  stitch: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2"/>
    </svg>
  ),
  watermark: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M7 9l3 6 2-3 3 5h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 7v4m0 0h-4m4 0l-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  ),
  meme: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1.2" fill="white"/>
      <circle cx="15" cy="10" r="1.2" fill="white"/>
      <path d="M8 15c1.5 2 6.5 2 8 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  wechatCover: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="2"/>
      <path d="M3 10h18" stroke="white" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="8" cy="14" r="2" stroke="white" strokeWidth="1.5"/>
      <path d="M14 13l2-1.5 2 1.5v3h-4v-3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  socialResize: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="6" y="3" width="12" height="18" rx="2" stroke="white" strokeWidth="2"/>
      <circle cx="12" cy="17" r="1" fill="white"/>
      <path d="M9 7h6M9 10h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  mockup: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="2" y="4" width="20" height="14" rx="2" stroke="white" strokeWidth="2"/>
      <path d="M2 8h20" stroke="white" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="5" cy="6" r="0.8" fill="#ef4444"/>
      <circle cx="7.5" cy="6" r="0.8" fill="#eab308"/>
      <circle cx="10" cy="6" r="0.8" fill="#22c55e"/>
      <path d="M8 20h8M12 18v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  avatar: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <circle cx="12" cy="10" r="4" stroke="white" strokeWidth="2"/>
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  ),
  rotate: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M1 4v6h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 15a9 9 0 105.64-11.36L1 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};


export default icons;
