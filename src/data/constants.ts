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
  /** Tile background behind the mark, matched to the logo's own artwork. */
  logoBg?: string;
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    startDate: "Feb 2026",
    endDate: "Present",
    title: "AI Platform Engineer",
    company: "Drift",
    companyUrl: "https://godrift.ai",
    blurb: "Backed by Antler · San Francisco · full-time",
    logo: "/assets/companies/drift.png",
    logoBg: "#000000",
    description: [
      "Natural language in, working robot simulation out — across ROS2, Gazebo, and Ignition.",
      "#5 Product of the Day on Product Hunt. Thousands of engineers on the platform.",
      "Joined as founding AI engineer out of NexHacks: 1 of 3 high schoolers accepted from 1,500+.",
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
    title: "AI & Robotics Researcher",
    company: "Carnegie Mellon University, School of Computer Science",
    companyUrl: "https://www.ri.cmu.edu/",
    blurb: "Prof. Min Xu and Dr. Xiaolong Wu · xulab",
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
    startDate: "Jun 2025",
    endDate: "Dec 2025",
    title: "Robotics Engineer",
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
    id: 4,
    startDate: "Aug 2025",
    endDate: "Mar 2026",
    title: "Machine Learning & Autonomy Intern",
    company: "PteroLabs",
    companyUrl: "https://pterolabs.ai",
    blurb: "Mission-grade UAV simulation",
    logo: "/assets/companies/pterolabs.png",
    logoBg: "#0b1f3a",
    description: [
      "Built a UAV simulator in Unreal Engine with drone racing and AI mission planning.",
      "Object detection plus performance benchmarking. Now used at Penn for active research.",
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
    id: 5,
    startDate: "Jul 2025",
    endDate: "Aug 2025",
    title: "Software Engineering Intern",
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
