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
  supabase: brand("Supabase", "supabase-mono.svg"),
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
  mediapipe: text("MediaPipe", "MP"),
  openai: text("OpenAI", "AI"),
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
      "A Betaflight FPV drone built and tuned from scratch, with a custom CAD frame and wiring loom.",
    href: "https://docs.google.com/document/u/0/d/1EDjvXpqCivNz9_Ob39cphXgzUCBpW2PoxV4uQBgZG2I/edit",
    icons: [ic("arduino/arduino-original", "Arduino"), ic("cplusplus/cplusplus-original", "C++")],
  },
  {
    name: "Robotics",
    field: "Robotics",
    blurb:
      "A robot that picks up and moves objects, driven and autonomous. The chassis, manipulator and routine were all built at the event.",
    note: "Built on-site, timed",
    icons: [ic("cplusplus/cplusplus-original", "C++"), ic("arduino/arduino-original", "Arduino")],
  },
  {
    name: "VR Visualization",
    field: "XR · game engine",
    blurb:
      "A playable escape room in Unity 6 for the Meta Quest, with hand-tracked puzzles.",
    href: "https://docs.google.com/document/d/176jDWUSqxicfdT6wM05To4pvtfx3kMSmVqMIt49FyZQ/edit",
    icons: [ic("unity/unity-original", "Unity"), ic("csharp/csharp-original", "C#")],
  },
  {
    name: "Software Development",
    field: "Web · blockchain",
    blurb:
      "SAFMS, an AI/IoT web app that models agroforestry carbon credits from land use and live environmental sensors, and issues the credits on-chain.",
    href: "https://safmstsa.vercel.app",
    linkLabel: "Open the live app",
    icons: [ic("react/react-original", "React"), ic("javascript/javascript-original", "JavaScript")],
  },
  {
    name: "Engineering Design",
    field: "Environmental",
    blurb:
      "Zeolite domes that capture nitrogen to cut agricultural emissions, from materials and geometry to capture modelling.",
    href: "https://docs.google.com/document/d/1kdHmo5DeLaevcmrig-DwGT1apDXM1F7g4HFoFn7aL7o/edit",
    icons: [ic("python/python-original", "Python")],
  },
  {
    name: "Video Game Design",
    field: "Games · art pipeline",
    blurb:
      "A tower defense game in Unity and C#, with custom Blender models and hand-drawn pixel art.",
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
    category: "Desktop AI agent",
    title: "Twinly",
    role: "Co-founder & CEO",
    period: "Dec 2025 —",
    tagline:
      "An AI agent for macOS and Windows that handles your browser, email, calendar, files and phone calls in your own voice.",
    proof: "Z Fellows '26 · 1,000+ active users on macOS, Windows, iOS",
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
          <TypographyP className="font-mono">
            I co-founded Twinly and run it as CEO. It&apos;s a two-person
            company in the Z Fellows September 2026 cohort. Twinly learns how
            you write, talk and use your computer, then does tasks for you, with
            persistent memory, a personal CRM and a voice clone that runs
            locally. You choose how much it asks before it acts.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Try Twinly" />

          <TypographyH3 className="my-4 mt-8">The Identity Runtime</TypographyH3>
          <p className="font-mono mb-2">
            This is the part I built. It combines macOS accessibility APIs,
            browser DOM state, app state and vision into one execution graph.
            The agent works through those structured interfaces wherever they
            exist and only clicks on pixels when there&apos;s nothing else to
            use.
          </p>

          <TypographyH3 className="my-4 mt-8">Launch</TypographyH3>
          <p className="font-mono mb-2">
            The macOS app went public in July 2026 to a waitlist of 2,000+.
            Twinly now has macOS, Windows and iOS apps with 1,000+ active users,
            including paying customers, built on SwiftUI, Electron, Supabase and
            Stripe.
          </p>
        </div>
      );
    },
  },
  {
    id: "applytwin",
    emblem: { src: "/assets/companies/applytwin.png", bg: "#ffffff" },
    featured: true,
    category: "Job search agent",
    title: "ApplyTwin",
    role: "Creator",
    period: "Oct 2026 —",
    tagline:
      "Finds internships, writes a one-page résumé for each posting and fills out the application for you.",
    proof: "600+ career sites · runs on your Claude Code or Codex plan",
    live: "https://apply.twinly.tech",
    liveLabel: "apply.twinly.tech",
    github: "https://github.com/OjasMishra32/applytwin",
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.ts],
      backend: [PROJECT_SKILLS.python, PROJECT_SKILLS.node],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A free app that runs on your own computer and uses the Claude Code
            or Codex plan you already pay for, so there are no API keys and no
            new subscription. It installs with one line on Mac, Windows or
            Linux.
          </TypographyP>
          <ProjectsLinks
            live={this.live}
            repo={this.github}
            liveLabel="Get it at apply.twinly.tech"
          />

          <TypographyH3 className="my-4 mt-8">How it works</TypographyH3>
          <p className="font-mono mb-2">
            It reads the career sites of 600+ companies on Greenhouse, Lever,
            Ashby, Workday and SmartRecruiters, plus the community internship
            trackers, and scores each posting against your roles, location,
            graduation date and sponsorship needs.
          </p>
          <p className="font-mono mb-2">
            For each job it builds a one-page résumé from everything you&apos;ve
            done, choosing and ordering the most relevant parts. A fact check
            rejects any rewrite that adds a number, tool or claim you
            didn&apos;t write.
          </p>
          <p className="font-mono mb-2">
            Then your Claude Code or Codex opens the application in a browser,
            fills it in from your saved answers, uploads the PDF and stops on
            the review screen so you can press Submit. It never applies to the
            same role twice.
          </p>

          <TypographyH3 className="my-4 mt-8">What it won&apos;t do</TypographyH3>
          <p className="font-mono mb-2">
            Show your password to the AI, solve a CAPTCHA, accept a legal
            agreement, or change a number, title, employer, degree or award on
            your résumé. When it reaches one of those, it stops and notifies
            you.
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
    role: "AI/Software Engineer · founding team",
    period: "Nov 2025 —",
    tagline:
      "Claude Code for robots. Describe what you want a robot to do and it builds and runs the simulation.",
    proof: "#5 Product of the Day · 1,000+ users · Antler-backed",
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
          <TypographyP className="font-mono">
            Drift is an AI coding agent for robotics, backed by Antler. You
            describe what you want a robot to do in plain language, and it sets
            up, debugs and runs the simulation in ROS2, Gazebo, MuJoCo or Isaac
            Sim. I joined the founding team after meeting the founders at
            NexHacks, where I was one of three high schoolers accepted out of
            1,500+ applicants.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Visit Drift" />

          <TypographyH3 className="my-4 mt-8">What I built</TypographyH3>
          <p className="font-mono mb-2">
            The 129-robot catalog behind the <code>/robots</code> command, each
            entry license-checked against MuJoCo Menagerie and partner repos.
            Photo-to-3D scene generation with World Labs. A CLI test harness
            that drives the tool through pexpect, has a vision model check
            Gazebo screenshots, and asks it real questions pulled from robotics
            forums. Regression CI, the internal EPS dashboard, and parts of
            Drift Desktop in Tauri and React.
          </p>

          <TypographyH3 className="my-4 mt-8">A production bug</TypographyH3>
          <p className="font-mono mb-2">
            Gazebo&apos;s rendering froze in production. I traced it to
            gz-transport&apos;s UDP multicast failing on Ubuntu 24.04 with an
            RTX 5070, and fixed it.
          </p>

          <TypographyH3 className="my-4 mt-8">Launch</TypographyH3>
          <p className="font-mono mb-2">
            #5 Product of the Day on Product Hunt. 1,000+ robotics engineers use
            it now, and it installs on Linux with one curl command.
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
    period: "Jul 2025 —",
    tagline:
      "Control for robot joints when the motor can't deliver the torque the controller asks for.",
    proof: "3 first-author papers · IEEE T-RO, IROS, ICRA",
    live: "https://arxiv.org/abs/2601.18639v3",
    liveLabel: "Read the preprint on arXiv",
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
          <TypographyP className="font-mono">
            Research intern at Carnegie Mellon&apos;s Robotics Institute with
            Prof. Min Xu and Dr. Xiaolong Wu. All three papers deal with
            actuator saturation, where the controller asks for more torque than
            the motor can produce and the usual stability guarantees stop
            holding.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Read the preprint" />

          <TypographyH3 className="my-4 mt-8">
            Constraint-aware PID gain optimization
          </TypographyH3>
          <p className="font-mono mb-2">
            <em>
              Constraint-Aware Discrete-Time PID Gain Optimization for Robotic
              Joint Control Under Actuator Saturation.
            </em>{" "}
            Under review at IEEE Transactions on Robotics, preprint on arXiv.
            It tunes discrete-time PID gains with the saturation limit built in
            as a constraint from the start.
          </p>

          <TypographyH3 className="my-4 mt-8">SCIG++</TypographyH3>
          <p className="font-mono mb-2">
            <em>
              SCIG++: Risk-Limiting Conformal Safety Filtering for
              Attack-Resilient Robotic Joint Control Under Saturation.
            </em>{" "}
            Under review at IEEE IROS. A conformal safety filter with an
            explicit risk bound keeps each joint in its safe set even when the
            commands reaching it have been tampered with. Demonstrated on a
            Franka Emika Panda arm.
          </p>
          <ProjectsLinks
            live="https://www.youtube.com/watch?v=2A_RMrd1qKo"
            liveLabel="Watch the Panda demo"
          />

          <TypographyH3 className="my-4 mt-8">
            Feedback authority under torque limits
          </TypographyH3>
          <p className="font-mono mb-2">
            <em>
              Bounding Detector-Accepted Feedback Authority in Torque-Limited
              Robot Control.
            </em>{" "}
            IEEE ICRA 2027. Bounds how much control authority a command can
            carry and still pass the attack detector when the joints are
            torque-limited.
          </p>

          <TypographyH3 className="my-4 mt-8">Other lab work</TypographyH3>
          <p className="font-mono mb-2">
            Multimodal SLAM and path-planning experiments with a PID controller
            underneath.
          </p>
        </div>
      );
    },
  },
  {
    id: "dejaview",
    emblem: { src: "/assets/companies/dejaview.png", bg: "#007aff", fullBleed: true },
    category: "Hackathon winner",
    title: "Deja View",
    role: "Builder · SwampHacks XII",
    period: "Oct 2026",
    tagline:
      "Turns a photo or video of any place, real or from a game, into a 3D world you can walk into on a Meta Quest, in a browser or in Roblox.",
    proof: "1st place, AI/ML track + DeepSpace track · SwampHacks XII",
    live: "https://deja-view.photo",
    liveLabel: "deja-view.photo",
    github: "https://github.com/OjasMishra32/Deja-View",
    skills: {
      frontend: [PROJECT_SKILLS.ts, PROJECT_SKILLS.quest, PROJECT_SKILLS.node],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.pytorch,
        PROJECT_SKILLS.opencv,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Built in 36 hours at SwampHacks XII with Shivin, Brianna and Seb. It
            took 1st in both the AI/ML track and the DeepSpace track. Give it a
            phone video, a single photo or game footage (we rebuilt
            Fortnite&apos;s Tilted Towers) and it becomes a world you can walk
            through on a Meta Quest, in a browser or in Roblox.
          </TypographyP>
          <ProjectsLinks
            live={this.live}
            repo={this.github}
            liveLabel="Walk in at deja-view.photo"
          />

          <TypographyH3 className="my-4 mt-8">How it works</TypographyH3>
          <p className="font-mono mb-2">
            COLMAP solves every camera&apos;s pose (163 cameras for one room, at
            about 1 px of reprojection error). Then a Gaussian splat of about a
            million 3D Gaussians trains on UF&apos;s HiPerGator with
            gsplat&apos;s MCMC densification: 30k steps in 11 minutes. From a
            single photo, a video world model (FlashWorld, on Wan2.2) generates
            the rest of the room in about 6 seconds.
          </p>

          <TypographyH3 className="my-4 mt-8">
            What&apos;s real and what&apos;s guessed
          </TypographyH3>
          <p className="font-mono mb-2">
            Every Gaussian is checked against the cameras that actually saw it,
            and one button in the headset tints the guessed parts blue. Holes
            are filled by rendering 2,304 probe views: Qwen2.5-VL describes what
            belongs there, Qwen-Image-Edit paints it, and Depth Anything V2
            lifts it back into 3D. A fill only stays if every original view
            still matches at 45 dB PSNR.
          </p>

          <TypographyH3 className="my-4 mt-8">People and Roblox</TypographyH3>
          <p className="font-mono mb-2">
            People are cut out of the video, depth-mapped every frame, fit with
            a 3D body model and put back in the room, moving. Every world also
            compiles into a life-size Roblox map, and the headset and Roblox
            share one 240 Hz ping pong physics sim, so a friend on a laptop can
            play someone in VR. Gemini knows every room and answers questions
            out loud.
          </p>
        </div>
      );
    },
  },
  {
    id: "luciddreams",
    emblem: { src: "/assets/companies/luciddreams.svg", bg: "#000000", fullBleed: true },
    category: "Hackathon build · Meta Quest",
    title: "Lucid Dreams",
    role: "Builder · Gator Hack V",
    period: "Oct 2026",
    tagline:
      "Turns a video or a few photos of someone into a life-size 3D person standing in your room, in a Meta Quest.",
    proof: "Built in 48 hours at Gator Hack V · 12 NVIDIA B200s on UF's HiPerGator",
    live: "https://getluciddreams.vercel.app",
    liveLabel: "getluciddreams.vercel.app",
    github: "https://github.com/OjasMishra32/lucid_dreams",
    skills: {
      frontend: [PROJECT_SKILLS.ts, PROJECT_SKILLS.next, PROJECT_SKILLS.quest],
      backend: [PROJECT_SKILLS.python, PROJECT_SKILLS.pytorch],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Built in 48 hours at Gator Hack V (UF AI Days 2026) with Vishal, Ian
            and Atina. You give it a clip or a few photos and one sentence about
            what you want to do with that person, and they appear life-size in
            Meta Quest passthrough, from one link in the Quest browser.
          </TypographyP>
          <ProjectsLinks
            live={this.live}
            repo={this.github}
            liveLabel="Open the website"
          />

          <TypographyH3 className="my-4 mt-8">What you can do</TypographyH3>
          <p className="font-mono mb-2">
            Learn a guitar part, a golf swing or a dance from a teacher who
            slows each step down and waits for your turn. Play chess against
            Bobby Fischer and Magnus Carlsen likenesses that reach over and move
            their own pieces, play a tennis match against a Roger Federer
            likeness, or shoot around with LeBron. Public figures are labelled
            on screen and never speak.
          </p>
          <p className="font-mono mb-2">
            Vishal, built from a short phone video of him turning around,
            answers out loud in his own cloned voice 3.1 seconds after you
            finish asking. He agreed to it, and every reply is labelled as an AI
            voice.
          </p>

          <TypographyH3 className="my-4 mt-8">How it works</TypographyH3>
          <p className="font-mono mb-2">
            4DAnyone turns one video into 48 synchronized views of the person.
            On UF&apos;s HiPerGator, 12 NVIDIA B200s fit about 290,000 Gaussians
            to every frame with gsplat. The headset app is WebXR, built on
            three.js and Spark, and keeps the 160,000 Gaussians per frame that
            matter most.
          </p>

          <TypographyH3 className="my-4 mt-8">Reality check</TypographyH3>
          <p className="font-mono mb-2">
            No camera sees every side of a person, so part of every replay is
            generated. One tap turns everything the camera never saw blue and
            shows how much of the person was really seen.
          </p>
        </div>
      );
    },
  },
  {
    id: "volition",
    emblem: { src: "/assets/companies/volition.png", bg: "#ffffff", fullBleed: true },
    category: "Exoskeleton concept",
    title: "Volition",
    role: "CAD, controls and simulation",
    period: "Oct 2026",
    tagline:
      "A concept exoskeleton for people with complete paraplegia, controlled by imagined movements read from an EEG cap.",
    proof: "Walks 8 steps in a 1 kHz closed-loop simulation · design only, not built",
    live: "https://volition-eight.vercel.app",
    liveLabel: "volition-eight.vercel.app",
    github: "https://github.com/OjasMishra32/volition",
    skills: { frontend: [], backend: [] },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A concept design for a brain-controlled exoskeleton for people with
            complete paraplegia: a parametric CAD model in CadQuery, the
            electronics and control design, and a 1 kHz closed-loop simulation
            driven by a synthetic EEG decoder. It hasn&apos;t been built or
            tested on people, so every number here is a design estimate.
          </TypographyP>
          <ProjectsLinks
            live={this.live}
            repo={this.github}
            liveLabel="See the design"
          />

          <TypographyH3 className="my-4 mt-8">Control</TypographyH3>
          <p className="font-mono mb-2">
            The user wears a 16-channel EEG cap. Imagining a foot movement asks
            the exoskeleton to move forward through its sequence, from sitting
            to standing to walking, and imagining a hand movement asks it to go
            back. Nothing moves until the user confirms with a button on a
            crutch handle within 4 seconds, and a stop button on either crutch
            works at any time.
          </p>

          <TypographyH3 className="my-4 mt-8">Torque limits</TypographyH3>
          <p className="font-mono mb-2">
            Both hips and both knees use the same actuator, a frameless BLDC
            motor on a 100:1 strain-wave gear. The torque each joint can
            deliver is recomputed every millisecond as the smallest of five
            limits: peak, current, voltage, thermal and slew. While a limit
            binds, the controller stops the integrator from winding up. In a
            sit-to-stand on a nearly empty battery, that cut the integrator peak
            from 73 N·m to 16 N·m and the knee overshoot from 1.69° to 0.38°.
          </p>

          <TypographyH3 className="my-4 mt-8">In simulation</TypographyH3>
          <p className="font-mono mb-2">
            The user stands up, walks 8 steps (2.66 m at 0.25 m/s), stops and
            sits down, with every transition decoded from synthetic EEG and
            confirmed with the button. The decoder scored 85% on held-out data
            with no unconfirmed detections in 5 minutes of rest. Detection takes
            3.3 to 4.7 seconds from the start of the imagined movement, which is
            still an open issue.
          </p>
        </div>
      );
    },
  },
  {
    id: "courtside",
    emblem: { src: "/assets/companies/courtside.jpg", bg: "#0b1d6b", fullBleed: true },
    category: "Computer vision · quant research",
    title: "Courtside",
    role: "Builder · Gator Quant Hacks 2026",
    period: "Oct 2026",
    tagline:
      "A ball tracker that calls the point before it lands, and a test of what that head start is worth on Polymarket.",
    proof: "Early calls a median 162 ms before the bounce, none wrong · 13,084 matches",
    live: "https://drive.google.com/file/d/1ZMOhVQHA-lSsqmIboTntavcxZIRGt4Nr/view",
    liveLabel: "Read the paper",
    github: "https://github.com/OjasMishra32/computervision_quant_strategy",
    skills: {
      frontend: [PROJECT_SKILLS.numpy],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.pytorch,
        PROJECT_SKILLS.opencv,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Built at Gator Quant Hacks 2026, Systematic Trading track, with Yoan
            Exposito, Rafael Penhas and Ian Hoang. A camera films the court, a
            model finds the ball, fits its flight, and calls a miss or an out
            before the bounce. On held-out table tennis its early calls came a
            median 162 ms before the ball landed, none wrong, at 119.9 fps. On
            broadcast tennis its out calls were right 5 of 5 at the bounce.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} liveLabel="Read the paper" />
          <ProjectsLinks
            live="https://github.com/OjasMishra32/computervision_quant_strategy/blob/main/results/viz/courtside_60.mp4"
            liveLabel="Watch the 90 s video"
          />

          <TypographyH3 className="my-4 mt-8">The market side</TypographyH3>
          <p className="font-mono mb-2">
            Polymarket prices each match from 0 to 1 and lags each point by
            about a second, so whoever learns the point first sets the price.
            Across 13,084 ATP and WTA matches, wallets trading within 3 seconds
            of a point earned after fees in all 11 months, as our pre-registered
            hypothesis predicted out of sample. Copying them after the fact
            loses about a cent a share once fees and delays are in, so the
            profit comes from being fast. We priced the first second of feed
            delay at $42 to $74 a day.
          </p>
          <p className="font-mono mb-2 text-sm opacity-70">
            Paper trading only: real Polymarket prices and fills, simulated
            camera calls, no real money.
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
    role: "Builder · YC Transpose",
    period: "2026",
    tagline:
      "Computer vision that turns a physical workspace into task graphs and coordinates the people in it.",
    proof: "1st place at YC Transpose",
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
          <TypographyP className="font-mono">
            1st place at YC Transpose. HIVE watches a physical workspace through
            cameras, turns what it sees into task graphs, and coordinates the
            people in the room against them. Vision works out what is being
            done and by whom, and the task graph decides what should happen
            next.
          </TypographyP>
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
    role: "Builder · NexHacks",
    period: "2025",
    tagline:
      "A physical therapy coach that watches your form through a webcam and corrects it out loud.",
    proof: "Live joint-angle tracking from a plain webcam, voice coaching in a Meta Quest",
    live: "https://www.youtube.com/watch?v=-k4Ks9YATTI",
    liveLabel: "Watch the demo",
    skills: {
      frontend: [
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.quest,
      ],
      backend: [PROJECT_SKILLS.mediapipe, PROJECT_SKILLS.supabase],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Built at NexHacks with Andrew Yuan, Eashan Iyer and Kevin Harned.
            MediaPipe reads your pose from a plain webcam and computes live
            joint angles at the elbow, shoulder and hip, checked against
            per-exercise thresholds stored in Supabase. It counts reps and holds
            and speaks corrections while you&apos;re mid-exercise. LiveKit
            carries the audio in real time, ElevenLabs does the speaking, and a
            Meta Quest headset puts the feedback in front of your eyes. The
            front end is Next.js, TypeScript and Tailwind.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Watch the demo" />
          <ProjectsLinks
            live="https://devpost.com/software/flowers-and-joy"
            liveLabel="Devpost write-up"
          />
          <p className="font-mono mb-2">
            Most of the work went into the tolerance logic: how far off counts
            as bad form, and when to speak up.
          </p>
        </div>
      );
    },
  },
  {
    id: "fuse",
    emblem: { monogram: "FUSE", bg: "#101010" },
    category: "Hackathon build · iOS",
    title: "FUSE",
    role: "Builder · Bitrig Hacks at Y Combinator",
    period: "Sep 2026",
    tagline:
      "Put one thing on each half of a foldable iPhone, fold it, and get one useful result back.",
    proof: "Native Swift app with 12 result types · Bitrig Hacks iPhone Duo Edition",
    live: "https://devpost.com/software/fuse-47s1jg",
    liveLabel: "Devpost",
    github: "https://github.com/OjasMishra32/fuse",
    skills: {
      frontend: [PROJECT_SKILLS.swift, PROJECT_SKILLS.apple],
      backend: [PROJECT_SKILLS.openai, PROJECT_SKILLS.supabase, PROJECT_SKILLS.python],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Built at Bitrig Hacks iPhone Duo Edition at Y Combinator with
            Abhinav Nigam, Abhinav Shivalli, Harpreet Vishnoi and Vasu Ganesa.
            You put something on each screen of the foldable iPhone Duo (a
            résumé and a job post, say, or an email and your calendar) and fold
            the phone. FUSE sends both inputs and any spoken instruction to
            OpenAI, which picks what kind of result fits, and the app renders
            it natively: an itinerary on a map, a calendar event, an email
            draft, a quiz, slides, a generated image and more, 12 result types
            in all.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} liveLabel="Devpost" />
          <ProjectsLinks
            live="https://www.youtube.com/watch?v=h8jK9cSw0xU"
            liveLabel="Watch the demo"
          />

          <TypographyH3 className="my-4 mt-8">Getting content in</TypographyH3>
          <p className="font-mono mb-2">
            Content comes from FUSE&apos;s own browser, map, notes and photo
            panes, or from other apps through the Share Sheet, a Safari
            extension and Shortcuts. Results are kept in a local history, with
            RevenueCat handling subscriptions and Supabase backing a community
            feed.
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
          <TypographyP className="font-mono">
            Eyesight uses the iPhone&apos;s LiDAR sensor and on-device CoreML to
            detect obstacles and describe the surroundings out loud in real
            time, for people who are blind or have low vision. Built for the
            Apple Swift Student Challenge. Everything runs on the phone, so it
            works with no signal and nothing about where you are or what
            you&apos;re looking at leaves the device.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Join on TestFlight" />
          <p className="font-mono mb-2">
            <em>The TestFlight beta isn&apos;t taking new testers right now.</em>
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
      "A health app for medication tracking, logging symptoms on a body map, and asking an AI assistant.",
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
          <TypographyP className="font-mono">
            A health app on the App Store, rated 5.0. Built with SwiftUI and
            Firebase: medication tracking with streaks and schedules, an AI
            health assistant, a body map for logging where something hurts and
            how badly, a visual scanner and short lessons. Free, with in-app
            purchases.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="View on the App Store" />
          <p className="font-mono mb-2">
            One user reported that it helped them catch severe tuberculosis
            earlier than standard screening did.
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
          <TypographyP className="font-mono">
            A Chrome extension I built during the CMU research work. Following a
            citation in a dense paper meant copying the title, opening a tab,
            fixing a broken DOI and trying links one by one. With QuickCitePro
            you triple-click the citation and land on the paper. Rated 5.0 on
            the Chrome Web Store and used by professors and lab teammates.
          </TypographyP>
          <ProjectsLinks
            live={this.live}
            liveLabel="Install from the Web Store"
          />
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
      "The company's first autonomous EV-charging robot that worked end to end.",
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
          <TypographyP className="font-mono">
            I built EV Bots&apos; first fully working autonomous EV-charging
            robot prototype, iterating on the mechanics, electronics and
            controls until the robot could find a car&apos;s charging port and
            plug in by itself. The work went into several provisional patents.
          </TypographyP>
          <p className="font-mono mb-2">
            I also designed the CAD for an autonomous drone charging dock meant
            for swarm delivery fleets.
          </p>
        </div>
      );
    },
  },
  {
    id: "glassbox",
    emblem: { monogram: "GB", bg: "#0d1117" },
    category: "Hackathon placement · interview integrity",
    title: "GlassBoxAI",
    role: "Co-founder & CEO",
    period: "2024",
    tagline:
      "An overlay for Zoom and Google Meet that flags AI-assisted answers in live interviews.",
    proof: "2nd of 200+ at Startup in a Weekend Philly, the only high school team",
    live: "#",
    liveLabel: "Hackathon build",
    skills: { frontend: [], backend: [] },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Built with three friends over a 48-hour startup weekend in
            Philadelphia, as the only high school team among 200+ competitors
            from Penn, Drexel and MIT. It took 2nd place.
          </TypographyP>
          <p className="font-mono mb-2">
            GlassBoxAI sits on top of Zoom, Teams or Google Meet. Face tracking
            follows small shifts in gaze and blink rate, an audio analyzer
            listens for odd pauses and a pitch that never changes, and a small
            language model reads the transcript. Together they flag script
            reading and AI-assisted answers from tools like ChatGPT and Cluely.
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
      "Eight engineering projects in one season, from a carbon-credit web app to an FPV drone and a Meta Quest escape room.",
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
          <TypographyP className="font-mono">
            The Technology Student Association runs national competitions in
            very different fields, and I entered eight in one year, across
            software, hardware, aerospace, environmental engineering and games.
            I captained six of the teams and made the national final in two.
            Five of the projects have documentation portfolios, linked below.
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
    role: "Author",
    period: "2022 – 2025",
    tagline:
      "A 120-page robotics and programming textbook that starts from first principles.",
    proof: "Free and open access on SSRN",
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
          <TypographyP className="font-mono">
            A 120-page introduction to robotics and programming that starts from
            first principles, written for students who can&apos;t get the
            material any other way. It&apos;s free and open access on SSRN.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Read it on SSRN" />
        </div>
      );
    },
  },
];

export default projects;
