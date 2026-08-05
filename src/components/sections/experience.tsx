"use client";

import {
  EXPERIENCE,
  SkillNames,
  SKILLS,
  type Experience,
} from "@/data/constants";
import { SectionHeader } from "./section-header";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import CompanyLogo from "./company-logo";

const ExperienceSection = () => {
  return (
    <SectionWrapper
      id="experience"
      className="flex flex-col items-center justify-center py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
        <SectionHeader
          id="experience"
          title="Experience"
          desc="Robotics research, founding teams, and things that had to work in the physical world."
          className="static mb-14 md:mb-24 mt-0"
        />

        {/* the spine the whole timeline hangs off */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute left-8 top-0 bottom-0 hidden w-px md:left-10 md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, hsl(var(--border)) 8%, hsl(var(--border)) 92%, transparent)",
            }}
          />
          <div className="flex flex-col gap-10 md:gap-16">
            {EXPERIENCE.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </div>
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
  const isCurrent = experience.endDate === "Present";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-60px" }}
      data-experience-card
      className={cn(
        "group relative rounded-2xl border border-border p-6 md:p-8",
        "bg-card/95",
        "transition-[border-color,background-color,box-shadow] duration-300",
        "hover:border-primary/30 hover:bg-card",
        "hover:shadow-[0_24px_70px_-40px_hsl(var(--foreground)/0.6)]"
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* the chip, sized to actually be seen */}
        <div className="flex shrink-0 items-start">
          <CompanyLogo experience={experience} index={index} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
                {experience.title}
              </h3>
              <div className="mt-1 text-base font-medium text-muted-foreground md:text-lg">
                {experience.companyUrl ? (
                  <Link
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    {experience.company}
                    <ArrowUpRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-70" />
                  </Link>
                ) : (
                  experience.company
                )}
              </div>
              {experience.blurb && (
                <p className="mt-1 font-mono text-xs text-muted-foreground/80">
                  {experience.blurb}
                </p>
              )}
            </div>

            <Badge
              variant={isCurrent ? "default" : "secondary"}
              className="w-fit shrink-0 font-mono text-xs font-normal"
            >
              {experience.startDate} — {experience.endDate}
            </Badge>
          </div>

          {experience.description.length > 0 && (
            <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-muted-foreground md:text-base">
              {experience.description.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.6em] size-1 shrink-0 rounded-full bg-muted-foreground/50"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {experience.skills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {experience.skills.map((skillName) => {
                const skill = SKILLS[skillName as SkillNames];
                if (!skill) return null;
                return (
                  <Badge
                    key={skillName}
                    variant="outline"
                    className="gap-2 border-transparent bg-secondary/30 text-xs font-normal transition-colors hover:bg-secondary/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.icon}
                      alt=""
                      loading="lazy"
                      className="size-3.5 object-contain opacity-80"
                    />
                    {skill.label}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ExperienceSection;
