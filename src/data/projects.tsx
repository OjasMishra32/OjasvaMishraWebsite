import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

// Renders a brand SVG from /public as a monochrome glyph that inherits the
// surrounding text color (the skill dock styles every icon via currentColor),
// so full-color marks flatten to match the rest of the set.
const MaskIcon = ({ src, title }: { src: string; title?: string }) => (
  <span
    role="img"
    aria-label={title}
    className="block bg-current"
    style={{
      width: "1em",
      height: "1em",
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
    }}
  />
);

export const ProjectsLinks = ({
  live,
  repo,
  liveLabel = "Visit Website",
}: {
  live?: string;
  repo?: string;
  liveLabel?: string;
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && live !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            {liveLabel}
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {repo && repo !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

// Brand chips sourced from mono SVGs in /public/assets/logos, rendered via
// MaskIcon so each one inherits the dock's currentColor.
const brand = (title: string, file: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <MaskIcon src={`/assets/logos/${file}`} title={title} />,
});

// A few tools have no mono mark anywhere (Gazebo, CoreML, SwiftUI). Rather than
// hand-drawing a fake glyph for them, they get a short text chip.
const text = (title: string, label: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <span className="text-[9px] font-bold tracking-tight">{label}</span>,
});

const PROJECT_SKILLS = {
  // web
  next: brand("Next.js", "nextdotjs-mono.svg"),
  react: brand("React", "react-mono.svg"),
  ts: brand("TypeScript", "typescript-mono.svg"),
  js: brand("JavaScript", "javascript-mono.svg"),
  tailwind: brand("Tailwind CSS", "tailwind-css-mono.svg"),
  node: brand("Node.js", "nodedotjs-mono.svg"),
  vercel: brand("Vercel", "vercel-mono.svg"),
  firebase: brand("Firebase", "firebase-mono.svg"),
  postgres: brand("PostgreSQL", "postgresql-mono.svg"),
  mongo: brand("MongoDB", "mongodb-mono.svg"),
  docker: brand("Docker", "docker-mono.svg"),
  python: brand("Python", "python-mono.svg"),
  // robotics / systems
  cpp: brand("C++", "cplusplus-mono.svg"),
  ros: brand("ROS2", "ros-mono.svg"),
  opencv: brand("OpenCV", "opencv-mono.svg"),
  pytorch: brand("PyTorch", "pytorch-mono.svg"),
  arduino: brand("Arduino", "arduino-mono.svg"),
  unity: brand("Unity", "unity-mono.svg"),
  unreal: brand("Unreal Engine", "unrealengine-mono.svg"),
  blender: brand("Blender", "blender-mono.svg"),
  // apple / stores
  swift: brand("Swift", "swift-mono.svg"),
  apple: brand("Apple", "apple-mono.svg"),
  appstore: brand("App Store", "appstore-mono.svg"),
  chrome: brand("Chrome", "googlechrome-mono.svg"),
  webstore: brand("Chrome Web Store", "chromewebstore-mono.svg"),
  // text-only
  gazebo: text("Gazebo", "GZ"),
  coreml: text("CoreML", "ML"),
  swiftui: text("SwiftUI", "UI"),
  quest: text("Meta Quest", "VR"),
  numpy: text("NumPy", "np"),
  matlab: text("MATLAB", "M"),
  chain: text("Blockchain", "BC"),
};

/**
 * The eight TSA national events, each pointing at the documentation portfolio
 * actually submitted for it. Three were judged on-site with nothing to hand in.
 */
export type TsaEvent = {
  name: string;
  /** the discipline, so the eight read as eight different engineering problems */
  field: string;
  blurb: string;
  href?: string;
  linkLabel?: string;
  note?: string;
  /** full-colour marks for what it was actually built with */
  icons: { src: string; title: string }[];
};

const ic = (path: string, title: string) => ({
  src: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}.svg`,
  title,
});

/**
 * The eight TSA national events, hardware and physical builds first.
 *
 * These are eight separate engineering projects with their own design cycles,
 * not eight entries in one competition — so they render in full on the card
 * face rather than as a list of link labels nobody can decode. Five have
 * submitted documentation portfolios; three were built on-site against a clock.
 */
export const TSA_EVENTS: TsaEvent[] = [
  {
    name: "Drone Challenge",
    field: "Aerospace · hardware",
    blurb:
      "A Betaflight FPV drone engineered and tuned from scratch — custom CAD frame, wiring loom, and flight-controller tuning.",
    href: "https://docs.google.com/document/u/0/d/1EDjvXpqCivNz9_Ob39cphXgzUCBpW2PoxV4uQBgZG2I/edit",
    icons: [ic("arduino/arduino-original", "Arduino"), ic("cplusplus/cplusplus-original", "C++")],
  },
  {
    name: "Robotics",
    field: "Robotics",
    blurb:
      "An autonomous and drivable object-manipulating robot — chassis, manipulator, and autonomous routine, built on the floor.",
    note: "Built on-site, timed",
    icons: [ic("cplusplus/cplusplus-original", "C++"), ic("arduino/arduino-original", "Arduino")],
  },
  {
    name: "VR Visualization",
    field: "XR · game engine",
    blurb:
      "A fully playable escape room built in Unity 6 for the Meta Quest — level design, interaction, and hand-tracked puzzles.",
    href: "https://docs.google.com/document/d/176jDWUSqxicfdT6wM05To4pvtfx3kMSmVqMIt49FyZQ/edit",
    icons: [ic("unity/unity-original", "Unity"), ic("csharp/csharp-original", "C#")],
  },
  {
    name: "Software Development",
    field: "Web · blockchain",
    blurb:
      "SAFMS — an AI/IoT web app modelling agroforestry carbon credits, land use, and live environmental telemetry, settling credit issuance on-chain.",
    href: "https://safmstsa.vercel.app",
    linkLabel: "Open the live app",
    icons: [ic("react/react-original", "React"), ic("javascript/javascript-original", "JavaScript")],
  },
  {
    name: "Engineering Design",
    field: "Environmental",
    blurb:
      "Nitrogen-capture domes using zeolites to cut agricultural emissions — materials selection, geometry, and capture modelling.",
    href: "https://docs.google.com/document/d/1kdHmo5DeLaevcmrig-DwGT1apDXM1F7g4HFoFn7aL7o/edit",
    icons: [ic("python/python-original", "Python")],
  },
  {
    name: "Video Game Design",
    field: "Games · art pipeline",
    blurb:
      "A tower defense game in Unity with C#, custom Blender models, and hand-drawn pixel art assets.",
    href: "https://docs.google.com/document/d/1MhuqxFeqf64SOi6IuWZ5Yyr8Bm39sFkfx8TZDNv1i4w/edit",
    icons: [ic("unity/unity-original", "Unity"), ic("blender/blender-original", "Blender")],
  },
  {
    name: "Systems Control",
    field: "Controls",
    blurb:
      "Autonomous control systems written on-site in Python and C++ against a clock, with no reference material.",
    note: "Built on-site, timed",
    icons: [ic("python/python-original", "Python"), ic("cplusplus/cplusplus-original", "C++")],
  },
  {
    name: "Board Game Design",
    field: "Systems design",
    blurb: "An original board game, designed and playtested end to end.",
    note: "Built on-site, timed",
    icons: [],
  },
];

export type Project = {
  id: string;
  /** what kind of thing this is — sits above the title on the card */
  category: string;
  title: string;
  /** my relationship to it: Founder, Founding engineer, First author… */
  role: string;
  /** when it happened, shown top-right on the card */
  period: string;
  /** one sentence, on the card */
  tagline: string;
  /**
   * The hardest-to-fake fact about this project. It's the last line of the
   * card, because it's the line that does the convincing.
   */
  proof: string;
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
  /** shown as the card's footer link text */
  liveLabel: string;
  /** renders large, above the grid — exactly one project should set this */
  featured?: boolean;
  /**
   * Sub-projects rendered in full on a featured card. Nobody opens a modal to
   * discover work they don't know is there, and a link labelled "Drone
   * Challenge" doesn't tell you a drone was built.
   */
  breakdown?: TsaEvent[];
  /**
   * The project's own mark, shown as a 3D chip on the card. Every one of these
   * is a real artifact — an app icon off the store listing, a company logo, a
   * conference mark, a frame of the thing actually running. Nothing invented.
   */
  emblem?: {
    src?: string;
    monogram?: string;
    monogramColor?: string;
    bg?: string;
    fullBleed?: boolean;
  };
};

const projects: Project[] = [
  {
    id: "twinly",
    emblem: { src: "/assets/companies/twinly.png", bg: "#000000", fullBleed: true },
    featured: true,
    category: "AI desktop agent",
    title: "Twinly",
    role: "Co-founder & CEO",
    period: "Mar 2026 —",
    tagline:
      "Your digital AI clone. It runs your life and your computer.",
    proof: "Z Fellows '26 · 2,000+ waitlist → 100-user beta",
    live: "https://twinly.tech",
    liveLabel: "twinly.tech",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.docker,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Your digital AI clone. It runs your life and your computer.
          </TypographyP>
          <TypographyP className="font-mono">
            A two-person Delaware C Corp I co-founded and run, in the Z Fellows
            September 2026 cohort. Twinly executes real computer tasks on your
            behalf, with persistent memory, a personal CRM, and a locally cloned
            voice.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Try Twinly" />

          <TypographyH3 className="my-4 mt-8">The Identity Runtime</TypographyH3>
          <p className="font-mono mb-2">
            The architecture I built. macOS accessibility APIs, browser DOM
            state, application state, and vision all compose into a single
            execution graph — so the agent drives real structured interfaces
            wherever they exist, and only falls back to pixel-level control when
            nothing structured is available. Clicking pixels is the last resort,
            not the strategy.
          </p>

          <TypographyH3 className="my-4 mt-8">Launch</TypographyH3>
          <p className="font-mono mb-2">
            Public macOS app shipped July 2026. A 2,000+ person waitlist
            converted into a 100-user private beta, a 150-member Discord, and
            2,700+ TikTok followers. Built on SwiftUI, Electron, Supabase, and
            Stripe.
          </p>
        </div>
      );
    },
  },
  {
    id: "drift",
    emblem: { src: "/assets/companies/drift.png", bg: "#000000", fullBleed: true },
    category: "Robotics simulation platform",
    title: "Drift",
    role: "AI Platform Engineer · founding team",
    period: "Feb 2026 —",
    tagline:
      "Natural language in, working robot simulation out. Claude Code for robotics.",
    proof: "#5 Product of the Day · thousands of engineers · Antler-backed",
    live: "https://godrift.ai",
    liveLabel: "godrift.ai",
    skills: {
      frontend: [PROJECT_SKILLS.ts, PROJECT_SKILLS.next, PROJECT_SKILLS.react],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.ros,
        PROJECT_SKILLS.gazebo,
        PROJECT_SKILLS.cpp,
        PROJECT_SKILLS.docker,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Claude Code for robotics — where I work as founding AI Platform
            Engineer.
          </TypographyP>
          <TypographyP className="font-mono">
            Drift is an Antler-backed AI copilot for robotics simulation. You
            describe what you want a robot to do in plain language; Drift sets
            up, debugs, and runs the simulation across ROS2, Gazebo, and MuJoCo.
            I joined as founding AI engineer after meeting the founders at
            NexHacks, where I was one of three high schoolers accepted out of
            1,500+ applicants.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Visit Drift" />

          <TypographyH3 className="my-4 mt-8">Why this matters</TypographyH3>
          <p className="font-mono mb-2">
            Robotics simulation has a brutal setup tax: days of YAML, launch
            files, and version mismatches before a robot, a world, a sensor stack,
            and a controller agree with each other. Drift collapses that into a
            conversation, so engineers iterate on the control problem instead of
            the plumbing.
          </p>

          <TypographyH3 className="my-4 mt-8">What I actually built</TypographyH3>
          <p className="font-mono mb-2">
            The 129-robot library catalog behind the <code>/robots</code> CLI
            command, with per-entry license verification against MuJoCo Menagerie
            and partner repos. An automated CLI test pipeline driving the tool
            with pexpect, analysing Gazebo screenshots with a vision model, and
            sourcing real queries from robotics forums. The internal EPS
            dashboard and regression CI on a two-week cycle, plus work on Drift
            Desktop in Tauri and React.
          </p>

          <TypographyH3 className="my-4 mt-8">One bug worth naming</TypographyH3>
          <p className="font-mono mb-2">
            A production Gazebo rendering freeze that turned out to be
            gz-transport UDP multicast failing on Ubuntu 24.04 with an RTX 5070.
            Most of debugging robotics simulation is like this: the symptom is in
            the renderer and the cause is four layers down in the network stack.
          </p>

          <TypographyH3 className="my-4 mt-8">Traction</TypographyH3>
          <p className="font-mono mb-2">
            #5 Product of the Day on Product Hunt at launch. Now used by
            thousands of robotics engineers, installed with a single curl
            one-liner on Linux.
          </p>
        </div>
      );
    },
  },
  {
    id: "research",
    emblem: { src: "/assets/logos/iros.png", bg: "#ffffff" },
    category: "Robotics research",
    title: "Joint Control Under Saturation",
    role: "First author · CMU School of Computer Science",
    period: "May 2025 —",
    tagline:
      "Keeping robot joints provably stable when the motor physically can't do what the controller asked.",
    proof: "2 first-author papers · IEEE TRO + IROS, under review",
    live: "https://arxiv.org/abs/2601.18639v3",
    liveLabel: "arxiv.org — read the preprint",
    skills: {
      frontend: [PROJECT_SKILLS.matlab, PROJECT_SKILLS.numpy],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.cpp,
        PROJECT_SKILLS.ros,
        PROJECT_SKILLS.pytorch,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Two first-author papers on what happens when a motor physically
            can&apos;t do what the controller asked.
          </TypographyP>
          <TypographyP className="font-mono">
            Research intern at the Carnegie Mellon Robotics Institute under Prof.
            Min Xu and Dr. Xiaolong Wu. Both papers deal with actuator saturation
            — the regime where a controller commands more torque than the
            hardware can deliver, and the neat guarantees from the textbook
            quietly stop applying.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Read the preprint" />

          <TypographyH3 className="my-4 mt-8">
            Paper 1 — Constraint-aware PID gain optimization
          </TypographyH3>
          <p className="font-mono mb-2">
            <em>
              Constraint-Aware Discrete-Time PID Gain Optimization for Robotic
              Joint Control Under Actuator Saturation.
            </em>{" "}
            arXiv preprint, under review at IEEE Transactions on Robotics. Tunes
            discrete-time PID gains with the saturation limit treated as a
            first-class constraint, rather than as something you patch around
            after the fact.
          </p>

          <TypographyH3 className="my-4 mt-8">
            Paper 2 — SCIG++, safety filtering under attack
          </TypographyH3>
          <p className="font-mono mb-2">
            <em>
              SCIG++: Risk-Limiting Conformal Safety Filtering for
              Attack-Resilient Robotic Joint Control Under Saturation.
            </em>{" "}
            Under review at IEEE IROS. Wraps the controller in a conformal safety
            filter with an explicit risk bound, so a joint stays inside its safe
            set even when the commands reaching it have been adversarially
            manipulated. Demonstrated on a Franka Emika Panda arm.
          </p>
          <ProjectsLinks
            live="https://www.youtube.com/watch?v=2A_RMrd1qKo"
            liveLabel="Watch the Panda demo"
          />

          <TypographyH3 className="my-4 mt-8">Also in the lab</TypographyH3>
          <p className="font-mono mb-2">
            Multi-modal SLAM path-planning work with a PID substructure
            implementation, running alongside the control theory.
          </p>
        </div>
      );
    },
  },
  {
    id: "hive",
    emblem: { monogram: "HIVE", bg: "#1a1206" },
    category: "Hackathon winner",
    title: "HIVE",
    role: "Builder · San Francisco Hackathon",
    period: "2026",
    tagline:
      "An AI operating system that coordinates people across a physical workspace.",
    proof: "Won the San Francisco Hackathon",
    live: "#",
    liveLabel: "Hackathon build",
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.ts],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.opencv,
        PROJECT_SKILLS.pytorch,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            An operating system for a room full of people.
          </TypographyP>
          <TypographyP className="font-mono">
            HIVE reads a physical workspace through camera input and turns what
            it sees into task graphs, then coordinates the people in that space
            against them. It won the San Francisco Hackathon.
          </TypographyP>

          <TypographyH3 className="my-4 mt-8">The idea</TypographyH3>
          <p className="font-mono mb-2">
            Software has gotten very good at coordinating work that already lives
            on a screen, and is close to useless for work happening in a room.
            HIVE treats the room as the interface: vision figures out what is
            being done and by whom, the task graph figures out what should happen
            next, and people get told the one thing that unblocks everyone else.
          </p>
        </div>
      );
    },
  },
  {
    id: "eyesight",
    emblem: {
      src: "/assets/companies/eyesight.png",
      bg: "#000000",
      fullBleed: true,
    },
    category: "iOS accessibility",
    title: "Eyesight",
    role: "Founder · Apple Swift Student Challenge",
    period: "2025 —",
    tagline:
      "Obstacle detection and real-time narration for blind and low-vision users.",
    proof: "LiDAR + on-device CoreML · TestFlight beta",
    live: "https://testflight.apple.com/join/tyjpWY2B",
    liveLabel: "TestFlight",
    skills: {
      frontend: [
        PROJECT_SKILLS.swift,
        PROJECT_SKILLS.swiftui,
        PROJECT_SKILLS.apple,
      ],
      backend: [PROJECT_SKILLS.coreml, PROJECT_SKILLS.opencv],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            The phone tells you what is in front of you, without asking the
            internet.
          </TypographyP>
          <TypographyP className="font-mono">
            Eyesight uses the iPhone&apos;s LiDAR sensor and on-device CoreML
            inference to detect obstacles and narrate surroundings in real time,
            for users who are blind or have low vision. Built for the Apple Swift
            Student Challenge.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Join on TestFlight" />

          <TypographyH3 className="my-4 mt-8">Why on-device</TypographyH3>
          <p className="font-mono mb-2">
            An accessibility tool that stops working without signal is not an
            accessibility tool. Everything runs locally: no round trip, no
            dependency on a connection, and nothing about where a user is or what
            they are looking at ever leaves the phone. The constraint is the
            whole design.
          </p>
          <p className="font-mono mb-2">
            <em>
              The TestFlight beta is currently closed to new testers — worth
              knowing before you tap.
            </em>
          </p>
        </div>
      );
    },
  },
  {
    id: "preventaai",
    emblem: { src: "/assets/companies/preventaai.png", bg: "#0b0b1a", fullBleed: true },
    category: "iOS health app",
    title: "PreventaAI",
    role: "Founder",
    period: "2023 —",
    tagline:
      "A proactive health companion: medication tracking, body map, AI assistant.",
    proof: "Live on the App Store · rated 5.0",
    live: "https://apps.apple.com/us/app/preventaai/id6757689865",
    liveLabel: "App Store",
    skills: {
      frontend: [
        PROJECT_SKILLS.swift,
        PROJECT_SKILLS.swiftui,
        PROJECT_SKILLS.apple,
        PROJECT_SKILLS.appstore,
      ],
      backend: [
        PROJECT_SKILLS.firebase,
        PROJECT_SKILLS.coreml,
        PROJECT_SKILLS.python,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A proactive health companion, shipped to the App Store and rated 5.0.
          </TypographyP>
          <TypographyP className="font-mono">
            SwiftUI and Firebase. Medication tracking with streaks and schedules,
            an AI health assistant, an interactive body map for logging where
            something hurts and how badly, a visual scanner, and short learning
            modules. Listed under Medical; free with in-app purchases.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="View on the App Store" />

          <TypographyH3 className="my-4 mt-8">The one that mattered</TypographyH3>
          <p className="font-mono mb-2">
            A user reported the app helped them catch severe tuberculosis earlier
            than standard screening did. That&apos;s the reason it&apos;s still
            maintained. The streaks, the polish, the rating are all downstream of
            software being in someone&apos;s pocket at the right moment.
          </p>
        </div>
      );
    },
  },
  {
    id: "kinetix",
    emblem: {
      src: "/assets/companies/kinetix.png",
      bg: "#0B1017",
      fullBleed: true,
    },
    category: "Computer vision · biomechanics",
    title: "Kinetix",
    role: "Founder",
    period: "2025 —",
    tagline:
      "A physical therapist that watches your form and tells you when it's wrong.",
    proof: "Live joint-angle tracking from a plain webcam",
    live: "https://www.youtube.com/watch?v=-k4Ks9YATTI",
    liveLabel: "Watch the demo",
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.ts, PROJECT_SKILLS.quest],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.opencv,
        PROJECT_SKILLS.pytorch,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A physical therapist that watches your form and tells you when
            it&apos;s wrong.
          </TypographyP>
          <TypographyP className="font-mono">
            Real-time computer vision reads your pose from a plain webcam and
            computes live joint angles — elbow, shoulder, hip — against the
            target range for the movement. It counts reps, tracks sets, and
            speaks corrections while you are mid-exercise rather than in a report
            afterward. Meta Quest integration for guided sessions in headset.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Watch the demo" />

          <TypographyH3 className="my-4 mt-8">The hard part</TypographyH3>
          <p className="font-mono mb-2">
            Pose estimation is the easy half. &ldquo;Good form&rdquo; is a range,
            not a number, and it moves with body proportions and fatigue. Correct
            too eagerly and the coach is noise; too late and it&apos;s decoration.
            Most of the work was tolerance logic and when to speak.
          </p>
        </div>
      );
    },
  },
  {
    id: "quickcitepro",
    emblem: { src: "/assets/companies/quickcitepro.png", bg: "#1b2a4a", fullBleed: true },
    category: "Research tooling",
    title: "QuickCitePro",
    role: "Founder",
    period: "2025 —",
    tagline: "Triple-click a citation, land on the PDF.",
    proof: "Chrome Web Store · 5.0 ★ · used by professors",
    live: "https://chromewebstore.google.com/detail/quickcitepro/fpngnpgmmpimnlaejklabjelhhoeibpd",
    liveLabel: "Chrome Web Store",
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.chrome,
        PROJECT_SKILLS.webstore,
      ],
      backend: [PROJECT_SKILLS.node],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Triple-click a citation, land on the PDF. 5.0 on the Chrome Web
            Store.
          </TypographyP>
          <TypographyP className="font-mono">
            Built out of a personal annoyance during the CMU research work.
            Reading a dense paper means constantly bouncing off citations:
            copying a title, opening a tab, cleaning a malformed DOI, testing
            three links, checking whether it is open access. QuickCitePro
            collapses that into one gesture — select a citation signal, trigger
            the resolver, land in the document.
          </TypographyP>
          <ProjectsLinks
            live={this.live}
            liveLabel="Install from the Web Store"
          />

          <TypographyH3 className="my-4 mt-8">Who actually uses it</TypographyH3>
          <p className="font-mono mb-2">
            Professors and lab teammates — the only endorsement a research tool
            needs. Small friction per citation, enormous across a literature
            review. Exactly the kind of problem nobody thinks is worth a project.
          </p>
        </div>
      );
    },
  },
  {
    id: "evbots",
    emblem: { src: "/assets/companies/evbots.png", bg: "#ffffff" },
    category: "Autonomous hardware",
    title: "EV Charging Robot",
    role: "AI Robotics Engineer Intern · EV Bots",
    period: "2025",
    tagline:
      "The company's first autonomous EV charging robot that actually closed the loop.",
    proof: "Working prototype · contributed to provisional patents",
    live: "#",
    liveLabel: "Internal — no public link",
    skills: {
      frontend: [PROJECT_SKILLS.python, PROJECT_SKILLS.opencv],
      backend: [
        PROJECT_SKILLS.cpp,
        PROJECT_SKILLS.ros,
        PROJECT_SKILLS.arduino,
        PROJECT_SKILLS.blender,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Plug a car in without a person. Harder than it sounds.
          </TypographyP>
          <TypographyP className="font-mono">
            I shipped EV Bots&apos; first fully working autonomous EV charging
            robot prototype — iterating across mechanical, electronics, and
            controls until the whole loop finally closed. The work contributed to
            multiple provisional patents.
          </TypographyP>

          <TypographyH3 className="my-4 mt-8">Why hardware is different</TypographyH3>
          <p className="font-mono mb-2">
            Software failures are reversible. A misaligned end effector against a
            real charging port is not. Perception has to localise the port, the
            controller has to approach without overshooting, and the mechanism has
            to absorb whatever error survives both. Nothing that works in
            simulation works in a parking lot for free.
          </p>

          <TypographyH3 className="my-4 mt-8">Drone charging dock</TypographyH3>
          <p className="font-mono mb-2">
            I also designed the CAD for an autonomous drone charging dock aimed
            at swarm delivery fleets — the same docking problem, smaller
            tolerances, and a vehicle that cannot simply wait around while you
            get it right.
          </p>
        </div>
      );
    },
  },
  {
    id: "tsa",
    featured: true,
    emblem: { src: "/assets/companies/tsa.png", bg: "#ffffff" },
    category: "TSA Nationals",
    title: "TSA Nationals",
    role: "National competitor · team captain",
    period: "2024 – 2025",
    tagline:
      "Eight separate engineering projects in one season — a carbon-trading web app, an FPV drone, a Meta Quest escape room, an autonomous robot.",
    proof: "Captain for 6 events · national finalist in 2 · 5 portfolios below",
    live: "https://safmstsa.vercel.app",
    liveLabel: "safmstsa.vercel.app",
    breakdown: TSA_EVENTS,
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.unity,
        PROJECT_SKILLS.quest,
        PROJECT_SKILLS.blender,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.chain,
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.cpp,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Eight events at nationals in one season. Captain for six of them.
          </TypographyP>
          <TypographyP className="font-mono">
            The Technology Student Association runs national competitions across
            wildly different disciplines, and I entered eight of them in a single
            year — software, hardware, aerospace, environmental engineering, and
            games. Team captain for six, national finalist in two. Every one of
            these is a full engineering project with its own design cycle, not a
            science-fair poster. Five have submitted documentation portfolios,
            linked below.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Open SAFMS, the live app" />

          <TypographyH3 className="my-4 mt-8">The eight events</TypographyH3>
          <ul className="my-4 flex flex-col divide-y divide-border border-y border-border">
            {TSA_EVENTS.map((ev) => (
              <li
                key={ev.name}
                className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6"
              >
                <span className="w-full shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground md:w-52">
                  {ev.name}
                </span>
                <span className="flex-1 text-sm leading-relaxed">
                  {ev.blurb}
                </span>
                {ev.href ? (
                  <Link
                    href={ev.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-foreground/80 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {ev.linkLabel ?? "Portfolio"}
                    <ArrowUpRight className="size-3" />
                  </Link>
                ) : (
                  <span className="shrink-0 font-mono text-xs text-muted-foreground/50">
                    {ev.note ?? "on-site event"}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <ProjectsLinks
            live="https://docs.google.com/document/d/112GJX5ysoTm5Nm9VSCm8ahcTSYvYtfbAXNIpc9BlZnE/edit"
            liveLabel="All portfolios, one doc"
          />
        </div>
      );
    },
  },
  {
    id: "textbook",
    emblem: { monogram: "SSRN", bg: "#0f2a44" },
    category: "Robotics education",
    title: "Robotics Textbook",
    role: "Author · co-founder, FusionBots",
    period: "2022 – 2025",
    tagline:
      "A free 120-page robotics and programming textbook, published on SSRN.",
    proof: "Published on SSRN · 200+ students taught · team of 18",
    live: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5408322",
    liveLabel: "papers.ssrn.com",
    skills: {
      frontend: [PROJECT_SKILLS.blender],
      backend: [
        PROJECT_SKILLS.cpp,
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.arduino,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            120 pages of robotics and programming, given away free.
          </TypographyP>
          <TypographyP className="font-mono">
            Written and published on SSRN out of FusionBots, the robotics
            non-profit I co-founded at 14 and ran to 200+ students, a team of 18,
            and $6K+ in revenue before we wound it down. The textbook and the
            affordable robotics kits it was written for are what the whole thing
            was actually for.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Read it on SSRN" />

          <TypographyH3 className="my-4 mt-8">Why write it</TypographyH3>
          <p className="font-mono mb-2">
            Robotics has an access problem before it has a talent problem. The
            kits cost more than most school clubs can spend, and the material
            assumes you already own them. So the book teaches from first
            principles up, priced at zero, and the kits were built down to what a
            club could actually afford.
          </p>
        </div>
      );
    },
  },
];

export default projects;
