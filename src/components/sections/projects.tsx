"use client";
import React from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
} from "../ui/responsive-dialog";
import { FloatingDock } from "../ui/floating-dock";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

import projects, { Project } from "@/data/projects";
import Chip3D from "../ui/chip-3d";
import { SectionHeader } from "./section-header";

import SectionWrapper from "../ui/section-wrapper";

const ProjectsSection = () => {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <SectionWrapper id="projects" className="mx-auto max-w-7xl px-4 py-24">
      <SectionHeader
        id="projects"
        title="Projects"
        desc="Papers, products, and one robot that plugs a car in by itself."
        className="static mb-14 md:mb-24 mt-0"
      />

      {featured && <FeaturedCard project={featured} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i + 1} />
        ))}
      </div>
    </SectionWrapper>
  );
};

/**
 * Project cards are typographic rather than screenshots: most of this work
 * isn't a webpage. A paper on actuator saturation, an iOS app, and a robot that
 * docks with a charging port have no landing page worth photographing, and
 * faking one for the two that do would make the grid lie about what the work
 * is. So a card shows what actually distinguishes a project — what it is, the
 * role, and the single hardest-to-fake fact about it — with detail one click
 * away.
 */

/** The one project that gets the full width, before the grid starts. */
const FeaturedCard = ({ project }: { project: Project }) => {
  const reduce = useReducedMotion();

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger className="mb-4 block w-full bg-transparent text-left">
        <motion.article
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-border p-7 md:p-12",
            "bg-card/95",
            "transition-[transform,border-color,background-color,box-shadow] duration-300",
            "hover:-translate-y-1 hover:border-primary/40 hover:bg-card",
            "hover:shadow-[0_28px_80px_-40px_hsl(var(--foreground)/0.65)]"
          )}
          data-chip-track
        >
          {/* a single wash of accent, anchored to one corner — the only place
              on the page that gets colour, so it reads as emphasis not decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-[0.10] blur-2xl"
            style={{ background: "hsl(var(--primary))" }}
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/90">
                  Featured
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {project.category}
                </span>
              </div>

              <h3 className="mt-5 font-display text-4xl font-bold leading-none tracking-tight text-foreground md:text-6xl">
                {project.title}
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {project.tagline}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
                <span className="text-foreground/85">{project.proof}</span>
                <span className="opacity-40">/</span>
                <span>{project.role}</span>
                <span className="opacity-40">/</span>
                <span>{project.period}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-6 md:items-end">
              {project.emblem && (
                <Chip3D
                  {...project.emblem}
                  index={0}
                  trackSelector="[data-chip-track]"
                  className="size-24 md:size-32"
                />
              )}
              <div className="flex items-center gap-2 font-mono text-sm text-foreground/80">
                {project.liveLabel}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </motion.article>
      </ResponsiveDialogTrigger>
      <ProjectDialog project={project} />
    </ResponsiveDialog>
  );
};

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.07, ease: "easeOut" }}
      className="flex"
    >
      <ResponsiveDialog>
        <ResponsiveDialogTrigger className="flex w-full bg-transparent text-left">
          <article
            className={cn(
              "group relative flex w-full flex-col justify-between",
              "min-h-[15rem] rounded-xl p-5 md:min-h-[17rem] md:p-6",
              "border border-border bg-card/95",
              "transition-[transform,border-color,background-color,box-shadow] duration-300",
              "hover:-translate-y-1 hover:border-primary/30 hover:bg-card",
              "hover:shadow-[0_16px_50px_-24px_hsl(var(--foreground)/0.45)]"
            )}
            data-chip-track
          >
            <div className="flex items-baseline justify-between font-mono text-[11px] text-muted-foreground/70">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{project.period}</span>
            </div>

            <div className="mt-6 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {project.category}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-foreground md:text-[1.75rem]">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            </div>

            {/* the line that does the convincing, with the project's own mark */}
            <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-4">
              <div className="min-w-0">
                <p className="font-mono text-[11px] leading-relaxed text-foreground/80">
                  {project.proof}
                </p>
                <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-muted-foreground/70">
                  {project.role}
                  <ArrowUpRight className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60" />
                </p>
              </div>
              {project.emblem && (
                <Chip3D
                  {...project.emblem}
                  index={index}
                  trackSelector="[data-chip-track]"
                  className="size-14 md:size-16"
                />
              )}
            </div>
          </article>
        </ResponsiveDialogTrigger>
        <ProjectDialog project={project} />
      </ResponsiveDialog>
    </motion.div>
  );
};

const ProjectDialog = ({ project }: { project: Project }) => {
  const hasLive = project.live && project.live !== "#";

  return (
    <ResponsiveDialogContent className="md:h-[85vh] md:max-w-4xl md:!flex md:flex-col md:gap-0 md:overflow-hidden md:p-0">
      {/* Sticky header */}
      <div className="shrink-0 border-b border-border bg-background/80 px-8 py-5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <h4 className="truncate font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {project.title}
            </h4>
            <span className="shrink-0 rounded-full border border-border px-3 py-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
              {project.category}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {project.github && project.github !== "#" && (
              <Link
                href={project.github}
                target="_blank"
                className="text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Source
              </Link>
            )}
            {hasLive && (
              <Link href={project.live} target="_blank">
                <button className="group flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80">
                  Visit
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1" type="always" data-lenis-prevent>
        <div className="px-8 py-8">
          {/* the facts, before the prose */}
          <dl className="mb-10 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-border py-5 sm:grid-cols-3">
            {[
              { k: "Role", v: project.role },
              { k: "Period", v: project.period },
              { k: "Status", v: project.proof },
            ].map((f) => (
              <div key={f.k}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {f.k}
                </dt>
                <dd className="mt-1 text-sm text-foreground/90">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mb-10 flex flex-col gap-6 md:flex-row md:gap-10">
            {project.skills.frontend?.length > 0 && (
              <div className="flex flex-col items-center gap-2 md:items-start">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Frontend
                </span>
                <FloatingDock items={project.skills.frontend} />
              </div>
            )}
            {project.skills.backend?.length > 0 && (
              <div className="flex flex-col items-center gap-2 md:items-start">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Backend
                </span>
                <FloatingDock items={project.skills.backend} />
              </div>
            )}
          </div>

          <div className="mb-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {project.content}
        </div>
      </ScrollArea>
    </ResponsiveDialogContent>
  );
};

export default ProjectsSection;
