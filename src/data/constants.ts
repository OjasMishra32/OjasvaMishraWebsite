/**
 * Skill registry.
 *
 * The keys of `SKILLS` are load-bearing: each keycap block entry matches a
 * keycap object name inside `/assets/skills-keyboard.spline`, and the 3D scene
 * looks a skill up by `SKILLS[keycapName]` on hover/press. So those keys can't
 * be renamed — and every one of them stays mapped so no key on the board is
 * dead.
 *
 * `inStack` separates "this key does something" from "this is what I actually
 * build with". The HTML fallback grid (shown when WebGL is off) filters on it,
 * so the written tech stack stays honest even though the keycaps are fixed.
 * Entries with no keycap at all exist for experience/project badges.
 */
export enum SkillNames {
  // --- keycaps present in the Spline scene ---
  JS = "js",
  TS = "ts",
  HTML = "html",
  CSS = "css",
  REACT = "react",
  VUE = "vue",
  NEXTJS = "nextjs",
  TAILWIND = "tailwind",
  NODEJS = "nodejs",
  EXPRESS = "express",
  POSTGRES = "postgres",
  MONGODB = "mongodb",
  GIT = "git",
  GITHUB = "github",
  PRETTIER = "prettier",
  NPM = "npm",
  FIREBASE = "firebase",
  WORDPRESS = "wordpress",
  LINUX = "linux",
  DOCKER = "docker",
  NGINX = "nginx",
  AWS = "aws",
  GCP = "gcp",
  VIM = "vim",
  VERCEL = "vercel",
  // --- no keycap: badge-only skills ---
  PYTHON = "python",
  CPP = "cpp",
  SWIFT = "swift",
  CSHARP = "csharp",
  ROS = "ros",
  UNITY = "unity",
  UNREAL = "unreal",
  BLENDER = "blender",
  OPENCV = "opencv",
  PYTORCH = "pytorch",
  ARDUINO = "arduino",
  NUMPY = "numpy",
  MATLAB = "matlab",
}

export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
  /** true = part of the tech stack I actually build with */
  inStack?: boolean;
};

const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}.svg`;

export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.PYTHON]: {
    id: 1,
    name: "python",
    label: "Python",
    shortDescription:
      "Controls research, CV pipelines, and every robot script I've ever written.",
    color: "#3776ab",
    icon: devicon("python/python-original"),
    inStack: true,
  },
  [SkillNames.CPP]: {
    id: 2,
    name: "cpp",
    label: "C++",
    shortDescription:
      "Where the real-time loops live — VEX autons, ROS2 nodes, controllers.",
    color: "#00599c",
    icon: devicon("cplusplus/cplusplus-original"),
    inStack: true,
  },
  [SkillNames.ROS]: {
    id: 3,
    name: "ros",
    label: "ROS2",
    shortDescription:
      "Nodes, topics, and the occasional three-hour fight with a launch file.",
    color: "#22314e",
    icon: devicon("ros/ros-original"),
    inStack: true,
  },
  [SkillNames.SWIFT]: {
    id: 4,
    name: "swift",
    label: "Swift",
    shortDescription:
      "SwiftUI and CoreML — how PreventaAI and Eyesight got onto real phones.",
    color: "#f05138",
    icon: devicon("swift/swift-original"),
    inStack: true,
  },
  [SkillNames.OPENCV]: {
    id: 5,
    name: "opencv",
    label: "OpenCV",
    shortDescription:
      "Joint angles, gaze tracking, obstacle detection. Pixels into decisions.",
    color: "#5c3ee8",
    icon: devicon("opencv/opencv-original"),
    inStack: true,
  },
  [SkillNames.PYTORCH]: {
    id: 6,
    name: "pytorch",
    label: "PyTorch",
    shortDescription:
      "Train the model, then shrink it until it runs on the device in your hand.",
    color: "#ee4c2c",
    icon: devicon("pytorch/pytorch-original"),
    inStack: true,
  },
  [SkillNames.TS]: {
    id: 7,
    name: "ts",
    label: "TypeScript",
    shortDescription:
      "A type is a proof you wrote before the bug got a chance to happen.",
    color: "#007acc",
    icon: devicon("typescript/typescript-original"),
    inStack: true,
  },
  [SkillNames.JS]: {
    id: 8,
    name: "js",
    label: "JavaScript",
    shortDescription:
      "The one that runs everywhere, whether you asked it to or not.",
    color: "#f0db4f",
    icon: devicon("javascript/javascript-original"),
    inStack: true,
  },
  [SkillNames.REACT]: {
    id: 9,
    name: "react",
    label: "React",
    shortDescription:
      "Every dashboard, every demo, every thing I needed people to actually see.",
    color: "#61dafb",
    icon: devicon("react/react-original"),
    inStack: true,
  },
  [SkillNames.NEXTJS]: {
    id: 10,
    name: "nextjs",
    label: "Next.js",
    shortDescription:
      "Ships fast enough that the idea is still interesting when it lands.",
    color: "#fff",
    icon: devicon("nextjs/nextjs-original"),
    inStack: true,
  },
  [SkillNames.TAILWIND]: {
    id: 11,
    name: "tailwind",
    label: "Tailwind",
    shortDescription: "Styling without ever having to name another div. Worth it.",
    color: "#38bdf8",
    icon: devicon("tailwindcss/tailwindcss-plain"),
    inStack: true,
  },
  [SkillNames.NODEJS]: {
    id: 12,
    name: "nodejs",
    label: "Node.js",
    shortDescription: "Backends for the things that needed a backend by tomorrow.",
    color: "#6cc24a",
    icon: devicon("nodejs/nodejs-original"),
    inStack: true,
  },
  [SkillNames.CSHARP]: {
    id: 13,
    name: "csharp",
    label: "C#",
    shortDescription:
      "Unity's native tongue — escape rooms, tower defense, VR simulations.",
    color: "#68217a",
    icon: devicon("csharp/csharp-original"),
    inStack: true,
  },
  [SkillNames.UNITY]: {
    id: 14,
    name: "unity",
    label: "Unity",
    shortDescription:
      "Built a fully playable Meta Quest escape room in it, on a competition clock.",
    color: "#fff",
    icon: devicon("unity/unity-original"),
    inStack: true,
  },
  [SkillNames.UNREAL]: {
    id: 15,
    name: "unreal",
    label: "Unreal Engine",
    shortDescription:
      "Mission-grade UAV simulation — benchmarked, and now used at Penn.",
    color: "#fff",
    icon: devicon("unrealengine/unrealengine-original"),
    inStack: true,
  },
  [SkillNames.ARDUINO]: {
    id: 16,
    name: "arduino",
    label: "Arduino",
    shortDescription:
      "The first thing that ever made a motor move because I said so.",
    color: "#00979d",
    icon: devicon("arduino/arduino-original"),
    inStack: true,
  },
  [SkillNames.BLENDER]: {
    id: 17,
    name: "blender",
    label: "Blender",
    shortDescription:
      "Game assets and render passes. CAD proper lives in OnShape and Fusion360.",
    color: "#f5792a",
    icon: devicon("blender/blender-original"),
    inStack: true,
  },
  [SkillNames.NUMPY]: {
    id: 19,
    name: "numpy",
    label: "NumPy",
    shortDescription:
      "Where the gain optimization actually happens, matrices and all.",
    color: "#4dabcf",
    icon: devicon("numpy/numpy-original"),
    inStack: true,
  },
  [SkillNames.MATLAB]: {
    id: 20,
    name: "matlab",
    label: "MATLAB",
    shortDescription: "Control theory that started as coursework and became a paper.",
    color: "#e16737",
    icon: devicon("matlab/matlab-original"),
    inStack: true,
  },
  [SkillNames.DOCKER]: {
    id: 21,
    name: "docker",
    label: "Docker",
    shortDescription: "The only honest answer to \"but it works on my machine.\"",
    color: "#2496ed",
    icon: devicon("docker/docker-original"),
    inStack: true,
  },
  [SkillNames.LINUX]: {
    id: 22,
    name: "linux",
    label: "Linux",
    shortDescription:
      "Ubuntu boxes, robot compute, and everything that has to stay up.",
    color: "#fff",
    icon: devicon("linux/linux-original"),
    inStack: true,
  },
  [SkillNames.GIT]: {
    id: 23,
    name: "git",
    label: "Git",
    shortDescription: "Undo, but for the last two years of your life.",
    color: "#f1502f",
    icon: devicon("git/git-original"),
    inStack: true,
  },
  [SkillNames.GITHUB]: {
    id: 24,
    name: "github",
    label: "GitHub",
    shortDescription:
      "Where the robotics textbook and half the club's kits ended up living.",
    color: "#000000",
    icon: devicon("github/github-original"),
    inStack: true,
  },
  [SkillNames.FIREBASE]: {
    id: 25,
    name: "firebase",
    label: "Firebase",
    shortDescription: "Auth and sync for the iOS apps, running before I overthink it.",
    color: "#ffca28",
    icon: devicon("firebase/firebase-plain"),
    inStack: true,
  },
  [SkillNames.POSTGRES]: {
    id: 26,
    name: "postgres",
    label: "PostgreSQL",
    shortDescription: "For the data that still has to be right in a year.",
    color: "#336791",
    icon: devicon("postgresql/postgresql-original"),
    inStack: true,
  },
  [SkillNames.MONGODB]: {
    id: 27,
    name: "mongodb",
    label: "MongoDB",
    shortDescription: "Schemas that change weekly, which is most of a prototype.",
    color: "#4faa41",
    icon: devicon("mongodb/mongodb-original"),
    inStack: true,
  },
  [SkillNames.GCP]: {
    id: 28,
    name: "gcp",
    label: "Google Cloud",
    shortDescription: "Inference and storage for the things that outgrew a laptop.",
    color: "#4285f4",
    icon: devicon("googlecloud/googlecloud-original"),
    inStack: true,
  },
  [SkillNames.AWS]: {
    id: 29,
    name: "aws",
    label: "AWS",
    shortDescription:
      "Twelve services to do one thing, and somehow that's the whole industry.",
    color: "#ff9900",
    icon: devicon("amazonwebservices/amazonwebservices-original-wordmark"),
    inStack: true,
  },
  [SkillNames.VERCEL]: {
    id: 30,
    name: "vercel",
    label: "Vercel",
    shortDescription: "git push, and the demo has a link. This site included.",
    color: "#fff",
    icon: devicon("vercel/vercel-original"),
    inStack: true,
  },
  [SkillNames.HTML]: {
    id: 31,
    name: "html",
    label: "HTML",
    shortDescription: "Still the only thing every browser has ever agreed on.",
    color: "#e34c26",
    icon: devicon("html5/html5-original"),
    inStack: true,
  },
  [SkillNames.CSS]: {
    id: 32,
    name: "css",
    label: "CSS",
    shortDescription: "Centering is a solved problem now. We were all there before.",
    color: "#563d7c",
    icon: devicon("css3/css3-original"),
    inStack: true,
  },

  // --- keycaps that exist on the board but aren't part of the stack ---
  [SkillNames.NPM]: {
    id: 33,
    name: "npm",
    label: "npm",
    shortDescription:
      "install, wait, 400 packages appear. Nobody knows quite what happened.",
    color: "#cb3837",
    icon: devicon("npm/npm-original-wordmark"),
  },
  [SkillNames.EXPRESS]: {
    id: 34,
    name: "express",
    label: "Express",
    shortDescription:
      "app.get('/', ...) and you have a server. It never stopped working.",
    color: "#fff",
    icon: devicon("express/express-original"),
  },
  [SkillNames.VIM]: {
    id: 35,
    name: "vim",
    label: "Vim",
    shortDescription:
      "Learned it over SSH on a robot with no other editor installed.",
    color: "#019833",
    icon: devicon("vim/vim-original"),
  },
  [SkillNames.NGINX]: {
    id: 36,
    name: "nginx",
    label: "NGINX",
    shortDescription:
      "Quietly routing the traffic while everything else takes the credit.",
    color: "#009639",
    icon: devicon("nginx/nginx-original"),
  },
  [SkillNames.PRETTIER]: {
    id: 37,
    name: "prettier",
    label: "Prettier",
    shortDescription: "Ends the formatting argument before anybody has it.",
    color: "#f7b93a",
    icon: devicon("prettier/prettier-original"),
  },
  [SkillNames.VUE]: {
    id: 38,
    name: "vue",
    label: "Vue",
    shortDescription: "Genuinely lovely. React just got to my projects first.",
    color: "#41b883",
    icon: devicon("vuejs/vuejs-original"),
  },
  [SkillNames.WORDPRESS]: {
    id: 39,
    name: "wordpress",
    label: "WordPress",
    shortDescription: "Runs half the web. This site is not that half.",
    color: "#21759b",
    icon: devicon("wordpress/wordpress-plain"),
  },
};

/** The tech stack proper — what shows up in the written stack grid. */
export const STACK: Skill[] = Object.values(SKILLS).filter((s) => s.inStack);

export type Experience = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  companyUrl?: string;
  blurb?: string;
  description: string[];
  skills: SkillNames[];
  /** Company mark, pulled from the company's own site. */
  logo?: string;
  /** Fallback initials when a company has no public logo to pull. */
  monogram?: string;
  /** Colour for the initials, when the brand's own mark is set in type. */
  monogramColor?: string;
  /** Tile background behind the mark, matched to the logo's own artwork. */
  logoBg?: string;
  /** Logo is already an app icon (its own rounded square + background), so it
   *  fills the chip face edge-to-edge instead of sitting padded inside it. */
  logoFullBleed?: boolean;
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    startDate: "Feb 2026",
    endDate: "Present",
    title: "AI Platform Engineer, Founding Team",
    company: "Drift",
    companyUrl: "https://godrift.ai",
    blurb: "Antler-backed · AI copilot for robotics simulation",
    logo: "/assets/companies/drift.png",
    logoBg: "#000000",
    logoFullBleed: true,
    description: [
      "Founding AI engineer on the natural-language layer: set up, debug, and run robot simulations conversationally across ROS2, Gazebo, and MuJoCo.",
      "Built the 129-robot library catalog behind the /robots CLI command, with per-entry license verification against MuJoCo Menagerie and partner repos.",
      "Built an automated CLI test pipeline — pexpect-driven interaction, vision-model analysis of Gazebo screenshots, and real queries sourced from robotics forums.",
      "Shipped the internal EPS dashboard and regression CI on a two-week cycle; contributed to Drift Desktop (Tauri + React).",
      "Traced a production Gazebo rendering freeze to gz-transport UDP multicast failing on Ubuntu 24.04 with an RTX 5070, and fixed it.",
      "#5 Product of the Day at launch. Now used by thousands of robotics engineers.",
    ],
    skills: [
      SkillNames.PYTHON,
      SkillNames.ROS,
      SkillNames.CPP,
      SkillNames.DOCKER,
      SkillNames.LINUX,
      SkillNames.TS,
    ],
  },
  {
    id: 2,
    startDate: "May 2025",
    endDate: "Present",
    title: "Research Intern",
    company: "Carnegie Mellon University, Robotics Institute",
    companyUrl: "https://www.ri.cmu.edu/",
    blurb: "Advised by Prof. Min Xu and Dr. Xiaolong Wu",
    logo: "/assets/companies/cmu.png",
    logoBg: "#ffffff",
    description: [
      "First author on two papers: robotic joint control when the motor can't deliver the commanded torque.",
      "Constraint-aware discrete-time PID gain optimization — under review, IEEE Transactions on Robotics.",
      "SCIG++, conformal safety filtering under adversarial input — under review, IEEE IROS. Demonstrated on a Franka Emika Panda.",
      "Multi-modal SLAM path planning with a PID substructure.",
    ],
    skills: [
      SkillNames.PYTHON,
      SkillNames.NUMPY,
      SkillNames.MATLAB,
      SkillNames.ROS,
      SkillNames.CPP,
    ],
  },
  {
    id: 3,
    startDate: "Mar 2026",
    endDate: "Present",
    title: "Co-Founder & CEO",
    company: "Twinly",
    companyUrl: "https://twinly.tech",
    blurb: "Delaware C Corp · Z Fellows, Sept 2026 cohort",
    logo: "/assets/companies/twinly.png",
    logoBg: "#000000",
    logoFullBleed: true,
    description: [
      "Two-person company building an AI operator that executes real computer tasks for you — persistent memory, a personal CRM, and a locally cloned voice.",
      "Architected the Identity Runtime: macOS accessibility APIs, browser DOM state, application state, and vision composed into one execution graph, falling back to pixel-level control only when no structured interface exists.",
      "Launched the public macOS app in July 2026 — a 2,000+ person waitlist converted into a 100-user private beta, a 150-member Discord, and 2,700+ TikTok followers.",
      "SwiftUI, Electron, Supabase, Stripe.",
    ],
    skills: [
      SkillNames.TS,
      SkillNames.NEXTJS,
      SkillNames.PYTHON,
      SkillNames.POSTGRES,
      SkillNames.DOCKER,
    ],
  },
  {
    id: 4,
    startDate: "Jun 2025",
    endDate: "Dec 2025",
    title: "AI Robotics Engineer Intern",
    company: "EV Bots, Inc.",
    blurb: "Fleet charging with mobile robots",
    logo: "/assets/companies/evbots.png",
    logoBg: "#ffffff",
    description: [
      "Built the company's first working autonomous EV charging prototype — mechanical, electronics, controls.",
      "CAD for an autonomous drone charging dock, aimed at swarm delivery fleets.",
      "Work contributed to multiple provisional patents.",
    ],
    skills: [
      SkillNames.PYTHON,
      SkillNames.CPP,
      SkillNames.ROS,
      SkillNames.ARDUINO,
      SkillNames.OPENCV,
    ],
  },
  {
    id: 5,
    startDate: "Aug 2025",
    endDate: "Mar 2026",
    title: "Engineering Intern",
    company: "PteroLabs",
    companyUrl: "https://pterolabs.ai",
    blurb: "Mission-grade UAV simulation",
    logo: "/assets/companies/pterolabs.png",
    logoBg: "#0b1f3a",
    description: [
      "Built a mission-grade UAV simulator in Unreal Engine with FPV racing, ML-driven mission planning, and object detection.",
      "Performance-benchmarked it. Now used by the University of Pennsylvania for active research.",
    ],
    skills: [
      SkillNames.UNREAL,
      SkillNames.CPP,
      SkillNames.PYTHON,
      SkillNames.PYTORCH,
      SkillNames.OPENCV,
    ],
  },
  {
    id: 6,
    startDate: "Jul 2025",
    endDate: "Aug 2025",
    title: "Software Development Intern",
    company: "iPipeline",
    companyUrl: "https://ipipeline.com",
    blurb: "Enterprise insurance software",
    logo: "/assets/companies/ipipeline.png",
    logoBg: "#ffffff",
    description: [
      "Automation testing frameworks and AI-driven agents.",
      "Internal tooling deployed org-wide.",
    ],
    skills: [SkillNames.PYTHON, SkillNames.JS, SkillNames.DOCKER, SkillNames.GIT],
  },
  {
    id: 7,
    startDate: "Mar 2025",
    endDate: "Apr 2026",
    title: "Chief Technology Officer",
    company: "Youth Publications & Socioeconomic Forum",
    companyUrl: "https://www.ypsforum.org/",
    blurb: "UN MGCY-affiliated NGO",
    monogram: "YPSF",
    monogramColor: "#e04a59",
    logoBg:
      "linear-gradient(135deg, #7a0e23 0%, #a32738 50%, #e04a59 100%)",
    description: [
      "AI literacy programs across 15+ countries for a 500+ member organisation.",
      "Presented the work at UN conferences including HLPF and UNGA.",
      "Owned curriculum, platform, and delivery.",
    ],
    skills: [SkillNames.REACT, SkillNames.NEXTJS, SkillNames.TS, SkillNames.FIREBASE],
  },
  {
    id: 8,
    startDate: "Jul 2023",
    endDate: "Jun 2026",
    title: "Founder & Club President",
    company: "American Rocketry Challenge",
    blurb: "60+ member club",
    logo: "/assets/companies/rocketry.png",
    logoBg: "#ffffff",
    description: [
      "Founded the club and grew it past 60 members.",
      "Led CAD payload design, propulsion analysis, and launches.",
    ],
    skills: [SkillNames.PYTHON, SkillNames.MATLAB],
  },
  {
    id: 9,
    startDate: "May 2024",
    endDate: "Jun 2025",
    title: "National Competitor",
    company: "Technology Student Association",
    blurb: "8 events at nationals",
    logo: "/assets/companies/tsa.png",
    logoBg: "#ffffff",
    description: [
      "Competed at the national level across 8 events.",
      "Team captain for 6 of them; national finalist in 2.",
      "Range ran from a React + blockchain carbon-trading app to a Betaflight FPV drone to a Meta Quest escape room.",
    ],
    skills: [
      SkillNames.REACT,
      SkillNames.UNITY,
      SkillNames.CSHARP,
      SkillNames.PYTHON,
      SkillNames.CPP,
    ],
  },
  {
    id: 10,
    startDate: "2019",
    endDate: "Feb 2025",
    title: "Team Captain, Lead Programmer & Driver",
    company: "VEX Robotics",
    blurb: "3x World Championship competitor",
    logo: "/assets/companies/vex.png",
    logoBg: "#ffffff",
    description: [
      "Three-time VEX Worlds competitor.",
      "Led CAD, C++/Python autonomous routines, PID tuning, and modular subsystems.",
    ],
    skills: [SkillNames.CPP, SkillNames.PYTHON, SkillNames.ARDUINO],
  },
  {
    id: 11,
    startDate: "May 2022",
    endDate: "Dec 2022",
    title: "Center Assistant",
    company: "Kumon North America, Inc.",
    blurb: "Where the teaching habit started",
    logo: "/assets/companies/kumon.png",
    logoBg: "#ffffff",
    description: [
      "Tutored students aged 4–16 in math and English.",
      "Graded coursework and managed student records.",
    ],
    skills: [],
  },
];

export type Publication = {
  id: string;
  /** Venue mark. `mono` marks inherit text colour; full-colour ones sit on a
   *  light chip so they stay legible on the dark card. */
  venueLogo?: { src: string; alt: string; mono?: boolean };
  title: string;
  venue: string;
  status: string;
  year: string;
  authors: string;
  abstract: string;
  links: { label: string; href: string }[];
};

/**
 * Two first-author papers, both on actuator saturation — the regime where a
 * controller commands more torque than the hardware can deliver and the
 * textbook stability guarantees quietly stop applying.
 */
export const PUBLICATIONS: Publication[] = [
  {
    id: "pid-gain",
    venueLogo: {
      src: "/assets/logos/ieee-mono.svg",
      alt: "IEEE",
      mono: true,
    },
    title:
      "Constraint-Aware Discrete-Time PID Gain Optimization for Robotic Joint Control Under Actuator Saturation",
    venue: "IEEE Transactions on Robotics (T-RO)",
    status: "Under review · arXiv preprint",
    year: "2026",
    authors: "Ojasva Mishra (first author), with Prof. Min Xu and Dr. Xiaolong Wu",
    abstract:
      "Tunes discrete-time PID gains with the actuator's saturation limit treated as a first-class constraint, rather than as something patched around after the controller is already designed.",
    links: [
      { label: "Read on arXiv", href: "https://arxiv.org/abs/2601.18639v3" },
    ],
  },
  {
    id: "scig",
    venueLogo: { src: "/assets/logos/iros.png", alt: "IEEE IROS 2026" },
    title:
      "SCIG++: Risk-Limiting Conformal Safety Filtering for Attack-Resilient Robotic Joint Control Under Saturation",
    venue: "IEEE IROS",
    status: "Under review",
    year: "2026",
    authors: "Ojasva Mishra (first author), with Prof. Min Xu and Dr. Xiaolong Wu",
    abstract:
      "Wraps the controller in a conformal safety filter with an explicit risk bound, so a joint stays inside its safe set even when the commands reaching it have been adversarially manipulated. Demonstrated on a Franka Emika Panda arm.",
    links: [
      {
        label: "Watch the Panda demo",
        href: "https://www.youtube.com/watch?v=2A_RMrd1qKo",
      },
    ],
  },
  {
    id: "textbook-pub",
    title: "Introduction to Robotics and Programming",
    venue: "SSRN",
    status: "Published · open access",
    year: "2025",
    authors: "Ojasva Mishra",
    abstract:
      "A 120-page open-access robotics and programming textbook, written for students who can't reach the material any other way. Published through FusionBots and indexed on SSRN.",
    links: [
      {
        label: "Read on SSRN",
        href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5408322",
      },
    ],
  },
];

export const themeDisclaimers = {
  light: [
    "Light mode: for people who debug at noon with the blinds open.",
    "Turning the lights on. Hope you meant to do that.",
    "Light mode engaged. Somewhere, a dark-mode purist felt a chill.",
    "Bright enough to read a datasheet off. You've been warned.",
    "Flipping to light mode — this is your one chance to reconsider.",
  ],
  dark: [
    "Back to dark mode. Your retinas send their thanks.",
    "Dark mode on. This is the correct setting and we both know it.",
    "Lights out. Much better.",
    "Welcome back to the side where the syntax highlighting actually pops.",
    "Dark mode restored. Order returns to the universe.",
  ],
};
