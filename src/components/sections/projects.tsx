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
import { SectionHeader } from "./section-header";

import SectionWrapper from "../ui/section-wrapper";

const ProjectsSection = () => {
  return (
    <SectionWrapper
      id="projects"
      className="max-w-7xl mx-auto md:min-h-[130vh] px-4"
    >
      <SectionHeader
        id="projects"
        title="Projects"
        desc="Papers, products, and one robot that plugs a car in by itself."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
};

/**
 * Project card.
 *
 * Deliberately typographic rather than a screenshot: most of this work isn't a
 * webpage. A paper on actuator saturation, an iOS app, and a robot that docks
 * with a charging port have no landing page worth photographing, and faking one
 * for the two that do would make the grid lie about what the work is. So the
 * card shows the things that actually distinguish a project — what it is, my
 * role, and the single hardest-to-fake fact about it — and the detail lives one
 * click away.
 */
const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const reduce = useReducedMotion();
  const hasLive = project.live && project.live !== "#";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: "easeOut" }}
      className="flex"
    >
      <ResponsiveDialog>
        <ResponsiveDialogTrigger className="bg-transparent flex w-full text-left">
          <article
            className={cn(
              "group relative flex w-full flex-col justify-between",
              "min-h-[15rem] md:min-h-[17rem] rounded-xl p-5 md:p-6",
              "border border-border bg-card/90 backdrop-blur-md",
              "transition-[transform,border-color,background-color,box-shadow] duration-300",
              "hover:-translate-y-1 hover:border-primary/30 hover:bg-card",
              "hover:shadow-[0_16px_50px_-24px_hsl(var(--foreground)/0.45)]"
            )}
          >
            {/* index + period */}
            <div className="flex items-baseline justify-between font-mono text-[11px] text-muted-foreground/70">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{project.period}</span>
            </div>

            {/* the body */}
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

            {/* the line that does the convincing */}
            <div className="mt-6 border-t border-border pt-3">
              <p className="font-mono text-[11px] leading-relaxed text-foreground/80">
                {project.proof}
              </p>
              <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-muted-foreground/70">
                {project.role}
                <ArrowUpRight className="size-3 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0" />
              </p>
            </div>
          </article>
        </ResponsiveDialogTrigger>

        <ResponsiveDialogContent className="md:max-w-4xl md:h-[85vh] md:!flex md:flex-col md:overflow-hidden md:p-0 md:gap-0">
          {/* Sticky header */}
          <div className="shrink-0 border-b border-border bg-background/80 backdrop-blur-sm px-8 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <h4 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">
                  {project.title}
                </h4>
                <span className="shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-0.5">
                  {project.category}
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-4">
                {project.github && project.github !== "#" && (
                  <Link
                    href={project.github}
                    target="_blank"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Source
                  </Link>
                )}
                {hasLive && (
                  <Link href={project.live} target="_blank">
                    <button className="group flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full hover:bg-primary/80 transition-colors">
                      Visit
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <ScrollArea className="flex-1" type="always" data-lenis-prevent>
            <div className="px-8 py-8">
              {/* the facts, before the prose */}
              <motion.dl
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-border py-5 sm:grid-cols-3"
              >
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
              </motion.dl>

              {/* Tech stack */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10"
              >
                {project.skills.frontend?.length > 0 && (
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                      Frontend
                    </span>
                    <FloatingDock items={project.skills.frontend} />
                  </div>
                )}
                {project.skills.backend?.length > 0 && (
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                      Backend
                    </span>
                    <FloatingDock items={project.skills.backend} />
                  </div>
                )}
              </motion.div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

              {/* Project content */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {project.content}
              </motion.div>
            </div>
          </ScrollArea>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </motion.div>
  );
};

export default ProjectsSection;
