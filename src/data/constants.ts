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
    startDate: "Nov 2025",
    endDate: "Aug 2026",
    title: "AI/Software Engineer, Founding Team",
    company: "Drift",
    companyUrl: "https://godrift.ai",
    blurb: "Claude Code for robots · backed by Antler",
    logo: "/assets/companies/drift.png",
    logoBg: "#000000",
    logoFullBleed: true,
    description: [
      "Built the Gaussian splat pipeline, the biggest system I've built: it turns photos of real spaces into walkable 3D worlds that robots can be simulated in.",
      "Built a self-healing loop: an error-triage service groups the failures users report, then a repair agent patches the code and reruns CI, so the codebase keeps itself working.",
      "Built core infrastructure for the agent, which 1,000+ people use to build and debug robot simulations in ROS2, Gazebo, MuJoCo and Isaac Sim. #5 Product of the Day at launch.",
      "Built the /robots catalog: 129 robots, each license-checked against MuJoCo Menagerie and partner repos.",
      "Shipped photo-to-3D scene generation with World Labs.",
      "Wrote the CLI test harness. It drives the tool through pexpect, has a vision model check Gazebo screenshots, and asks it real questions pulled from robotics forums.",
      "Tracked a production Gazebo freeze to gz-transport's UDP multicast failing on Ubuntu 24.04 with an RTX 5070, and fixed it.",
      "Also built regression CI and the internal EPS dashboard, and worked on Drift Desktop (Tauri, React).",
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
    startDate: "Jul 2025",
    endDate: "Present",
    title: "Research Intern",
    company: "Carnegie Mellon University, Robotics Institute",
    companyUrl: "https://www.ri.cmu.edu/",
    blurb: "Advised by Prof. Min Xu and Dr. Xiaolong Wu",
    logo: "/assets/companies/cmu.png",
    logoBg: "#ffffff",
    description: [
      "First author on three papers about controlling robot joints when the motor can't produce the torque the controller asks for.",
      "One tunes PID gains with that torque limit built in. Under review at IEEE Transactions on Robotics.",
      "Another, SCIG++, is a safety filter that keeps a joint in its safe range even when its commands are tampered with. Under review at IEEE IROS, demonstrated on a Franka Emika Panda arm.",
      "The third bounds how much control a command can carry and still pass the attack detector on torque-limited joints. IEEE ICRA 2027.",
      "Also built multimodal SLAM and path-planning experiments with a PID controller underneath.",
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
    startDate: "Dec 2025",
    endDate: "Present",
    title: "Co-Founder & CEO",
    company: "Twinly",
    companyUrl: "https://twinly.tech",
    blurb: "Desktop AI agent · Z Fellows, Sept 2026 cohort",
    logo: "/assets/companies/twinly.png",
    logoBg: "#000000",
    logoFullBleed: true,
    description: [
      "Twinly learns how you write, talk and use your computer, then does the work: email, calendar, files, the browser, and phone calls in your own voice.",
      "Built the Identity Runtime. It drives apps through macOS accessibility APIs, the browser DOM and app state, and only clicks on pixels when there's nothing structured to use.",
      "macOS, Windows and iOS apps with 1,000+ active users, some of them paying. SwiftUI, Electron, Supabase and Stripe.",
      "A two-person company, picked for Z Fellows' 10-builder cohort.",
    ],
    skills: [
      SkillNames.SWIFT,
      SkillNames.TS,
      SkillNames.PYTHON,
      SkillNames.POSTGRES,
    ],
  },
  {
    id: 12,
    startDate: "Sep 2026",
    endDate: "Present",
    title: "Quantitative Research Analyst",
    company: "AlgoGators Investment Fund",
    blurb: "Student-run fund · about $500K AUM",
    monogram: "AG",
    monogramColor: "#fa4616",
    logoBg: "#0021a5",
    description: [
      "One of two first-years picked for the quant research team. Build signals and backtest strategies.",
      "Traded a crack spread at a 64% win rate across live trades, adjusting as hurricane forecasts moved during an active storm.",
    ],
    skills: [SkillNames.PYTHON, SkillNames.NUMPY],
  },
  {
    id: 13,
    startDate: "Sep 2026",
    endDate: "Present",
    title: "Researcher, NeuroSpine Team",
    company: "Dream Team Engineering",
    blurb: "UF research team · with the UF Department of Neurosurgery",
    monogram: "DTE",
    description: [
      "Helping spine surgeons judge vertebral bone quality before surgery, where DEXA cutoffs leave a gray area.",
      "Building the Python pipeline that segments vertebrae in CT and MRI (nnU-Net, TotalSegmentator, MONAI, SimpleITK) and computes Hounsfield-unit and VBQ scores.",
    ],
    skills: [SkillNames.PYTHON, SkillNames.NUMPY],
  },
  {
    id: 4,
    startDate: "Apr 2025",
    endDate: "Nov 2025",
    title: "AI Robotics Engineer Intern",
    company: "EV Bots, Inc.",
    blurb: "Robots that charge electric vehicle fleets",
    logo: "/assets/companies/evbots.png",
    logoBg: "#ffffff",
    description: [
      "Built the company's first autonomous EV-charging robot that worked end to end: mechanical design, electronics, perception and control, through to plugging into the car.",
      "Designed the CAD for a drone charging dock meant for swarm delivery fleets.",
      "The work went into several provisional patents.",
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
    startDate: "May 2025",
    endDate: "Jan 2026",
    title: "Software Engineering Intern",
    company: "PteroLabs",
    companyUrl: "https://pterolabs.ai",
    blurb: "UAV simulation and autonomy",
    logo: "/assets/companies/pterolabs.png",
    logoBg: "#0b1f3a",
    description: [
      "Built a drone simulator in Unreal Engine 5 that runs PX4, ArduPilot and Betaflight in the loop, with 6-DOF flight dynamics, an FPV view, ML mission planning and object detection.",
      "Benchmarked its performance. The University of Pennsylvania now uses it for research.",
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
    startDate: "Jun 2025",
    endDate: "Aug 2025",
    title: "Software Development Intern",
    company: "iPipeline",
    companyUrl: "https://ipipeline.com",
    blurb: "Insurance software",
    logo: "/assets/companies/ipipeline.png",
    logoBg: "#ffffff",
    description: [
      "Wrote automated test frameworks and AI agents for validation and regression testing.",
      "Built developer tooling that engineering teams across the company adopted.",
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
    blurb: "Youth NGO affiliated with UN MGCY",
    monogram: "YPSF",
    monogramColor: "#e04a59",
    logoBg:
      "linear-gradient(135deg, #7a0e23 0%, #a32738 50%, #e04a59 100%)",
    description: [
      "Led AI literacy programs in 15+ countries for a 500+ member organization, from the curriculum to the platform.",
      "Presented the work at UN events including HLPF and UNGA.",
    ],
    skills: [SkillNames.REACT, SkillNames.NEXTJS, SkillNames.TS, SkillNames.FIREBASE],
  },
  {
    id: 8,
    startDate: "Jul 2023",
    endDate: "Jun 2026",
    title: "Founder & Club President",
    company: "American Rocketry Challenge",
    blurb: "High school rocketry club",
    logo: "/assets/companies/rocketry.png",
    logoBg: "#ffffff",
    description: [
      "Started the club and grew it past 60 members.",
      "Led payload CAD, propulsion analysis in MATLAB, systems integration and launches.",
    ],
    skills: [SkillNames.PYTHON, SkillNames.MATLAB],
  },
  {
    id: 9,
    startDate: "May 2024",
    endDate: "Jun 2025",
    title: "National Competitor",
    company: "Technology Student Association",
    blurb: "National finalist in 2 events",
    logo: "/assets/companies/tsa.png",
    logoBg: "#ffffff",
    description: [
      "Competed in 8 events at nationals and captained 6 of the teams.",
      "The builds ranged from a carbon-credit web app on a blockchain to an FPV drone and a Meta Quest escape room.",
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
      "Seven seasons on the team.",
      "Wrote the autonomous routines in C++ and Python, tuned the PID loops, and did the CAD.",
    ],
    skills: [SkillNames.CPP, SkillNames.PYTHON, SkillNames.ARDUINO],
  },
  {
    id: 11,
    startDate: "May 2022",
    endDate: "Dec 2022",
    title: "Center Assistant",
    company: "Kumon North America, Inc.",
    blurb: "Tutoring center",
    logo: "/assets/companies/kumon.png",
    logoBg: "#ffffff",
    description: [
      "Tutored students aged 4 to 16 in math and English.",
      "Graded their work and kept their records.",
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
 * Three first-author papers, all on actuator saturation — the regime where a
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
      "Tunes discrete-time PID gains with the actuator's saturation limit built in as a constraint from the start.",
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
        label: "Watch the video supplement",
        href: "https://docs.google.com/presentation/d/1SlviBI7ru_gd3lhIjRU0SLKIdPdTKMvxvI_7BdUW_Eg/edit?usp=sharing",
      },
    ],
  },
  {
    id: "feedback-authority",
    venueLogo: {
      src: "/assets/logos/ieee-mono.svg",
      alt: "IEEE",
      mono: true,
    },
    title:
      "Bounding Detector-Accepted Feedback Authority in Torque-Limited Robot Control",
    venue: "IEEE ICRA",
    status: "ICRA 2027",
    year: "2027",
    authors: "Ojasva Mishra (first author), with Prof. Min Xu and Dr. Xiaolong Wu",
    abstract:
      "Bounds how much control authority a command can carry and still be accepted by the attack detector, when the robot's joints are torque-limited.",
    links: [],
  },
  {
    id: "textbook-pub",
    title: "Introduction to Robotics and Programming",
    venue: "SSRN",
    status: "Published · open access",
    year: "2025",
    authors: "Ojasva Mishra",
    abstract:
      "A 120-page open-access robotics and programming textbook, written for students who can't get the material any other way. Indexed on SSRN.",
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
