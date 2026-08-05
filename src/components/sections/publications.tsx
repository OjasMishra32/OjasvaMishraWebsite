"use client";

import { PUBLICATIONS } from "@/data/constants";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Publications get their own section rather than a project card. Two
 * first-author papers under IEEE review is the least replaceable thing on this
 * page, and burying it in a grid of side projects undersells it — so it's set
 * like a reference list, with the venue doing the talking.
 */
const PublicationsSection = () => {
  return (
    <SectionWrapper id="publications" className="py-24">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
        <SectionHeader
          id="publications"
          title="Publications"
          desc="First author, both under review. Actuator saturation — when the motor can't do what the controller asked."
          className="static mb-14 md:mb-24 mt-0"
        />

        <ol className="flex flex-col gap-5">
          {PUBLICATIONS.map((pub, i) => (
            <motion.li
              key={pub.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className={cn(
                "group relative rounded-2xl border border-border p-6 md:p-8",
                "bg-card/95",
                "transition-[border-color,background-color,box-shadow] duration-300",
                "hover:border-primary/30 hover:bg-card",
                "hover:shadow-[0_24px_70px_-40px_hsl(var(--foreground)/0.6)]"
              )}
            >
              <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] text-muted-foreground/70">
                <span>[{i + 1}]</span>
                <span>{pub.year}</span>
              </div>

              <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-foreground md:text-xl">
                {pub.title}
              </h3>

              <p className="mt-3 text-sm text-muted-foreground">{pub.authors}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
                <span className="rounded-full border border-primary/30 px-3 py-1 text-foreground/90">
                  {pub.venue}
                </span>
                <span className="text-muted-foreground">{pub.status}</span>
              </div>

              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                {pub.abstract}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                {pub.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 text-sm text-foreground/80 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {l.label}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                ))}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
};

export default PublicationsSection;
