"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist/legacy/build/pdf.mjs";

type PageLink = { href: string; left: number; top: number; width: number; height: number };
type PageInfo = { ratio: number; links: PageLink[] };

/**
 * The résumé drawn with pdf.js, for phones.
 *
 * An <iframe> PDF is at the mercy of the browser's own viewer, and on a phone
 * that goes badly: iOS Safari renders the page at its full print width and
 * crops it to the screen, and Android Chrome mostly shows nothing at all. So on
 * small screens each page is drawn onto a canvas sized to the column, with the
 * PDF's own links laid back over it so they stay tappable.
 */
export default function PdfPages({ file, title }: { file: string; title: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<PageInfo[] | null>(null);
  const [failed, setFailed] = useState(false);

  // Load the document and read each page's shape and links.
  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        // Parse on the main thread: a one-page résumé takes a few milliseconds,
        // and it saves shipping and wiring up a separate worker file.
        await import("pdfjs-dist/legacy/build/pdf.worker.min.mjs");

        const task = pdfjs.getDocument({
          url: file,
          verbosity: pdfjs.VerbosityLevel.ERRORS,
        });
        destroy = () => void task.destroy();
        const doc = await task.promise;
        if (cancelled) return;
        docRef.current = doc;

        const info: PageInfo[] = [];
        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const vp = page.getViewport({ scale: 1 });
          const annotations = await page.getAnnotations();
          const links = annotations
            .filter((a) => a.subtype === "Link" && typeof a.url === "string")
            .map((a) => {
              const [x1, y1] = vp.convertToViewportPoint(a.rect[0], a.rect[1]);
              const [x2, y2] = vp.convertToViewportPoint(a.rect[2], a.rect[3]);
              return {
                href: a.url as string,
                left: Math.min(x1, x2) / vp.width,
                top: Math.min(y1, y2) / vp.height,
                width: Math.abs(x2 - x1) / vp.width,
                height: Math.abs(y2 - y1) / vp.height,
              };
            });
          info.push({ ratio: vp.width / vp.height, links });
        }
        if (!cancelled) setPages(info);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [file]);

  // Draw the pages, and redraw when the column changes width (rotation).
  useEffect(() => {
    const doc = docRef.current;
    const host = hostRef.current;
    if (!pages || !doc || !host) return;

    let drawnWidth = 0;
    let tasks: RenderTask[] = [];

    const draw = async () => {
      const width = host.clientWidth;
      if (!width || width === drawnWidth) return;
      drawnWidth = width;
      tasks.forEach((t) => t.cancel());
      tasks = [];

      // Denser than the screen so a pinch-zoom stays readable, capped so the
      // canvas doesn't eat a phone's memory.
      const density = Math.min((window.devicePixelRatio || 1) * 1.5, 4);
      for (let i = 0; i < pages.length; i++) {
        const canvas = canvasRefs.current[i];
        if (!canvas) continue;
        const page = await doc.getPage(i + 1);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (width / base.width) * density });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const task = page.render({ canvas, viewport });
        tasks.push(task);
        try {
          await task.promise;
        } catch {
          return; // superseded by a newer draw
        }
      }
    };

    draw();
    const ro = new ResizeObserver(() => void draw());
    ro.observe(host);
    return () => {
      ro.disconnect();
      tasks.forEach((t) => t.cancel());
    };
  }, [pages]);

  if (failed) {
    return (
      <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-3 p-8 text-center text-sm text-slate-600">
        <p>The preview couldn&apos;t load on this device.</p>
        <a href={file} target="_blank" rel="noopener" className="font-medium text-slate-900 underline underline-offset-4">
          Open the PDF
        </a>
      </div>
    );
  }

  return (
    <div ref={hostRef} role="document" aria-label={title} className="w-full">
      {(pages ?? [{ ratio: 612 / 792, links: [] }]).map((page, i) => (
        <div
          key={i}
          className="relative w-full border-slate-200 [&+&]:border-t"
          style={{ aspectRatio: page.ratio }}
        >
          <canvas
            ref={(el) => {
              canvasRefs.current[i] = el;
            }}
            className="absolute inset-0 h-full w-full"
          />
          {page.links.map((l, j) => (
            <a
              key={j}
              href={l.href}
              target={l.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener"
              aria-label={l.href.replace(/^mailto:/, "")}
              className="absolute"
              style={{
                left: `${l.left * 100}%`,
                top: `${l.top * 100}%`,
                width: `${l.width * 100}%`,
                height: `${l.height * 100}%`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
