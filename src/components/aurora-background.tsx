"use client";

import { usePerfProfile } from "@/hooks/use-perf-profile";

/**
 * Slow-drifting aurora behind everything.
 *
 * Built from large radial gradients rather than blurred blobs on purpose. A
 * `filter: blur()` big enough to soften a 900px shape is one of the most
 * expensive things you can put on a page — and this one would be full-screen,
 * animating, under a live WebGL canvas. A radial gradient is soft for free,
 * costs a single paint, and the animation only ever touches `transform`, so it
 * stays on the compositor and never triggers layout or repaint.
 *
 * Sits at -z-20, under the particle field (-z-10) and everything else.
 */
const AuroraBackground = () => {
  const { disableDecorative } = usePerfProfile();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {/* base wash — keeps light mode off flat white and dark mode off flat black */}
      <div className="absolute inset-0 bg-[var(--aurora-base)]" />

      {!disableDecorative && (
        <>
          <span className="aurora-blob aurora-blob-1" />
          <span className="aurora-blob aurora-blob-2" />
          <span className="aurora-blob aurora-blob-3" />
        </>
      )}

      {/* a faint grid, so the emptiness reads as designed rather than unfinished */}
      <div className="absolute inset-0 aurora-grid" />

      {/* vignette pulls focus back to the middle of the page */}
      <div className="absolute inset-0 bg-[var(--aurora-vignette)]" />
    </div>
  );
};

export default AuroraBackground;
