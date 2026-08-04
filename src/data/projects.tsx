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
};

const projects: Project[] = [
  {
    id: "twinly",
    category: "AI desktop agent",
    title: "Twinly",
    role: "Co-founder & CEO",
    period: "Mar 2026 —",
    tagline: "A digital twin for your Mac and Windows machine.",
    proof: "Shipped · macOS + Windows · from $20/mo",
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
            A digital twin for your Mac and Windows machine.
          </TypographyP>
          <TypographyP className="font-mono">
            Twinly learns how you write, talk, and make decisions — then handles
            your inbox, texts, calendar, browser, and real phone calls the way
            you would. The company I co-founded and run. Free tier at five tasks a
            day; paid plans from $20/month.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Try Twinly" />

          <TypographyH3 className="my-4 mt-8">
            Acting on your behalf, without the horror stories
          </TypographyH3>
          <p className="font-mono mb-2">
            The hard part of an agent with real account access isn&apos;t
            capability, it&apos;s restraint. A live workbench shows every action as
            it happens — read the thread, match the voice, draft the reply — and
            anything consequential waits for an explicit OK before it goes out.
          </p>

          <TypographyH3 className="my-4 mt-8">Where it plugs in</TypographyH3>
          <p className="font-mono mb-2">
            Inbox triage, texts, billing calls, travel checkout, research, CAD
            quotes, calendar conflicts — the operational work that eats a day
            without ever being the day&apos;s actual job. Native on macOS and
            Windows, not a browser tab.
          </p>
        </div>
      );
    },
  },
  {
    id: "drift",
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
            Drift is an Antler-backed, sim-based evaluation platform for robotics
            engineering. You describe what you want a robot to do in plain
            language; Drift sets up, debugs, and runs the simulation across ROS2,
            Gazebo, and Ignition. I joined as the founding AI engineer after
            meeting the founders at NexHacks, where I was one of three high
            schoolers accepted out of 1,500+ applicants.
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

          <TypographyH3 className="my-4 mt-8">Traction</TypographyH3>
          <p className="font-mono mb-2">
            #5 Product of the Day on Product Hunt at public launch. The platform
            is now used by thousands of engineers and installs with a single curl
            one-liner on Linux.
          </p>
        </div>
      );
    },
  },
  {
    id: "research",
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
    id: "preventaai",
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
    category: "Autonomous hardware",
    title: "EV Charging Robot",
    role: "Robotics Engineer · EV Bots",
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
    id: "safms",
    category: "TSA Nationals",
    title: "SAFMS",
    role: "Builder · national competitor",
    period: "2024 – 2025",
    tagline:
      "Carbon-credit modelling for agroforestry, settled on-chain and deployed live.",
    proof: "1 of 8 TSA national events placed in",
    live: "https://safmstsa.vercel.app",
    liveLabel: "safmstsa.vercel.app",
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.vercel,
      ],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.chain],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A carbon-trading dashboard for agroforestry, built for TSA Nationals.
          </TypographyP>
          <TypographyP className="font-mono">
            An AI/IoT modelling web app that tracks a farm&apos;s land use, carbon
            credits, tree count, and live environmental telemetry, then settles
            credit issuance on-chain. Built in React and deployed live — so the
            judges could open it on their own phones instead of watching a slide
            about it.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Open the live app" />

          <TypographyH3 className="my-4 mt-8">
            One of eight events at Nationals
          </TypographyH3>
          <p className="font-mono mb-2">
            SAFMS was one of eight TSA national events I competed and placed in.
            The others: a Betaflight FPV drone with custom CAD and wiring;
            zeolite-based nitrogen-capture domes for agricultural emissions;
            autonomous control systems coded on-site in Python and C++ under a
            timer; an object-manipulating autonomous robot; a fully playable Meta
            Quest escape room in Unity 6; and a tower defense game in Unity with
            custom Blender and pixel art.
          </p>
        </div>
      );
    },
  },
  {
    id: "ypsforum",
    category: "UN MGCY NGO",
    title: "YPS Forum",
    role: "Chief Technology Officer",
    period: "2025 – 2026",
    tagline: "AI literacy programs for students across 15+ countries.",
    proof: "500+ members · presented at UN HLPF and UNGA",
    live: "https://www.ypsforum.org/",
    liveLabel: "ypsforum.org",
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.next, PROJECT_SKILLS.ts],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.firebase],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            CTO of a UN MGCY-affiliated NGO running AI literacy programs across
            15+ countries.
          </TypographyP>
          <TypographyP className="font-mono">
            The Youth Publications &amp; Socioeconomic Forum is a 500+ member
            global organisation. I lead the technology side: the programs
            themselves, the platform they run on, and the AI literacy curriculum
            delivered to students who would otherwise get none. I have presented
            this work at UN conferences including HLPF and UNGA.
          </TypographyP>
          <ProjectsLinks live={this.live} liveLabel="Visit ypsforum.org" />

          <TypographyH3 className="my-4 mt-8">What the work is</TypographyH3>
          <p className="font-mono mb-2">
            Curriculum, platform, and delivery. Most of what I know about
            teaching engineering came from finding out, repeatedly, which parts
            people actually get stuck on.
          </p>
        </div>
      );
    },
  },
];

export default projects;
