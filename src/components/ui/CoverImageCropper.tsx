"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Check, X, ZoomIn, ZoomOut, Move } from "lucide-react";

interface CoverImageCropperProps {
  /** The raw image src (URL or base64) to crop */
  src: string;
  /** width/height ratio of the crop frame. Defaults to 16/5 to match the shop banner */
  aspectRatio?: number;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

export default function CoverImageCropper({
  src,
  aspectRatio = 16 / 5,
  onConfirm,
  onCancel,
}: CoverImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [minScale, setMinScale] = useState(1);

  // ── Clamp helper ────────────────────────────────────────────────────────
  const clampOffset = useCallback(
    (x: number, y: number, s: number, cw: number, ch: number) => {
      const sw = imgNatural.w * s;
      const sh = imgNatural.h * s;
      return {
        x: Math.min(0, Math.max(cw - sw, x)),
        y: Math.min(0, Math.max(ch - sh, y)),
      };
    },
    [imgNatural]
  );

  // ── Image load: fit-to-cover & center ────────────────────────────────────
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const natural = { w: img.naturalWidth, h: img.naturalHeight };
    setImgNatural(natural);

    if (containerRef.current) {
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      setContainerSize({ w: cw, h: ch });

      const scaleX = cw / natural.w;
      const scaleY = ch / natural.h;
      const initialScale = Math.max(scaleX, scaleY);

      setMinScale(initialScale);
      setScale(initialScale);

      const sw = natural.w * initialScale;
      const sh = natural.h * initialScale;
      setOffset({ x: (cw - sw) / 2, y: (ch - sh) / 2 });
    }
  };

  // ── Drag ─────────────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const raw = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
      setOffset(clampOffset(raw.x, raw.y, scale, containerSize.w, containerSize.h));
    },
    [isDragging, dragStart, scale, containerSize, clampOffset]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const t = e.touches[0];
      const raw = { x: t.clientX - dragStart.x, y: t.clientY - dragStart.y };
      setOffset(clampOffset(raw.x, raw.y, scale, containerSize.w, containerSize.h));
    },
    [isDragging, dragStart, scale, containerSize, clampOffset]
  );

  const stopDrag = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [handleMouseMove, handleTouchMove, stopDrag]);

  // ── Scale (zoom) ──────────────────────────────────────────────────────────
  const applyScale = useCallback(
    (newScale: number) => {
      const clamped = Math.max(minScale, Math.min(minScale * 4, newScale));
      // Scale around center of container
      const cx = containerSize.w / 2;
      const cy = containerSize.h / 2;
      const ratio = clamped / scale;
      const rawX = cx - (cx - offset.x) * ratio;
      const rawY = cy - (cy - offset.y) * ratio;
      setScale(clamped);
      setOffset(clampOffset(rawX, rawY, clamped, containerSize.w, containerSize.h));
    },
    [minScale, scale, offset, containerSize, clampOffset]
  );

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    applyScale(scale + delta * scale);
  };

  // ── Confirm: export via canvas ────────────────────────────────────────────
  const handleConfirm = () => {
    if (!imgRef.current || imgNatural.w === 0) return;

    const outW = 1200;
    const outH = Math.round(outW / aspectRatio); // e.g. 375 for 16:5

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Source region in natural-image space
    const srcX = -offset.x / scale;
    const srcY = -offset.y / scale;
    const srcW = containerSize.w / scale;
    const srcH = containerSize.h / scale;

    ctx.drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
    onConfirm(canvas.toDataURL("image/jpeg", 0.92));
  };

  const pct = minScale > 0 ? Math.round((scale / minScale) * 100) : 100;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
              <Move className="w-4 h-4 text-primary" />
              Cắt ảnh bìa
            </h3>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Kéo để định vị · Cuộn chuột để zoom · Tỉ lệ 16:5
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* ── Crop frame ─────────────────────────────────────────────────── */}
        <div className="p-5 shrink-0">
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-xl select-none border-2 border-primary shadow-lg"
            style={{ aspectRatio: `${aspectRatio}`, cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onWheel={handleWheel}
          >
            {/* Rule-of-thirds grid overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "33.33% 33.33%",
              }}
            />

            {/* Corner markers */}
            {[
              "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-lg",
              "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-lg",
              "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-lg",
              "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-lg",
            ].map((cls) => (
              <div key={cls} className={`absolute w-5 h-5 border-white z-20 pointer-events-none ${cls}`} />
            ))}

            {/* The image */}
            <img
              ref={imgRef}
              src={src}
              alt="Crop"
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: imgNatural.w > 0 ? imgNatural.w * scale : "100%",
                height: imgNatural.h > 0 ? imgNatural.h * scale : "auto",
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                userSelect: "none",
                pointerEvents: "none",
                willChange: "transform",
              }}
            />
          </div>

          {/* Zoom slider */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => applyScale(scale * 0.9)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all shrink-0"
            >
              <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
            </button>

            <input
              type="range"
              min={minScale}
              max={minScale * 4}
              step={0.001}
              value={scale}
              onChange={(e) => applyScale(Number(e.target.value))}
              className="flex-1 accent-primary h-1.5 rounded-full"
            />

            <button
              type="button"
              onClick={() => applyScale(scale * 1.1)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all shrink-0"
            >
              <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
            </button>

            <span className="text-xs font-bold text-on-surface-variant w-12 text-right shrink-0">
              {pct}%
            </span>
          </div>

          <p className="text-[10px] text-on-surface-variant/50 text-center mt-2 font-medium">
            Ảnh sẽ được xuất ở kích thước 1200 × 375 px
          </p>
        </div>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="flex gap-3 px-5 pb-5 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-on-surface hover:bg-slate-50 transition-all"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Xác nhận cắt ảnh
          </button>
        </div>
      </div>
    </div>
  );
}
