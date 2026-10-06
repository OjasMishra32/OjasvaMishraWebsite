"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import PdfPages from "./pdf-pages";

const COLORS = [
  "hsl(20,100%,70%)", // accent
  "#ffffff",
  "#5cc8ff",
  "#ff6bb9",
  "#9b8cff",
];

export default function ResumeDoodle({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const [active, setActive] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [wiped, setWiped] = useState(false);

  // Which viewer: the browser's own (iframe) or pdf.js. Phones get pdf.js —
  // iOS crops an iframe PDF to the screen and Android Chrome can't show one —
  // as does anything that says it has no inline PDF viewer. Unknown (null)
  // until mounted, so a phone never even loads the iframe: Android answers a
  // PDF in a frame by downloading it.
  const [usePdfJs, setUsePdfJs] = useState<boolean | null>(null);
  useEffect(() => {
    const phone = matchMedia("(max-width: 767px)");
    const update = () =>
      setUsePdfJs(phone.matches || navigator.pdfViewerEnabled === false);
    update();
    phone.addEventListener("change", update);
    return () => phone.removeEventListener("change", update);
  }, []);

  // Keep the canvas sized to the viewer (clears on resize — rare, fine for a doodle).
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const posFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = posFromEvent(e);
    // a single dot, so taps leave a mark too
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && last.current) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(last.current.x, last.current.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    setHasDrawing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || !drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const l = last.current;
    if (!ctx || !l) return;
    const p = posFromEvent(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const onPointerUp = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // quick wipe animation, then clear
    setWiped(true);
    window.setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawing(false);
      setWiped(false);
    }, 180);
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full">
      {usePdfJs === false && (
        <iframe
          src={src}
          title={title}
          className="relative z-0 block h-full w-full bg-white"
        />
      )}
      {usePdfJs && <PdfPages file={src.split("#")[0]} title={title} />}
      {/* phones size the card to the page, so hold a page's height until the
          viewer is chosen rather than letting the footer jump */}
      {usePdfJs === null && <div aria-hidden className="aspect-[612/792] md:hidden" />}

      {/* Doodle layer */}
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ opacity: wiped ? 0 : 1, transition: "opacity 160ms ease" }}
        className={cn(
          "absolute inset-0 z-10",
          active
            ? "pointer-events-auto cursor-crosshair touch-none"
            : "pointer-events-none"
        )}
      />

      {/* Floating toolbar (viewport-fixed FAB so it never overlaps the page) */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {/* Color swatches + clear appear in doodle mode */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 backdrop-blur-md"
            >
              {COLORS.map((c) => (
                <motion.button
                  key={c}
                  type="button"
                  aria-label={`Pick color ${c}`}
                  onClick={() => setColor(c)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    "h-5 w-5 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                    color === c ? "ring-2 ring-foreground" : "ring-0"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="mx-1 h-5 w-px bg-border" />
              <motion.button
                type="button"
                aria-label="Clear doodles"
                onClick={clear}
                disabled={!hasDrawing}
                whileHover={{ scale: hasDrawing ? 1.1 : 1 }}
                whileTap={{ scale: hasDrawing ? 0.85 : 1 }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                  hasDrawing
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground/30"
                )}
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          type="button"
          onClick={() => setActive((a) => !a)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          aria-pressed={active}
          className={cn(
            "group flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg transition-colors",
            active
              ? "bg-[hsl(20,100%,70%)] text-black"
              : "border border-border/60 bg-background/80 text-foreground backdrop-blur-md hover:border-[hsl(20,100%,70%)]/40"
          )}
        >
          <motion.span
            animate={active ? { rotate: [0, -18, 14, -8, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            {active ? (
              <Check className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </motion.span>
          {active ? "Done" : "Doodle on it"}
        </motion.button>
      </div>
    </div>
  );
}
