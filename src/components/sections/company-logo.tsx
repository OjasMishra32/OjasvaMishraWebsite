"use client";

import Chip3D from "@/components/ui/chip-3d";
import type { Experience } from "@/data/constants";

/**
 * The experience-timeline chip. All the 3D lives in Chip3D; this just maps an
 * Experience onto it.
 *
 * Every logo is the company's own artwork pulled from their own site or their
 * public LinkedIn mark, so each chip carries that brand's background rather
 * than a colour I picked. Brands whose mark is set in type (YPSF) get the
 * initials in their own colour instead of a logo I'd have to invent.
 */
export const CompanyLogo = ({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) => (
  <Chip3D
    src={experience.logo}
    monogram={experience.monogram ?? experience.company.slice(0, 2).toUpperCase()}
    monogramColor={experience.monogramColor}
    bg={experience.logoBg}
    fullBleed={experience.logoFullBleed}
    index={index}
    trackSelector="[data-experience-card]"
  />
);

export default CompanyLogo;
