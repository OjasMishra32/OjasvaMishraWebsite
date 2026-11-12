/**
 * Everything the site says about Ojasva lives in this file.
 *
 * The 3D world (project board, research lab, career timeline, contact plaza)
 * and the HTML profile panel both read from here, so a fact only has to be
 * edited once.
 */

export const person = {
    name: 'Ojasva Mishra',
    first: 'Ojasva',
    last: 'Mishra',
    headline: 'AI and robotics engineer',
    line: 'I work on robot control and AI agents.',
    site: 'https://www.ojasvamishra.me',
    email: 'ojasvamishra32@gmail.com',
    resume: '/OjasMishraResume.pdf',
    links: {
        github: 'https://github.com/OjasMishra32',
        linkedin: 'https://www.linkedin.com/in/ojasva-mishra-657b89352/',
        instagram: 'https://www.instagram.com/ojas_mishra32/',
    },
    summary: [
        'I study Computer Engineering and Finance at the University of Florida (B.S. + M.S., four-year combined pathway, full merit).',
        'I co-founded Twinly and run it as CEO, I was on the founding team at Drift, and I do robotics research with the CMU Robotics Institute, where I\'m first author on three papers about robot joints that hit their torque limit.',
    ],
    now: [
        { label: 'Co-founder & CEO', detail: 'Twinly', url: 'https://twinly.tech', emblem: 'Twinly' },
        { label: 'Researcher', detail: 'CMU Robotics Institute', url: 'https://www.ri.cmu.edu/', emblem: 'Carnegie Mellon University, Robotics Institute' },
        { label: 'Quant research analyst', detail: 'AlgoGators Investment Fund', emblem: 'AlgoGators Investment Fund' },
        { label: 'Freshman', detail: 'UF · B.S. CE + M.S. Finance', emblem: 'University of Florida' },
    ],
}

/**
 * Projects, shown on the workshop board in the world and in the profile panel.
 *
 * `titleSmall` is what the neighbouring signposts show (one or two short lines).
 * `attributes` fill the three wooden signs next to the board (role / at / with).
 * `award` is carved on the plaque on the table. Leave it out when there isn't one.
 * `images` are files in static/projects/images.
 */
export const projects = [
    {
        id: 'twinly',
        title: 'Twinly',
        titleSmall: [ 'Twinly' ],
        category: 'Desktop AI agent',
        role: 'Co-founder & CEO',
        period: 'Dec 2025 – now',
        tagline: 'An AI agent for macOS and Windows that handles your browser, email, calendar, files and phone calls in your own voice.',
        proof: 'Z Fellows \'26 · 1,000+ active users on macOS, Windows and iOS',
        url: 'https://twinly.tech',
        attributes: { role: [ 'Co-founder', '& CEO' ], at: 'Z Fellows \'26' },
        award: [ '1,000+', 'active users' ],
        images: [ 'twinly-cover.webp' ],
        links: [ { label: 'Try Twinly', url: 'https://twinly.tech' } ],
        body: [
            'I co-founded Twinly and run it as CEO. It\'s a two-person company in the Z Fellows September 2026 cohort. Twinly learns how you write, talk and use your computer, then does tasks for you, with persistent memory, a personal CRM and a voice clone that runs locally. You choose how much it asks before it acts.',
            'I built the Identity Runtime. It combines macOS accessibility APIs, browser DOM state, app state and vision into one execution graph. The agent works through those structured interfaces wherever they exist and only clicks on pixels when there\'s nothing else to use.',
            'The macOS app went public in July 2026 to a waitlist of 2,000+. Twinly now has macOS, Windows and iOS apps with 1,000+ active users, including paying customers, built on SwiftUI, Electron, Supabase and Stripe.',
        ],
    },
    {
        id: 'applytwin',
        title: 'ApplyTwin',
        titleSmall: [ 'ApplyTwin' ],
        category: 'Job search agent',
        role: 'Creator',
        period: 'Oct 2026 – now',
        tagline: 'Finds internships, writes a one-page résumé for each posting and fills out the application for you.',
        proof: '600+ career sites · runs on your Claude Code or Codex plan',
        url: 'https://apply.twinly.tech',
        attributes: { role: 'Creator', with: [ 'Claude Code', 'or Codex' ] },
        award: [ '600+', 'career sites' ],
        images: [ 'applytwin-cover.webp', 'applytwin-2.webp' ],
        links: [
            { label: 'Get it at apply.twinly.tech', url: 'https://apply.twinly.tech' },
            { label: 'GitHub', url: 'https://github.com/OjasMishra32/applytwin' },
        ],
        body: [
            'A free app that runs on your own computer and uses the Claude Code or Codex plan you already pay for, so there are no API keys and no new subscription. It installs with one line on Mac, Windows or Linux.',
            'It reads the career sites of 600+ companies on Greenhouse, Lever, Ashby, Workday and SmartRecruiters, plus the community internship trackers, and scores each posting against your roles, location, graduation date and sponsorship needs.',
            'For each job it builds a one-page résumé from everything you\'ve done. A fact check rejects any rewrite that adds a number, tool or claim you didn\'t write. Then it opens the application in a browser, fills it in, uploads the PDF and stops on the review screen so you can press Submit.',
        ],
    },
    {
        id: 'drift',
        title: 'Drift',
        titleSmall: [ 'Drift' ],
        category: 'Robotics simulation platform',
        role: 'AI/Software Engineer, founding team',
        period: 'Nov 2025 – Aug 2026',
        tagline: 'Claude Code for robots. Describe what you want a robot to do and it builds and runs the simulation.',
        proof: '#5 Product of the Day · 1,000+ users · backed by Antler',
        url: 'https://godrift.ai',
        attributes: { role: [ 'Founding', 'engineer' ], with: 'Antler' },
        award: [ '#5 Product', 'of the Day' ],
        images: [ 'drift-cover.webp' ],
        links: [ { label: 'Visit Drift', url: 'https://godrift.ai' } ],
        body: [
            'Drift is an AI coding agent for robotics, backed by Antler. You describe what you want a robot to do in plain language, and it sets up, debugs and runs the simulation in ROS2, Gazebo, MuJoCo or Isaac Sim. I joined the founding team after meeting the founders at NexHacks, where I was one of three high schoolers accepted out of 1,500+ applicants.',
            'I built the Gaussian splat pipeline that turns photos of real spaces into walkable 3D worlds robots can be simulated in, and a self-healing loop where an error-triage service groups the failures users report and a repair agent patches the code and reruns CI.',
            'I also built the 129-robot catalog behind the /robots command, photo-to-3D scene generation with World Labs, and a CLI test harness that drives the tool through pexpect and has a vision model check Gazebo screenshots.',
            'When Gazebo\'s rendering froze in production, I traced it to gz-transport\'s UDP multicast failing on Ubuntu 24.04 with an RTX 5070, and fixed it.',
        ],
    },
    {
        id: 'dejaview',
        title: 'Deja View',
        titleSmall: [ 'Deja', 'View' ],
        category: 'Hackathon winner',
        role: 'Builder',
        period: 'Oct 2026',
        tagline: 'Turns a photo or video of any place, real or from a game, into a 3D world you can walk into on a Meta Quest, in a browser or in Roblox.',
        proof: '1st place in the AI/ML track and the DeepSpace track · SwampHacks XII',
        url: 'https://deja-view.photo',
        attributes: { role: 'Builder', at: [ 'SwampHacks', 'XII' ], with: [ 'Shivin, Brianna', '& Seb' ] },
        award: [ '1st place', 'in two tracks' ],
        images: [ 'dejaview-cover.webp', 'dejaview-2.webp', 'dejaview-3.webp' ],
        links: [
            { label: 'Walk in at deja-view.photo', url: 'https://deja-view.photo' },
            { label: 'GitHub', url: 'https://github.com/OjasMishra32/Deja-View' },
        ],
        body: [
            'Built in 36 hours at SwampHacks XII with Shivin, Brianna and Seb. Give it a phone video, a single photo or game footage (we rebuilt Fortnite\'s Tilted Towers) and it becomes a world you can walk through on a Meta Quest, in a browser or in Roblox.',
            'COLMAP solves every camera\'s pose (163 cameras for one room, at about 1 px of reprojection error). Then a Gaussian splat of about a million 3D Gaussians trains on UF\'s HiPerGator: 30k steps in 11 minutes. From a single photo, a video world model generates the rest of the room in about 6 seconds.',
            'Every Gaussian is checked against the cameras that saw it, and one button in the headset tints the guessed parts blue. Every world also compiles into a life-size Roblox map, and the headset and Roblox share one 240 Hz ping pong physics sim, so a friend on a laptop can play someone in VR.',
        ],
    },
    {
        id: 'luciddreams',
        title: 'Lucid Dreams',
        titleSmall: [ 'Lucid', 'Dreams' ],
        category: 'Hackathon build · Meta Quest',
        role: 'Builder',
        period: 'Oct 2026',
        tagline: 'Turns a video or a few photos of someone into a life-size 3D person standing in your room, in a Meta Quest.',
        proof: 'Built in 48 hours at Gator Hack V on 12 NVIDIA B200s',
        url: 'https://getluciddreams.vercel.app',
        attributes: { role: 'Builder', at: [ 'Gator Hack V' ], with: [ 'Vishal, Ian', '& Atina' ] },
        award: [ '48 hours', '12 B200 GPUs' ],
        images: [ 'luciddreams-cover.webp', 'luciddreams-2.webp' ],
        links: [
            { label: 'Open the website', url: 'https://getluciddreams.vercel.app' },
            { label: 'GitHub', url: 'https://github.com/OjasMishra32/lucid_dreams' },
        ],
        body: [
            'Built in 48 hours at Gator Hack V (UF AI Days 2026) with Vishal, Ian and Atina. You give it a clip or a few photos and one sentence about what you want to do with that person, and they appear life-size in Meta Quest passthrough, from one link in the Quest browser.',
            'You can learn a guitar part, a golf swing or a dance from a teacher who slows each step down and waits for your turn. Public figures are labelled on screen and never speak.',
            '4DAnyone turns one video into 48 synchronized views of the person. On UF\'s HiPerGator, 12 NVIDIA B200s fit about 290,000 Gaussians to every frame with gsplat. The headset app is WebXR, built on three.js and Spark.',
        ],
    },
    {
        id: 'hive',
        title: 'HIVE',
        titleSmall: [ 'HIVE' ],
        category: 'Hackathon winner',
        role: 'Builder',
        period: '2026',
        tagline: 'Computer vision that turns a physical workspace into task graphs and coordinates the people in it.',
        proof: '1st place at YC Transpose',
        url: null,
        attributes: { role: 'Builder', at: [ 'YC Transpose' ] },
        award: [ '1st place' ],
        images: [ 'hive-cover.webp' ],
        links: [],
        body: [
            '1st place at YC Transpose. HIVE watches a physical workspace through cameras, turns what it sees into task graphs, and coordinates the people in the room against them. Vision works out what is being done and by whom, and the task graph decides what should happen next.',
        ],
    },
    {
        id: 'evbots',
        title: 'EV Charging Robot',
        titleSmall: [ 'EV Charging', 'Robot' ],
        category: 'Autonomous hardware',
        role: 'AI Robotics Engineer Intern',
        period: 'Apr – Nov 2025',
        tagline: 'The company\'s first autonomous EV-charging robot that worked end to end.',
        proof: 'Working prototype · contributed to provisional patents',
        url: 'https://www.youtube.com/watch?v=2A_RMrd1qKo',
        attributes: { role: [ 'Robotics', 'intern' ], at: 'EV Bots' },
        award: [ 'Provisional', 'patents' ],
        images: [ 'evbots-cover.webp' ],
        links: [ { label: 'Watch the prototype', url: 'https://www.youtube.com/watch?v=2A_RMrd1qKo' } ],
        body: [
            'I built EV Bots\' first fully working autonomous EV-charging robot prototype, iterating on the mechanics, electronics and controls until the robot could find a car\'s charging port and plug in by itself. The work went into several provisional patents.',
            'I also designed the CAD for an autonomous drone charging dock meant for swarm delivery fleets.',
        ],
    },
    {
        id: 'kinetix',
        title: 'Kinetix',
        titleSmall: [ 'Kinetix' ],
        category: 'Computer vision · biomechanics',
        role: 'Builder',
        period: '2025',
        tagline: 'A physical therapy coach that watches your form through a webcam and corrects it out loud.',
        proof: 'Live joint-angle tracking from a plain webcam, voice coaching in a Meta Quest',
        url: 'https://www.youtube.com/watch?v=-k4Ks9YATTI',
        attributes: { role: 'Builder', at: 'NexHacks', with: [ 'Andrew, Eashan', '& Kevin' ] },
        images: [ 'kinetix-cover.webp' ],
        links: [
            { label: 'Watch the demo', url: 'https://www.youtube.com/watch?v=-k4Ks9YATTI' },
            { label: 'Devpost write-up', url: 'https://devpost.com/software/flowers-and-joy' },
        ],
        body: [
            'Built at NexHacks with Andrew Yuan, Eashan Iyer and Kevin Harned. MediaPipe reads your pose from a plain webcam and computes live joint angles at the elbow, shoulder and hip, checked against per-exercise thresholds stored in Supabase. It counts reps and holds and speaks corrections while you\'re mid-exercise.',
            'Most of the work went into the tolerance logic: how far off counts as bad form, and when to speak up.',
        ],
    },
    {
        id: 'fuse',
        title: 'FUSE',
        titleSmall: [ 'FUSE' ],
        category: 'Hackathon build · iOS',
        role: 'Builder',
        period: 'Sep 2026',
        tagline: 'Put one thing on each half of a foldable iPhone, fold it, and get one useful result back.',
        proof: 'Native Swift app with 12 result types',
        url: 'https://devpost.com/software/fuse-47s1jg',
        attributes: { role: 'Builder', at: [ 'Bitrig Hacks', 'at Y Combinator' ] },
        images: [ 'fuse-cover.webp' ],
        links: [
            { label: 'Devpost', url: 'https://devpost.com/software/fuse-47s1jg' },
            { label: 'Watch the demo', url: 'https://www.youtube.com/watch?v=h8jK9cSw0xU' },
            { label: 'GitHub', url: 'https://github.com/OjasMishra32/fuse' },
        ],
        body: [
            'Built at Bitrig Hacks iPhone Duo Edition at Y Combinator with Abhinav Nigam, Abhinav Shivalli, Harpreet Vishnoi and Vasu Ganesa. You put something on each screen of the foldable iPhone Duo (a résumé and a job post, say, or an email and your calendar) and fold the phone.',
            'FUSE sends both inputs and any spoken instruction to OpenAI, which picks what kind of result fits, and the app renders it natively: an itinerary on a map, a calendar event, an email draft, a quiz, slides, a generated image and more.',
        ],
    },
    {
        id: 'eyesight',
        title: 'Eyesight',
        titleSmall: [ 'Eyesight' ],
        category: 'iOS accessibility',
        role: 'Founder',
        period: '2025 – now',
        tagline: 'Obstacle detection and real-time narration for blind and low-vision users.',
        proof: 'LiDAR and on-device CoreML · TestFlight beta',
        url: 'https://testflight.apple.com/join/tyjpWY2B',
        attributes: { role: 'Founder', at: [ 'Swift Student', 'Challenge' ] },
        images: [ 'eyesight-cover.webp' ],
        links: [ { label: 'TestFlight', url: 'https://testflight.apple.com/join/tyjpWY2B' } ],
        body: [
            'Eyesight uses the iPhone\'s LiDAR sensor and on-device CoreML to detect obstacles and describe the surroundings out loud in real time, for people who are blind or have low vision. Built for the Apple Swift Student Challenge.',
            'Everything runs on the phone, so it works with no signal and nothing about where you are or what you\'re looking at leaves the device. The TestFlight beta isn\'t taking new testers right now.',
        ],
    },
    {
        id: 'preventaai',
        title: 'PreventaAI',
        titleSmall: [ 'PreventaAI' ],
        category: 'iOS health app',
        role: 'Founder',
        period: '2023 – now',
        tagline: 'A health app for medication tracking, logging symptoms on a body map, and asking an AI assistant.',
        proof: 'Live on the App Store · rated 5.0',
        url: 'https://apps.apple.com/us/app/preventaai/id6757689865',
        attributes: { role: 'Founder', at: 'App Store' },
        award: [ 'Rated 5.0' ],
        images: [ 'preventaai-cover.webp' ],
        links: [ { label: 'View on the App Store', url: 'https://apps.apple.com/us/app/preventaai/id6757689865' } ],
        body: [
            'A health app on the App Store, rated 5.0. Built with SwiftUI and Firebase: medication tracking with streaks and schedules, an AI health assistant, a body map for logging where something hurts and how badly, a visual scanner and short lessons.',
            'One user reported that it helped them catch severe tuberculosis earlier than standard screening did.',
        ],
    },
    {
        id: 'quickcitepro',
        title: 'QuickCitePro',
        titleSmall: [ 'QuickCite', 'Pro' ],
        category: 'Research tooling',
        role: 'Founder',
        period: '2025 – now',
        tagline: 'Triple-click a citation, land on the PDF.',
        proof: 'Chrome Web Store · rated 5.0 · used by professors',
        url: 'https://chromewebstore.google.com/detail/quickcitepro/fpngnpgmmpimnlaejklabjelhhoeibpd',
        urlLabel: 'chromewebstore.google.com',
        attributes: { role: 'Founder', at: [ 'Chrome', 'Web Store' ] },
        award: [ 'Rated 5.0' ],
        images: [ 'quickcitepro-cover.webp' ],
        links: [ { label: 'Install from the Web Store', url: 'https://chromewebstore.google.com/detail/quickcitepro/fpngnpgmmpimnlaejklabjelhhoeibpd' } ],
        body: [
            'A Chrome extension I built during the CMU research work. Following a citation in a dense paper meant copying the title, opening a tab, fixing a broken DOI and trying links one by one. With QuickCitePro you triple-click the citation and land on the paper.',
        ],
    },
    {
        id: 'glassbox',
        title: 'GlassBoxAI',
        titleSmall: [ 'GlassBox', 'AI' ],
        category: 'Interview integrity',
        role: 'Co-founder & CEO',
        period: '2024',
        tagline: 'An overlay for Zoom and Google Meet that flags AI-assisted answers in live interviews.',
        proof: '2nd of 200+ at Startup in a Weekend Philly, the only high school team',
        url: null,
        attributes: { role: [ 'Co-founder', '& CEO' ], at: [ 'Startup Weekend', 'Philly' ] },
        award: [ '2nd of 200+' ],
        images: [ 'glassbox-cover.webp' ],
        links: [],
        body: [
            'Built with three friends over a 48-hour startup weekend in Philadelphia, as the only high school team among 200+ competitors from Penn, Drexel and MIT. It took 2nd place.',
            'GlassBoxAI sits on top of Zoom, Teams or Google Meet. Face tracking follows small shifts in gaze and blink rate, an audio analyzer listens for odd pauses and a pitch that never changes, and a small language model reads the transcript.',
        ],
    },
    {
        id: 'tsa',
        title: 'TSA Nationals',
        titleSmall: [ 'TSA', 'Nationals' ],
        category: 'Eight engineering projects',
        role: 'National competitor, team captain',
        period: '2024 – 2025',
        tagline: 'Eight engineering projects in one season, led by a 3D-printed zeolite dome that pulls nitrous oxide out of the air above fertilized soil.',
        proof: 'Captain for 6 events · national finalist in 2',
        url: 'https://drive.google.com/file/d/1g7FHlAS585jKaO4bX4d0wYBzojE87LBT/view',
        urlLabel: 'engineering design portfolio',
        attributes: { role: [ 'Captain,', '6 teams' ], at: 'TSA' },
        award: [ 'National finalist', 'in 2 events' ],
        images: [ 'tsa-cover.webp', 'tsa-2.webp', 'tsa-3.webp' ],
        links: [
            { label: 'Engineering Design portfolio (PDF)', url: 'https://drive.google.com/file/d/1g7FHlAS585jKaO4bX4d0wYBzojE87LBT/view' },
            { label: 'Drone Challenge portfolio', url: 'https://docs.google.com/document/d/1EDjvXpqCivNz9_Ob39cphXgzUCBpW2PoxV4uQBgZG2I/edit' },
        ],
        body: [
            'The Technology Student Association runs national competitions in very different fields, and I entered eight in one year, across hardware, aerospace, environmental engineering, software and games. I captained six of the teams and made the national final in two.',
            'Engineering Design was the 2025 grand challenge on managing the nitrogen cycle. We built NitroCapture Pro, a 3D-printed half dome lined with sodium chabazite zeolite in hexagonal cells that adsorbs nitrous oxide above fertilized soil. In all five trials the chamber with the dome ended at a lower gas pressure than the control.',
            'For the Drone Challenge I built and tuned a Betaflight FPV drone from a bare carbon frame, with the wiring drawn out by hand. The other six: a pick-and-place robot built on-site, a Unity escape room for the Meta Quest, a tower defense game with custom Blender models, on-site control systems in Python and C++, an agroforestry carbon-credit web app, and an original board game.',
        ],
    },
]

/**
 * Research, shown in the lab in the world and in the profile panel.
 * `image` and `imageMini` are files in static/lab/images.
 */
export const research = [
    {
        id: 'pid-gain',
        summary: 'Tunes discrete-time PID gains with the actuator\'s saturation limit built in as a constraint from the start.',
        title: 'PID Gains Under Saturation',
        fullTitle: 'Constraint-Aware Discrete-Time PID Gain Optimization for Robotic Joint Control Under Actuator Saturation',
        venue: 'IEEE Transactions on Robotics (T-RO)',
        status: 'Under review · arXiv preprint',
        year: '2026',
        authors: 'Ojasva Mishra (first author), with Prof. Min Xu and Dr. Xiaolong Wu',
        url: 'https://arxiv.org/abs/2601.18639v3',
        image: 'pid-gain-cover.webp',
        imageMini: 'pid-gain-mini.webp',
        links: [ { label: 'Read on arXiv', url: 'https://arxiv.org/abs/2601.18639v3' } ],
        body: 'Tunes discrete-time PID gains with the actuator\'s saturation limit built in as a constraint from the start.',
    },
    {
        id: 'scig',
        summary: 'A conformal safety filter with an explicit risk bound that keeps a joint inside its safe set even when its commands have been tampered with.',
        title: 'SCIG++ Safety Filter',
        fullTitle: 'SCIG++: Risk-Limiting Conformal Safety Filtering for Attack-Resilient Robotic Joint Control Under Saturation',
        venue: 'IEEE IROS',
        status: 'Under review',
        year: '2026',
        authors: 'Ojasva Mishra (first author), with Prof. Min Xu and Dr. Xiaolong Wu',
        url: 'https://docs.google.com/presentation/d/1SlviBI7ru_gd3lhIjRU0SLKIdPdTKMvxvI_7BdUW_Eg/edit?usp=sharing',
        urlLabel: 'video supplement',
        image: 'scig-cover.webp',
        imageMini: 'scig-mini.webp',
        links: [ { label: 'Watch the video supplement', url: 'https://docs.google.com/presentation/d/1SlviBI7ru_gd3lhIjRU0SLKIdPdTKMvxvI_7BdUW_Eg/edit?usp=sharing' } ],
        body: 'Wraps the controller in a conformal safety filter with an explicit risk bound, so a joint stays inside its safe set even when the commands reaching it have been tampered with. Demonstrated on a Franka Emika Panda arm.',
    },
    {
        id: 'feedback-authority',
        summary: 'Bounds how much control authority a command can carry and still pass the attack detector on torque-limited joints.',
        title: 'Bounding Feedback Authority',
        fullTitle: 'Bounding Detector-Accepted Feedback Authority in Torque-Limited Robot Control',
        venue: 'IEEE ICRA',
        status: 'ICRA 2027',
        year: '2027',
        authors: 'Ojasva Mishra (first author), with Prof. Min Xu and Dr. Xiaolong Wu',
        url: null,
        image: 'feedback-authority-cover.webp',
        imageMini: 'feedback-authority-mini.webp',
        links: [],
        body: 'Bounds how much control authority a command can carry and still be accepted by the attack detector, when the robot\'s joints are torque-limited.',
    },
    {
        id: 'courtside',
        summary: 'A ball tracker that calls a miss or an out before the bounce, and a test of what that head start is worth on Polymarket.',
        title: 'Courtside',
        fullTitle: 'Courtside: a ball tracker that calls the point before it lands, and what that head start is worth on Polymarket',
        venue: 'Gator Quant Hacks 2026, Systematic Trading track',
        status: 'Research paper · paper trading, no real money',
        year: '2026',
        authors: 'With Yoan Exposito, Rafael Penhas and Ian Hoang',
        url: 'https://drive.google.com/file/d/1ZMOhVQHA-lSsqmIboTntavcxZIRGt4Nr/view',
        urlLabel: 'read the paper',
        image: 'courtside-cover.webp',
        imageMini: 'courtside-mini.webp',
        links: [
            { label: 'Read the paper', url: 'https://drive.google.com/file/d/1ZMOhVQHA-lSsqmIboTntavcxZIRGt4Nr/view' },
            { label: 'GitHub', url: 'https://github.com/OjasMishra32/computervision_quant_strategy' },
        ],
        body: 'A camera films the court, a model finds the ball, fits its flight, and calls a miss or an out before the bounce. On held-out table tennis its early calls came a median 162 ms before the ball landed, none wrong, at 119.9 fps. Across 13,084 ATP and WTA matches, wallets trading within 3 seconds of a point earned after fees in all 11 months. Real Polymarket prices and fills, simulated camera calls, no real money.',
    },
    {
        id: 'volition',
        summary: 'A concept exoskeleton for complete paraplegia, controlled by imagined movements read from a 16-channel EEG cap.',
        title: 'Volition Exoskeleton',
        fullTitle: 'Volition: a concept exoskeleton for complete paraplegia, controlled by imagined movements read from an EEG cap',
        venue: 'Concept design and simulation',
        status: 'Design only, not built',
        year: '2026',
        authors: 'CAD, controls and simulation',
        url: 'https://volition-eight.vercel.app',
        image: 'volition-cover.webp',
        imageMini: 'volition-mini.webp',
        links: [
            { label: 'See the design', url: 'https://volition-eight.vercel.app' },
            { label: 'GitHub', url: 'https://github.com/OjasMishra32/volition' },
        ],
        body: 'A parametric CAD model in CadQuery, the electronics and control design, and a 1 kHz closed-loop simulation driven by a synthetic EEG decoder. The torque each joint can deliver is recomputed every millisecond as the smallest of five limits, and the controller stops the integrator from winding up while a limit binds. In simulation the user stands up, walks 8 steps, stops and sits down. It hasn\'t been built or tested on people, so every number is a design estimate.',
    },
    {
        id: 'neurospine',
        summary: 'Scoring vertebral bone quality from CT and MRI, for the cases where DEXA cutoffs leave spine surgeons a gray area.',
        title: 'NeuroSpine Bone Quality',
        fullTitle: 'Vertebral bone quality scoring from CT and MRI',
        venue: 'Dream Team Engineering, with the UF Department of Neurosurgery',
        status: 'In progress',
        year: '2026',
        authors: 'Researcher, NeuroSpine team',
        url: null,
        image: 'neurospine-cover.webp',
        imageMini: 'neurospine-mini.webp',
        links: [],
        body: 'Helping spine surgeons judge vertebral bone quality before surgery, where DEXA cutoffs leave a gray area. I\'m building the Python pipeline that segments vertebrae in CT and MRI (nnU-Net, TotalSegmentator, MONAI, SimpleITK) and computes Hounsfield-unit and VBQ scores.',
    },
    {
        id: 'textbook',
        summary: 'A 120-page introduction to robotics and programming that starts from first principles. Free and open access.',
        title: 'Robotics Textbook',
        fullTitle: 'Introduction to Robotics and Programming',
        venue: 'SSRN',
        status: 'Published · open access',
        year: '2025',
        authors: 'Ojasva Mishra',
        url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5408322',
        urlLabel: 'papers.ssrn.com',
        image: 'textbook-cover.webp',
        imageMini: 'textbook-mini.webp',
        links: [ { label: 'Read it on SSRN', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5408322' } ],
        body: 'A 120-page introduction to robotics and programming that starts from first principles, written for students who can\'t get the material any other way. Free and open access.',
    },
]

/**
 * Experience, newest first. Shown in full in the profile panel.
 */
export const experience = [
    {
        title: 'Co-Founder & CEO',
        company: 'Twinly',
        metrics: [ [ '1,000+', 'active users' ], [ 'Z Fellows', 'Sept 2026 cohort' ], [ '3', 'platforms shipped' ] ],
        url: 'https://twinly.tech',
        blurb: 'Desktop AI agent · Z Fellows, Sept 2026 cohort',
        period: 'Dec 2025 – present',
        points: [
            'Twinly learns how you write, talk and use your computer, then does the work: email, calendar, files, the browser, and phone calls in your own voice.',
            'Built the Identity Runtime. It drives apps through macOS accessibility APIs, the browser DOM and app state, and only clicks on pixels when there\'s nothing structured to use.',
            'macOS, Windows and iOS apps with 1,000+ active users, some of them paying.',
        ],
    },
    {
        title: 'Research Intern',
        company: 'Carnegie Mellon University, Robotics Institute',
        metrics: [ [ '3', 'first-author papers' ], [ 'T-RO · IROS · ICRA', 'venues' ] ],
        url: 'https://www.ri.cmu.edu/',
        blurb: 'Advised by Prof. Min Xu and Dr. Xiaolong Wu',
        period: 'Jul 2025 – present',
        points: [
            'First author on three papers about controlling robot joints when the motor can\'t produce the torque the controller asks for (IEEE T-RO, IROS and ICRA).',
            'Also built multimodal SLAM and path-planning experiments with a PID controller underneath.',
        ],
    },
    {
        title: 'Quantitative Research Analyst',
        company: 'AlgoGators Investment Fund',
        metrics: [ [ '64%', 'win rate on a live crack-spread trade' ], [ '1 of 2', 'first-years on the quant team' ], [ '$500K', 'fund under management' ] ],
        blurb: 'Student-run fund · about $500K AUM',
        period: 'Sep 2026 – present',
        points: [
            'One of two first-years picked for the quant research team. Build signals and backtest strategies.',
            'Traded a crack spread at a 64% win rate across live trades, adjusting as hurricane forecasts moved during an active storm.',
        ],
    },
    {
        title: 'Researcher, NeuroSpine Team',
        company: 'Dream Team Engineering',
        metrics: [ [ 'CT + MRI', 'vertebra segmentation' ], [ 'VBQ', 'bone quality scoring' ] ],
        blurb: 'UF research team · with the UF Department of Neurosurgery',
        period: 'Sep 2026 – present',
        points: [
            'Building the Python pipeline that segments vertebrae in CT and MRI and computes Hounsfield-unit and VBQ scores, to help spine surgeons judge bone quality before surgery.',
        ],
    },
    {
        title: 'AI/Software Engineer, Founding Team',
        company: 'Drift',
        metrics: [ [ '#5', 'Product of the Day' ], [ '1,000+', 'robotics engineers using it' ], [ '129', 'robots cataloged' ] ],
        url: 'https://godrift.ai',
        blurb: 'Claude Code for robots · backed by Antler',
        period: 'Nov 2025 – Aug 2026',
        points: [
            'Built the Gaussian splat pipeline that turns photos of real spaces into walkable 3D worlds robots can be simulated in.',
            'Built a self-healing loop: an error-triage service groups the failures users report, then a repair agent patches the code and reruns CI.',
            'Built core infrastructure for the agent, which 1,000+ people use to build and debug robot simulations in ROS2, Gazebo, MuJoCo and Isaac Sim. #5 Product of the Day at launch.',
            'Built the /robots catalog of 129 license-checked robots, the CLI test harness, regression CI, and parts of Drift Desktop (Tauri, React).',
        ],
    },
    {
        title: 'Chief Technology Officer',
        company: 'Youth Publications & Socioeconomic Forum',
        metrics: [ [ '15+', 'countries' ], [ '500+', 'members' ], [ 'UN', 'presented at HLPF and UNGA' ] ],
        url: 'https://www.ypsforum.org/',
        blurb: 'Youth NGO affiliated with UN MGCY',
        period: 'Mar 2025 – Apr 2026',
        points: [
            'Led AI literacy programs in 15+ countries for a 500+ member organization, from the curriculum to the platform.',
            'Presented the work at UN events including HLPF and UNGA.',
        ],
    },
    {
        title: 'Software Engineering Intern',
        company: 'PteroLabs',
        metrics: [ [ 'UE5', 'drone simulator' ], [ 'UPenn', 'uses it for research' ] ],
        url: 'https://pterolabs.ai',
        blurb: 'UAV simulation and autonomy',
        period: 'May 2025 – Jan 2026',
        points: [
            'Built a drone simulator in Unreal Engine 5 that runs PX4, ArduPilot and Betaflight in the loop, with 6-DOF flight dynamics, an FPV view, ML mission planning and object detection.',
            'Benchmarked its performance. The University of Pennsylvania now uses it for research.',
        ],
    },
    {
        title: 'AI Robotics Engineer Intern',
        company: 'EV Bots, Inc.',
        metrics: [ [ '1st', 'working prototype at the company' ], [ 'Patents', 'provisional, several' ] ],
        blurb: 'Robots that charge electric vehicle fleets',
        period: 'Apr 2025 – Nov 2025',
        points: [
            'Built the company\'s first autonomous EV-charging robot that worked end to end: mechanical design, electronics, perception and control, through to plugging into the car.',
            'Designed the CAD for a drone charging dock meant for swarm delivery fleets. The work went into several provisional patents.',
        ],
    },
    {
        title: 'Software Development Intern',
        company: 'iPipeline',
        metrics: [ [ 'Company-wide', 'adoption of the tooling' ] ],
        url: 'https://ipipeline.com',
        blurb: 'Insurance software',
        period: 'Jun 2025 – Aug 2025',
        points: [
            'Wrote automated test frameworks and AI agents for validation and regression testing.',
            'Built developer tooling that engineering teams across the company adopted.',
        ],
    },
    {
        title: 'Founder & Club President',
        company: 'American Rocketry Challenge',
        metrics: [ [ '60+', 'members' ] ],
        blurb: 'High school rocketry club',
        period: 'Jul 2023 – Jun 2026',
        points: [
            'Started the club and grew it past 60 members.',
            'Led payload CAD, propulsion analysis in MATLAB, systems integration and launches.',
        ],
    },
    {
        title: 'National Competitor',
        company: 'Technology Student Association',
        metrics: [ [ '8', 'national events' ], [ '2', 'national finals' ] ],
        blurb: 'National finalist in 2 events',
        period: 'May 2024 – Jun 2025',
        points: [
            'Competed in 8 events at nationals and captained 6 of the teams.',
        ],
    },
    {
        title: 'Team Captain, Lead Programmer & Driver',
        company: 'VEX Robotics',
        metrics: [ [ '3×', 'World Championship' ], [ '7', 'seasons' ] ],
        blurb: '3x World Championship competitor',
        period: '2019 – Feb 2025',
        points: [
            'Seven seasons on the team. Wrote the autonomous routines in C++ and Python, tuned the PID loops, and did the CAD.',
        ],
    },
    {
        title: 'Center Assistant',
        company: 'Kumon North America, Inc.',
        blurb: 'Tutoring center',
        period: 'May 2022 – Dec 2022',
        points: [
            'Tutored students aged 4 to 16 in math and English.',
        ],
    },
]

/**
 * The career timeline you drive along in the world.
 *
 * `from` and `to` are decimal years (2025.5 is July 2025); `to: null` means it
 * is still going. `lane` picks which of the five ground tracks the line sits
 * on. `label` is carved on the stone that rises next to the car: the first
 * line is the title and the rest are details. `name` and `detail` say the same
 * in ordinary type, for the card phones show in place of the stones' small text.
 */
export const timeline = {
    start: 2019,
    end: 2027,
    lines: [
        { lane: 0, from: 2019, to: 2025.12, color: 'blue', label: [ 'VEX ROBOTICS', 'TEAM CAPTAIN', '3X WORLDS' ], name: 'VEX Robotics', detail: "Team captain · 3× Worlds" },
        { lane: 1, from: 2023.5, to: 2026.45, color: 'orange', label: [ 'ROCKETRY CLUB', 'FOUNDER', '60+ MEMBERS' ], name: 'Rocketry Club', detail: "Founder · 60+ members" },
        { lane: 2, from: 2024.35, to: 2025.45, color: 'purple', label: [ 'TSA NATIONALS', '8 EVENTS', 'CAPTAIN OF 6' ], name: 'TSA Nationals', detail: "8 events · captain of 6" },
        { lane: 3, from: 2025.25, to: 2025.85, color: 'orange', label: [ 'EV BOTS', 'ROBOTICS INTERN', 'CHARGING ROBOT' ], name: 'EV Bots', detail: "Robotics intern · charging robot" },
        { lane: 4, from: 2025.35, to: 2026.05, color: 'blue', label: [ 'PTEROLABS', 'UE5 DRONE SIM', 'USED AT UPENN' ], name: 'PteroLabs', detail: "UE5 drone sim · used at UPenn" },
        { lane: 2, from: 2025.5, to: null, color: 'purple', label: [ 'CMU ROBOTICS', 'RESEARCH INTERN', '3 PAPERS' ], name: 'CMU Robotics Institute', detail: "Research intern · 3 papers" },
        { lane: 0, from: 2025.85, to: 2026.65, color: 'orange', label: [ 'DRIFT', 'FOUNDING ENG', '1,000+ USERS' ], name: 'Drift', detail: "Founding engineer · 1,000+ users" },
        { lane: 3, from: 2025.95, to: null, color: 'blue', label: [ 'TWINLY', 'CO-FOUNDER & CEO', 'Z FELLOWS \'26' ], name: 'Twinly', detail: "Co-founder & CEO · Z Fellows '26" },
        { lane: 1, from: 2026.65, to: null, color: 'purple', label: [ 'UNIV. OF FLORIDA', 'B.S. CE + M.S. FIN', 'FULL MERIT' ], name: 'University of Florida', detail: "B.S. CE + M.S. Finance · full merit" },
        { lane: 4, from: 2026.7, to: null, color: 'orange', label: [ 'ALGOGATORS', 'QUANT RESEARCH', '$500K FUND' ], name: 'AlgoGators', detail: "Quant research · $500K fund" },
    ],
}

/**
 * Demo videos, listed in the screening room.
 */
export const videos = [
    { title: 'EV charging robot prototype', url: 'https://www.youtube.com/watch?v=2A_RMrd1qKo' },
    { title: 'Kinetix demo', url: 'https://www.youtube.com/watch?v=-k4Ks9YATTI' },
    { title: 'FUSE demo', url: 'https://www.youtube.com/watch?v=h8jK9cSw0xU' },
    { title: 'Courtside, 90 seconds', url: 'https://github.com/OjasMishra32/computervision_quant_strategy/blob/main/results/viz/courtside_60.mp4' },
    { title: 'SCIG++ video supplement', url: 'https://docs.google.com/presentation/d/1SlviBI7ru_gd3lhIjRU0SLKIdPdTKMvxvI_7BdUW_Eg/edit?usp=sharing' },
]

/**
 * Logo chips for the About page. Files are in static/profile/emblems.
 * Keyed by project id or company name. `bg` is the chip's colour behind the
 * mark; entries with `text` instead of `file` are set as a monogram.
 */
export const emblems = {
    // Projects
    twinly: { file: 'twinly.png', bg: '#000000' },
    applytwin: { file: 'applytwin.png', bg: '#ffffff' },
    drift: { file: 'drift.png', bg: '#000000' },
    dejaview: { file: 'dejaview.png', bg: '#007aff' },
    luciddreams: { file: 'luciddreams.svg', bg: '#000000' },
    hive: { text: 'HIVE', bg: '#1a1206' },
    evbots: { file: 'evbots.png', bg: '#ffffff' },
    kinetix: { file: 'kinetix.png', bg: '#0b1017' },
    fuse: { text: 'FUSE', bg: '#101010' },
    eyesight: { file: 'eyesight.png', bg: '#000000' },
    preventaai: { file: 'preventaai.png', bg: '#0b0b1a' },
    quickcitepro: { file: 'quickcitepro.png', bg: '#1b2a4a' },
    glassbox: { text: 'GB', bg: '#0d1117' },
    tsa: { file: 'tsa.png', bg: '#ffffff' },

    // Organisations
    'Twinly': { file: 'twinly.png', bg: '#000000' },
    'Drift': { file: 'drift.png', bg: '#000000' },
    'Carnegie Mellon University, Robotics Institute': { file: 'cmu.png', bg: '#ffffff' },
    'AlgoGators Investment Fund': { file: 'algogators.png', bg: '#ffffff' },
    'Dream Team Engineering': { file: 'dte.png', bg: '#1b2a4a' },
    'University of Florida': { file: 'uf.png', bg: '#ffffff' },
    'Youth Publications & Socioeconomic Forum': { file: 'ypsf.png', bg: '#14263c' },
    'EV Bots, Inc.': { file: 'evbots.png', bg: '#ffffff' },
    'PteroLabs': { file: 'pterolabs.png', bg: '#0b1f3a' },
    'iPipeline': { file: 'ipipeline.png', bg: '#ffffff' },
    'American Rocketry Challenge': { file: 'rocketry.png', bg: '#ffffff' },
    'Technology Student Association': { file: 'tsa.png', bg: '#ffffff' },
    'VEX Robotics': { file: 'vex.png', bg: '#ffffff' },
    'Kumon North America, Inc.': { file: 'kumon.png', bg: '#ffffff' },
}
