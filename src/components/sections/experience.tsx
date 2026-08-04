"use client";

import { EXPERIENCE, SkillNames, SKILLS, type Experience } from "@/data/constants";
import { SectionHeader } from "./section-header";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Company mark, as a rounded-square tile.
 *
 * Every logo here is the company's own artwork pulled from their own site, so
 * each tile carries the brand's background colour rather than a colour I picked
 * — that's what keeps a row of them from looking like a sticker sheet. Companies
 * with no public mark to pull get initials in the same tile, the way LinkedIn
 * does it, instead of a logo I'd have to invent.
 *
 * The tile is the only thing on the page that moves on its own: it springs in
 * once when scrolled to, then only responds to hover. Restraint is the point.
 */
const CompanyLogo = ({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) => {
  const reduce = useReducedMotion();
  const { logo, monogram, logoBg, company } = experience;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
        delay: 0.08 + index * 0.06,
      }}
      whileHover={reduce ? undefined : { scale: 1.06, rotate: -3 }}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-2xl",
        "size-14 md:size-16",
        "ring-1 ring-border/70 shadow-sm",
        "flex items-center justify-center"
      )}
      style={{ background: logoBg ?? "hsl(var(--secondary))" }}
      aria-hidden
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="size-full object-contain p-2"
        />
      ) : (
        <span className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
          {monogram ?? company.slice(0, 2).toUpperCase()}
        </span>
      )}
      {/* a single soft highlight across the top edge, so the tile reads as a
          physical chip rather than a flat swatch */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%)",
        }}
      />
    </motion.div>
  );
};

const ExperienceSection = () => {
  return (
    <SectionWrapper
      id="experience"
      className="flex flex-col items-center justify-center min-h-[120vh] py-20"
    >
      <div className="w-full max-w-4xl px-4 md:px-8 mx-auto">
        <SectionHeader
          id="experience"
          title="Experience"
          desc="Robotics research, founding teams, and things that had to work in the physical world."
          className="mb-12 md:mb-20 mt-0"
        />

        <div className="flex flex-col gap-8 md:gap-12 relative">
          {EXPERIENCE.map((exp, index) => (
            <div key={exp.id} className="relative">
              <ExperienceCard experience={exp} index={index} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

const ExperienceCard = ({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card
        className={cn(
          "group bg-card text-card-foreground border-border",
          "hover:border-primary/20 transition-colors duration-300",
          "shadow-sm hover:shadow-md"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <CompanyLogo experience={experience} index={index} />
              <div className="space-y-1 min-w-0">
                <CardTitle className="text-lg md:text-xl font-bold tracking-tight">
                  {experience.title}
                </CardTitle>
                <div className="text-base font-medium text-muted-foreground">
                  {experience.companyUrl ? (
                    <Link
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {experience.company}
                      <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-70 group-hover:translate-x-0" />
                    </Link>
                  ) : (
                    experience.company
                  )}
                </div>
                {experience.blurb && (
                  <p className="font-mono text-xs text-muted-foreground/80">
                    {experience.blurb}
                  </p>
                )}
              </div>
            </div>
            <Badge
              variant="secondary"
              className="w-fit shrink-0 font-mono text-xs font-normal"
            >
              {experience.startDate} — {experience.endDate}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="list-disc list-outside ml-4 space-y-2 text-base text-muted-foreground leading-relaxed">
            {experience.description.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skillName) => {
              const skill = SKILLS[skillName as SkillNames];
              if (!skill) return null;
              return (
                <Badge
                  key={skillName}
                  variant="outline"
                  className="gap-2 text-xs font-normal bg-secondary/30 hover:bg-secondary/50 transition-colors border-transparent"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={skill.icon}
                    alt=""
                    className="w-3.5 h-3.5 object-contain opacity-80"
                  />
                  {skill.label}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExperienceSection;
