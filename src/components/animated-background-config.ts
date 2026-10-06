export type Section =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "publications"
  | "projects"
  | "contact";

/*
 * On a phone there's no free column beside the text for the keyboard to sit
 * in — anywhere it goes on the hero or in the text-dense sections, it lands on
 * top of something you're trying to read. So on mobile it only appears in Tech
 * Stack, where it *is* the content, and otherwise waits off-screen: below
 * before that section (it rises in as you scroll down to it) and above after
 * it (it leaves upward with the page).
 */
const MOBILE_PARKED_BELOW = { x: 0, y: -1600, z: 0 };
const MOBILE_PARKED_ABOVE = { x: 0, y: 1600, z: 0 };

export const STATES = {
  hero: {
    desktop: {
      scale: { x: 0.20, y: 0.20, z: 0.20 },
      position: { x: 225, y: -100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.30, y: 0.30, z: 0.30 },
      position: MOBILE_PARKED_BELOW,
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  about: {
    desktop: {
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 12,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 6,
        z: 0,
      },
    },
  },
  // Experience and Projects are the two text-dense sections, so the keyboard
  // gets pushed out of the reading column instead of sitting behind the cards —
  // a 3D object showing through the gaps in a card grid just reads as a bug.
  experience: {
    desktop: {
      scale: { x: 0.16, y: 0.16, z: 0.16 },
      position: { x: -960, y: -120, z: 0 },
      rotation: {
        x: Math.PI / 12, // Slight tilt forward
        y: -Math.PI / 4, // Rotate opposite to skills
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.14, y: 0.14, z: 0.14 },
      position: MOBILE_PARKED_ABOVE,
      rotation: {
        x: Math.PI / 6,
        y: -Math.PI / 6,
        z: 0,
      },
    },
  },
  skills: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 12,
        z: 0,
      },
    },
    // ~82% of the screen width (see getScaleOffset), centred in the space
    // under the sticky heading
    mobile: {
      scale: { x: 0.235, y: 0.235, z: 0.235 },
      position: { x: -10, y: -100, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 6,
        z: 0,
      },
    },
  },
  publications: {
    desktop: {
      scale: { x: 0.16, y: 0.16, z: 0.16 },
      position: { x: 960, y: -120, z: 0 },
      rotation: { x: Math.PI / 10, y: Math.PI / 5, z: 0 },
    },
    mobile: {
      scale: { x: 0.14, y: 0.14, z: 0.14 },
      position: MOBILE_PARKED_ABOVE,
      rotation: { x: Math.PI / 6, y: Math.PI / 6, z: 0 },
    },
  },
  projects: {
    desktop: {
      scale: { x: 0.16, y: 0.16, z: 0.16 },
      position: { x: 980, y: -140, z: 0 },
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
    mobile: {
      scale: { x: 0.14, y: 0.14, z: 0.14 },
      position: MOBILE_PARKED_ABOVE,
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
  },
  contact: {
    desktop: {
      scale: { x: 0.2, y: 0.2, z: 0.2 },
      position: { x: 350, y: -250, z: 0 },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: MOBILE_PARKED_ABOVE,
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
  },
};

export const getKeyboardState = ({
  section,
  isMobile,
}: {
  section: Section;
  isMobile: boolean;
}) => {
  const baseTransform = STATES[section][isMobile ? "mobile" : "desktop"];

  const getScaleOffset = () => {
    const width = window.innerWidth;
    // Reference widths for "ideal" size
    // Using 1024 for desktop to maintain backward compatibility with previous look
    const DESKTOP_REF_WIDTH = 1280;
    const MOBILE_REF_WIDTH = 390;

    // The scene renders at a fixed pixels-per-unit, so on a phone the keyboard
    // has to shrink with the screen to keep its margins. (The old clamp pinned
    // every phone to 0.6, so it overflowed anything narrower than it.)
    const targetScale = isMobile
      ? (0.6 * width) / MOBILE_REF_WIDTH
      : width / DESKTOP_REF_WIDTH;

    // Clamp values to prevent extremes
    const minScale = isMobile ? 0.45 : 0.5;
    const maxScale = isMobile ? 0.66 : 1.15;

    return Math.min(Math.max(targetScale, minScale), maxScale);
  };

  const scaleOffset = getScaleOffset();

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
  };
};
