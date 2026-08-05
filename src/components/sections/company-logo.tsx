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
import type { Experience } from "@/data/constants";

/**
 * Company mark as a physical 3D chip.
 *
 * Extruded with stacked slices rather than four rotated side panels: panels need
 * the tile's exact pixel width to line up, which is responsive here, and any
 * error shows as a stray edge floating off the chip. Every slice is inset-0, so
 * the stack cannot misalign.
 *
 * Two performance rules this file exists to obey:
 *   - **No CSS filters.** A `brightness()` per slice, times a slice count, times
 *     a page of chips, is dozens of offscreen render passes — and on a retina
 *     display each one costs 4x the fill. Slice colours are mixed ahead of time
 *     into flat hex instead.
 *   - **Nothing animates off-screen.** The float is an infinite loop; gated on
 *     `useInView` so only the chips you can actually see are compositing.
 *
 * The chip also rests at an angle rather than face-on. Face-on it just looks
 * like a rounded square, and you'd only discover it was 3D by hovering it.
 *
 * Every logo is the company's own artwork, so each tile carries that brand's
 * background rather than a colour I picked. Companies with no public mark get
 * initials, the way LinkedIn does it, instead of a logo I'd have to invent.
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

export const CompanyLogo = ({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) => {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInView(hostRef, { margin: "120px" });

  // cursor position over the card, normalised to -0.5…0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [24, -24]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-30, 30]), spring);
  const sheenX = useTransform(px, [-0.5, 0.5], ["130%", "-30%"]);

  const handleMove = (e: React.MouseEvent) => {
    if (reduce) return;
    // track against the whole card, not the chip — a 64px hit area would make
    // the tilt feel twitchy and unreachable
    const card = hostRef.current?.closest("[data-experience-card]");
    const box = (card ?? hostRef.current)?.getBoundingClientRect();
    if (!box) return;
    px.set((e.clientX - box.left) / box.width - 0.5);
    py.set((e.clientY - box.top) / box.height - 0.5);
  };
  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  const { logo, monogram, logoBg, company } = experience;
  const face = logoBg ?? "#1e293b";
  const slices = Array.from({ length: SLICES }, (_, i) => {
    const t = i / (SLICES - 1); // 0 = back, 1 = just behind the face
    return {
      bg: shade(face, 0.28 + t * 0.42),
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
      className="relative shrink-0 size-16 md:size-20"
      aria-hidden
    >
      {/* static ground shadow — one cheap blurred layer, it doesn't animate */}
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
        {/* 2. resting tilt + endless float, in one element so the chip is
               visibly turned even when nobody is touching it */}
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
            {/* extruded body */}
            {slices.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-[1.15rem]"
                style={{
                  background: s.bg,
                  transform: `translateZ(${s.z}px)`,
                }}
              />
            ))}

            {/* front face */}
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
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className="size-full object-contain p-2"
                />
              ) : (
                <span className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
                  {monogram ?? company.slice(0, 2).toUpperCase()}
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

export default CompanyLogo;
