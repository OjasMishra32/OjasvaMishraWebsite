"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A logo rendered as a physical 3D chip: extruded, resting at an angle,
 * floating, and tilting toward the cursor.
 *
 * Extruded with stacked slices rather than four rotated side panels — panels
 * need the tile's exact pixel width to line up, which is responsive here, and
 * any error shows as a stray edge floating off the chip. Every slice is
 * inset-0, so the stack cannot misalign.
 *
 * Two performance rules this file exists to obey, because the page carries
 * twenty-odd of these:
 *   - **No CSS filters.** A `brightness()` per slice, times a slice count,
 *     times a page of chips, is dozens of offscreen render passes — and on a
 *     retina display each costs 4x the fill. Slice colours are mixed to flat
 *     rgb up front instead.
 *   - **Nothing animates off-screen.** The float is an infinite loop, gated on
 *     `useInView` so only visible chips composite.
 *
 * It rests at an angle rather than face-on. Face-on it just looks like a
 * rounded square and you'd only discover it was 3D by hovering it.
 */

const DEPTH = 16; // px of extrusion — half forward of centre, half behind
const SLICES = 7;

/** Mix a hex colour toward black. Cheap stand-in for filter: brightness(). */
const shade = (hex: string, k: number) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  const c = [1, 2, 3].map((i) =>
    Math.max(0, Math.min(255, Math.round(parseInt(m[i], 16) * k)))
  );
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

export type Chip3DProps = {
  /** Image to sit on the chip face. */
  src?: string;
  /** Initials, when a brand's mark is set in type and there's no image. */
  monogram?: string;
  monogramColor?: string;
  /** Face background — any CSS background, gradients included. */
  bg?: string;
  /** The art is already an app icon, so it fills the face edge-to-edge. */
  fullBleed?: boolean;
  /** Staggers the float so a column of chips doesn't pulse in lockstep. */
  index?: number;
  /**
   * Selector for the element the cursor tilt tracks. A 64px chip is too small
   * a hit area to aim at, so the tilt normally follows the whole card.
   */
  trackSelector?: string;
  className?: string;
};

export const Chip3D = ({
  src,
  monogram,
  monogramColor,
  bg,
  fullBleed,
  index = 0,
  trackSelector = "[data-chip-track]",
  className,
}: Chip3DProps) => {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInView(hostRef, { margin: "120px" });

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [24, -24]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-30, 30]), spring);
  const sheenX = useTransform(px, [-0.5, 0.5], ["130%", "-30%"]);

  const handleMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const track = hostRef.current?.closest(trackSelector);
    const box = (track ?? hostRef.current)?.getBoundingClientRect();
    if (!box) return;
    px.set((e.clientX - box.left) / box.width - 0.5);
    py.set((e.clientY - box.top) / box.height - 0.5);
  };
  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  const face = bg ?? "#1e293b";
  // `shade` only understands hex; a gradient face (a brand whose mark is a
  // gradient wordmark) extrudes with a neutral dark edge instead.
  const edge = /^#?[a-f\d]{6}$/i.test(face.trim()) ? face : "#2a2a2e";
  const slices = Array.from({ length: SLICES }, (_, i) => {
    const t = i / (SLICES - 1);
    return {
      bg: shade(edge, 0.28 + t * 0.42),
      z: (-DEPTH / 2 + t * DEPTH).toFixed(2),
    };
  });

  return (
    <div
      ref={hostRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      // Perspective has to scale with the object. At 600px on a 72px chip the
      // rotation is nearly orthographic and reads as a flat card sliding; ~4x
      // the chip's own size is where the foreshortening becomes obvious.
      style={{ perspective: 280, perspectiveOrigin: "50% 50%" }}
      className={cn("relative shrink-0 size-16 md:size-20", className)}
      aria-hidden
    >
      {/* static ground shadow — a gradient, not a blur, so it costs nothing */}
      <div
        className="absolute inset-x-1 bottom-0 h-3 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)",
        }}
      />

      {/* 1. swing-in, once */}
      <motion.div
        initial={
          reduce
            ? false
            : { opacity: 0, rotateY: -80, rotateX: 20, z: -160, scale: 0.5 }
        }
        whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, z: 0, scale: 1 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 13,
          mass: 0.9,
          delay: 0.08 + index * 0.07,
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="size-full"
      >
        {/* 2. resting tilt + endless float, in one element so the chip reads as
               turned even when nobody is touching it */}
        <motion.div
          animate={
            reduce || !inView
              ? { rotateY: -22, rotateX: 9, y: 0 }
              : {
                  rotateY: [-28, -10, -28],
                  rotateX: [12, 5, 12],
                  y: [0, -7, 0],
                }
          }
          transition={
            reduce || !inView
              ? { duration: 0.4 }
              : {
                  duration: 8 + index * 0.6,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: index * 0.4,
                }
          }
          style={{ transformStyle: "preserve-3d" }}
          className="size-full"
        >
          {/* 3. cursor tilt, layered on top of the resting angle */}
          <motion.div
            style={{
              rotateX: reduce ? 0 : rotateX,
              rotateY: reduce ? 0 : rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative size-full"
          >
            {slices.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-[1.15rem]"
                style={{ background: s.bg, transform: `translateZ(${s.z}px)` }}
              />
            ))}

            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center overflow-hidden",
                "rounded-[1.15rem] ring-1 ring-white/15"
              )}
              style={{
                background: face,
                transform: `translateZ(${DEPTH / 2}px)`,
              }}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className={cn(
                    "size-full",
                    fullBleed ? "object-cover" : "object-contain p-2"
                  )}
                />
              ) : (
                <span
                  className="font-display text-base font-bold tracking-tight text-white md:text-lg"
                  style={monogramColor ? { color: monogramColor } : undefined}
                >
                  {monogram}
                </span>
              )}

              {/* specular sweep that tracks the tilt */}
              <motion.span
                style={{ x: reduce ? "50%" : sheenX }}
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-12"
              >
                <span className="block size-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </motion.span>

              {/* top-edge light, so the chip reads as lit from above */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.24), rgba(255,255,255,0) 45%)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Chip3D;
