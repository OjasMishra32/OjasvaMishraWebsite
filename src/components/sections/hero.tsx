import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { File, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreloader } from "../preloader";
import { BlurIn, BoxReveal } from "../reveal-animations";
import ScrollDownIcon from "../scroll-down-icon";
import { motion, useReducedMotion } from "motion/react";
import { SiGithub } from "react-icons/si";
// LinkedIn was dropped from simple-icons (trademark), so it comes from Font Awesome.
import { FaLinkedin } from "react-icons/fa6";
import { config } from "@/data/config";

import SectionWrapper from "../ui/section-wrapper";

/**
 * The proof line. Someone scanning this page for ten seconds should leave with
 * the three things that are hardest to fake — so they sit directly under the
 * name instead of three screens down.
 */
const CREDENTIALS: {
  label: string;
  detail: string;
  href?: string;
}[] = [
  { label: "Co-founder & CEO", detail: "Twinly", href: "https://twinly.tech" },
  { label: "Incoming freshman", detail: "UF · B.S. CE + M.S. Finance" },
  { label: "Researcher", detail: "CMU Robotics Institute" },
];

/**
 * The one bit of salesmanship on the page. It arrives after the hero has
 * settled so it reads as an aside rather than a popup, keeps bobbing gently so
 * the eye catches it on the way past, and is a real mailto rather than
 * decoration.
 */
const TwinlyPerk = () => {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href="mailto:founders@twinly.tech?subject=Sent%20by%20ojasvamishra.me"
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 2.6 }}
      whileHover={reduce ? undefined : { scale: 1.04, rotate: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group/perk relative mt-4 inline-flex w-fit items-center gap-2",
        "rounded-2xl rounded-tl-md border border-primary/40 bg-primary/10",
        "px-3.5 py-2 font-mono text-[11px] leading-tight text-foreground/90",
        "backdrop-blur-[2px] transition-colors hover:bg-primary/20 sm:text-xs"
      )}
    >
      {/* the tail, pointing back up at the Twinly line it belongs to */}
      <span
        aria-hidden
        className="absolute -top-[7px] left-3 size-3 rotate-45 border-l border-t border-primary/40 bg-primary/10"
      />
      <motion.span
        aria-hidden
        animate={reduce ? undefined : { rotate: [0, 14, -8, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 3.5,
          ease: "easeInOut",
        }}
        className="text-sm"
      >
        👋
      </motion.span>
      <span>
        psst — email{" "}
        <span className="font-semibold text-foreground underline decoration-primary/60 underline-offset-2">
          founders@twinly.tech
        </span>{" "}
        and mention this site for a <em className="not-italic font-semibold">big</em> discount
      </span>
    </motion.a>
  );
};

const HeroSection = () => {
  const { isLoading } = usePreloader();

  return (
    <SectionWrapper id="hero" className={cn("relative w-full h-screen")}>
      <div className="grid md:grid-cols-2">
        <div
          className={cn(
            "h-[calc(100dvh-3rem)] md:h-[calc(100dvh-4rem)] z-[2]",
            "col-span-1",
            "flex flex-col justify-start md:justify-center items-center md:items-start",
            "pt-28 sm:pb-16 md:p-20 lg:p-24 xl:p-28"
          )}
        >
          {!isLoading && (
            <div className="flex flex-col">
              <div>
                <BlurIn delay={0.7}>
                  <p
                    className={cn(
                      "md:self-start mt-4 font-medium text-md text-slate-500 dark:text-zinc-400",
                      "cursor-default sm:text-xl md:text-xl whitespace-nowrap bg-clip-text "
                    )}
                  >
                    Hi, I am
                    <br className="md:hidden" />
                  </p>
                </BlurIn>

                <BlurIn delay={1}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <h1
                        className={cn(
                          "-ml-[6px] leading-none text-transparent text-slate-800 text-left",
                          "font-bold text-6xl sm:text-7xl lg:text-8xl xl:text-9xl",
                          "cursor-default text-edge-outline font-display "
                        )}
                      >
                        {config.author.split(" ")[0]}
                        <br className="md:block hiidden" />
                        {config.author.split(" ")[1]}
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="dark:bg-white dark:text-black"
                    >
                      theres something waiting for you in devtools
                    </TooltipContent>
                  </Tooltip>
                </BlurIn>

                <BlurIn delay={1.2}>
                  <p
                    className={cn(
                      "md:self-start md:mt-4 font-medium text-md text-slate-500 dark:text-zinc-400",
                      "cursor-default sm:text-xl md:text-xl bg-clip-text"
                    )}
                  >
                    I build robots that think, and software that ships.
                  </p>
                </BlurIn>

                <BlurIn delay={1.4}>
                  <ul className="mt-6 flex flex-col gap-1.5 border-l border-border pl-4">
                    {CREDENTIALS.map((c) => (
                      <li
                        key={c.label}
                        className="text-sm text-slate-500 dark:text-zinc-400 sm:text-base"
                      >
                        <span className="font-medium text-slate-700 dark:text-zinc-200">
                          {c.label}
                        </span>
                        <span className="mx-2 opacity-40">/</span>
                        {c.href ? (
                          <Link
                            href={c.href}
                            target="_blank"
                            rel="noopener"
                            className="font-mono text-xs underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground sm:text-sm"
                          >
                            {c.detail}
                          </Link>
                        ) : (
                          <span className="font-mono text-xs sm:text-sm">
                            {c.detail}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <TwinlyPerk />
                </BlurIn>
              </div>

              <div className="mt-8 flex flex-col gap-3 w-fit">
                <div className="md:self-start flex flex-wrap gap-3">
                  <Link href={"/resume"}>
                    <BoxReveal delay={2} width="100%">
                      <Button className="flex items-center gap-2">
                        <File size={20} />
                        <p>Résumé</p>
                      </Button>
                    </BoxReveal>
                  </Link>
                  <Link href={"#contact"}>
                    <BoxReveal delay={2.1} width="100%">
                      <Button
                        variant={"outline"}
                        className="flex items-center gap-2"
                      >
                        <Mail size={20} />
                        <p>Get in touch</p>
                      </Button>
                    </BoxReveal>
                  </Link>
                </div>
                <div className="md:self-start flex gap-3">
                  <div className="flex items-center h-full gap-2">
                    <Link
                      href={config.social.github}
                      target="_blank"
                      aria-label="GitHub"
                      className="cursor-can-hover"
                    >
                      <Button variant={"outline"} size={"icon"}>
                        <SiGithub size={20} />
                      </Button>
                    </Link>
                    <Link
                      href={config.social.linkedin}
                      target="_blank"
                      aria-label="LinkedIn"
                      className="cursor-can-hover"
                    >
                      <Button variant={"outline"} size={"icon"}>
                        <FaLinkedin size={20} />
                      </Button>
                    </Link>
                    <Link
                      href={`mailto:${config.email}`}
                      aria-label="Email"
                      className="cursor-can-hover"
                    >
                      <Button variant={"outline"} size={"icon"}>
                        <Mail size={20} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid col-span-1"></div>
      </div>
      <div className="absolute bottom-10 left-[50%] translate-x-[-50%]">
        <ScrollDownIcon />
      </div>
    </SectionWrapper>
  );
};

export default HeroSection;
