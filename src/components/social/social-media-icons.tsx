"use client";

import { useInView } from "motion/react";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { SiGithub, SiInstagram, SiX } from "react-icons/si";
// LinkedIn was dropped from simple-icons (trademark), so it comes from Font Awesome.
import { FaLinkedin } from "react-icons/fa6";
import { Mail } from "lucide-react";
import { config } from "@/data/config";
import Link from "next/link";

// Only render the accounts that actually exist — an empty entry in config
// shouldn't become a button that goes nowhere.
const BUTTONS = [
  {
    name: "Github",
    href: config.social.github,
    icon: <SiGithub size={"24"} />,
  },
  {
    name: "LinkedIn",
    href: config.social.linkedin,
    icon: <FaLinkedin size={"24"} />,
  },
  {
    name: "Instagram",
    href: config.social.instagram,
    icon: <SiInstagram size={"24"} />,
  },
  {
    name: "Twitter",
    href: config.social.twitter,
    icon: <SiX size={"24"} />,
  },
  {
    name: "Email",
    href: `mailto:${config.email}`,
    icon: <Mail size={24} />,
  },
].filter((b) => Boolean(b.href));

const SocialMediaButtons = () => {
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { once: true });
  return (
    <div ref={ref} className="z-10">
      {show &&
        BUTTONS.map((button) => (
          <Link
            href={button.href}
            key={button.name}
            aria-label={button.name}
            target={button.href.startsWith("mailto:") ? undefined : "_blank"}
          >
            <Button variant={"ghost"} size={"icon"}>
              {button.icon}
            </Button>
          </Link>
        ))}
    </div>
  );
};

export default SocialMediaButtons;
