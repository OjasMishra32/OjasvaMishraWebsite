/**
 * What each project's presentation says and shows (see Game/Keynote.js).
 *
 * A presentation is a 12 × 6 grid of tiles. `at` is [ column, row, width,
 * height ]. Every number and step comes from the project's own write-up,
 * paper or README. `src` is the name of an image in static/cards (built from
 * scripts/shots by scripts/build-images.mjs).
 */
const H = (at, name, line, meta, options = {}) => ({ type: 'hero', at, name, line, meta, ...options })
const S = (at, value, label, options = {}) => ({ type: 'stat', at, value, label, ...options })
const I = (at, src, caption = null, options = {}) => ({ type: 'image', at, src, caption, ...options })
const ST = (at, steps, heading = 'How it works') => ({ type: 'steps', at, steps, heading })
const L = (at, heading, items, options = {}) => ({ type: 'list', at, heading, items, ...options })
const T = (at, text, options = {}) => ({ type: 'text', at, text, ...options })
// A tile drawn live, frame by frame (see Game/KeynoteLive.js)
const V = (at, id, caption) => ({ type: 'live', at, id, caption })
const small = { small: true }
const dark = { dark: true }
const contain = { contain: true }
const top = { position: 'top' }

export const projectCards = {
    twinly: [
        H([ 1, 1, 5, 2 ], 'Twinly', 'An AI agent that runs your computer the way you would.', 'Co-founder & CEO · Dec 2025 to now'),
        I([ 6, 1, 7, 3 ], 'twinly', null, top),
        S([ 1, 3, 3, 1 ], '1,000+', 'active users, some of them paying'),
        S([ 4, 3, 2, 1 ], '2,000+', 'on the launch waitlist'),
        S([ 1, 4, 3, 1 ], 'Z Fellows', 'September 2026 cohort of 10 builders'),
        T([ 4, 4, 5, 1 ], 'Email, calendar, files, the browser, and phone calls in your own voice.'),
        L([ 9, 4, 4, 3 ], 'What makes it yours', [
            [ 'Learns you:', 'how you write, talk and use your computer' ],
            [ 'Remembers:', 'persistent memory and a personal CRM' ],
            [ 'Sounds like you:', 'a voice clone that runs locally' ],
            [ 'Asks first:', 'you choose how much it checks before acting' ],
        ]),
        ST([ 1, 5, 8, 2 ], [
            [ 'Accessibility', 'What the app itself exposes on macOS' ],
            [ 'Browser DOM', 'The real structure of the page' ],
            [ 'App state', 'What is open and in focus' ],
            [ 'Vision', 'Clicks on pixels only when nothing else exists' ],
        ], 'The Identity Runtime I built tries the most reliable way into an app first'),
    ],

    applytwin: [
        H([ 1, 1, 5, 2 ], 'ApplyTwin', 'Finds the internship, tailors your résumé, fills out the form.', 'Creator · Oct 2026 to now · open source'),
        I([ 6, 1, 5, 3 ], 'applytwin', null, top),
        I([ 11, 1, 2, 3 ], 'applytwin-demo', 'A tailored résumé', contain),
        S([ 1, 3, 3, 1 ], '600+', 'company career sites read'),
        S([ 4, 3, 2, 1 ], '$0', 'runs on your Claude Code or Codex plan'),
        ST([ 1, 4, 12, 2 ], [
            [ 'Scan', 'Greenhouse, Lever, Ashby, Workday and SmartRecruiters' ],
            [ 'Score', 'Each posting against your roles, location and grad date' ],
            [ 'Tailor', 'A one-page résumé from everything you have done' ],
            [ 'Fact-check', 'Rejects any number, tool or claim you did not write' ],
            [ 'Fill', 'Opens the form, uploads the PDF, stops at Submit' ],
        ]),
        T([ 1, 6, 7, 1 ], 'Installs with one line on Mac, Windows or Linux. No API keys, no new subscription.'),
        T([ 8, 6, 5, 1 ], 'It never shows your password to the AI, solves a CAPTCHA, or applies to the same role twice.', small),
    ],

    drift: [
        H([ 1, 1, 5, 2 ], 'Drift', 'Claude Code for robots. Describe the task and it builds and runs the simulation.', 'AI/Software Engineer, founding team · Nov 2025 to Aug 2026'),
        I([ 6, 1, 4, 2 ], 'drift', null, { position: 'center' }),
        S([ 10, 1, 3, 2 ], '#5', 'Product of the Day on Product Hunt'),
        S([ 1, 3, 3, 1 ], '1,000+', 'robotics engineers using it'),
        S([ 4, 3, 2, 1 ], '129', 'robots in the catalog I built'),
        T([ 6, 3, 7, 1 ], 'Works in ROS2, Gazebo, MuJoCo and Isaac Sim. Backed by Antler.'),
        L([ 1, 4, 7, 3 ], 'What I built', [
            [ 'Gaussian splat pipeline:', 'photos of a real space become a walkable 3D world to simulate robots in' ],
            [ 'Self-healing loop:', 'a triage service groups the failures users report, a repair agent patches the code and reruns CI' ],
            [ 'Test harness:', 'drives the CLI through pexpect while a vision model checks Gazebo screenshots' ],
            [ '/robots catalog:', 'each of the 129 license-checked against MuJoCo Menagerie and partner repos' ],
        ]),
        L([ 8, 4, 5, 3 ], 'A production bug I chased down', [
            [ 'Symptom:', 'Gazebo rendering froze for users' ],
            [ 'Cause:', 'gz-transport UDP multicast failing on Ubuntu 24.04 with an RTX 5070' ],
            [ 'Result:', 'traced and fixed' ],
        ], dark),
    ],

    dejaview: [
        H([ 1, 1, 5, 2 ], 'Deja View', 'Film any place on your phone. Walk into it in VR.', 'SwampHacks XII · built in 36 hours with Shivin, Brianna and Seb'),
        I([ 6, 1, 4, 3 ], 'dejaview-browser', 'Not a photo. The room, rebuilt as a splat and rendered in a browser.'),
        V([ 10, 1, 3, 3 ], 'splat', 'Cameras solved, then about a million Gaussians trained'),
        S([ 1, 3, 3, 1 ], '1st place ×2', 'AI/ML track and DeepSpace track'),
        S([ 4, 3, 2, 1 ], '163', 'camera poses solved for one room'),
        ST([ 1, 4, 8, 2 ], [
            [ 'Capture', 'A phone video, a single photo, or game footage' ],
            [ 'Solve cameras', 'COLMAP, at about 1 px of reprojection error' ],
            [ 'Train the splat', '30k steps in 11 minutes on UF\'s HiPerGator' ],
            [ 'Walk in', 'A Meta Quest, a browser, or Roblox' ],
        ]),
        I([ 9, 4, 4, 2 ], 'dejaview-roblox', 'The same room, compiled into a life-size Roblox map'),
        S([ 1, 6, 3, 1 ], '6 s', 'from one photo to a full room'),
        S([ 4, 6, 3, 1 ], '2,304', 'probe views rendered to fill holes'),
        S([ 7, 6, 3, 1 ], '45 dB', 'PSNR every fill has to hold'),
        S([ 10, 6, 3, 1 ], '240 Hz', 'ping pong physics shared by VR and Roblox'),
    ],

    luciddreams: [
        H([ 1, 1, 5, 2 ], 'Lucid Dreams', 'One video of a person becomes a life-size 3D teacher in your room.', 'Gator Hack V · built in 48 hours with Vishal, Ian and Atina'),
        I([ 6, 1, 7, 3 ], 'lucid-guitar', 'A guitar teacher in the room through Quest passthrough. He slows each step down and waits for your turn.'),
        S([ 1, 3, 3, 1 ], '290,000', 'Gaussians fit to every frame'),
        S([ 4, 3, 2, 1 ], '12', 'NVIDIA B200s on HiPerGator'),
        ST([ 1, 4, 8, 2 ], [
            [ 'Record', 'A clip or a few photos of someone' ],
            [ 'Multiply', '4DAnyone turns one video into 48 synchronized views' ],
            [ 'Fit', 'gsplat fits the Gaussians, frame by frame' ],
            [ 'Meet them', 'Life-size in a Quest, from one link in its browser' ],
        ]),
        I([ 9, 4, 4, 2 ], 'lucid-dance', 'Views generated from one phone video', contain),
        S([ 1, 6, 3, 1 ], '3.1 s', 'from your question to a spoken answer'),
        S([ 4, 6, 3, 1 ], '48', 'views from a single video'),
        T([ 7, 6, 6, 1 ], 'One tap turns everything the camera never saw blue, so you know what was generated.'),
    ],

    hive: [
        H([ 1, 1, 5, 2 ], 'HIVE', 'Five people build one thing, and none of them is told the plan.', '1st place at YC Transpose · 2026'),
        I([ 6, 1, 5, 3 ], 'hive-host', 'The host screen mid-run: verified, executing and queued tasks', { position: 'left top' }),
        I([ 11, 1, 2, 3 ], 'hive-worker', null, top),
        S([ 1, 3, 3, 1 ], '1st place', 'YC Transpose'),
        S([ 4, 3, 2, 1 ], '3 Hz', 'orchestration loop'),
        ST([ 1, 4, 12, 2 ], [
            [ 'Objective', 'One sentence, like "build a red-blue-green tower"' ],
            [ 'Task graph', 'Compiled and validated for cycles and conflicts' ],
            [ 'Schedule', 'By reach, workload, fairness and collision risk' ],
            [ 'Instruct', 'Each phone gets only its next action, spoken aloud' ],
            [ 'Verify', 'Camera and worker reports checked against the plan' ],
            [ 'Replan', 'Reassigns or recovers when the world deviates' ],
        ]),
        T([ 1, 6, 7, 1 ], 'The LLM plans once. Deterministic code runs the loop, so it works with no API key and no camera.'),
        T([ 8, 6, 5, 1 ], 'The same architecture can coordinate warehouse workers, robots and equipment.', small),
    ],

    evbots: [
        H([ 1, 1, 5, 2 ], 'EV Charging Robot', 'It finds the car\'s charging port and plugs in by itself.', 'AI Robotics Engineer Intern at EV Bots · Apr to Nov 2025'),
        I([ 6, 1, 7, 4 ], 'yt_2A_RMrd1qKo', 'The prototype, plugged into a car with nobody guiding it'),
        S([ 1, 3, 5, 1 ], 'First', 'autonomous prototype at the company that worked end to end'),
        L([ 1, 4, 5, 3 ], 'I built the whole stack', [
            [ 'Mechanical design', '' ],
            [ 'Electronics', '' ],
            [ 'Perception:', 'finding the port' ],
            [ 'Control:', 'through to plugging in' ],
        ]),
        S([ 6, 5, 4, 2 ], 'Patents', 'the work went into several provisional patents'),
        T([ 10, 5, 3, 2 ], 'I also designed the CAD for a drone charging dock meant for swarm delivery fleets.', small),
    ],

    kinetix: [
        H([ 1, 1, 5, 2 ], 'Kinetix', 'A physical therapy coach that watches your form through a webcam and corrects it out loud.', 'NexHacks 2025 · with Andrew Yuan, Eashan Iyer and Kevin Harned'),
        I([ 6, 1, 7, 3 ], 'yt_-k4Ks9YATTI', 'Pose landmarks and joint angles, live from a plain webcam'),
        S([ 1, 3, 5, 1 ], '1 of 3', 'high schoolers accepted, out of 1,500+ applicants'),
        ST([ 1, 4, 12, 2 ], [
            [ 'See', 'MediaPipe reads your pose from the webcam' ],
            [ 'Measure', 'Joint angles at the elbow, shoulder and hip' ],
            [ 'Judge', 'Per-exercise thresholds stored in Supabase' ],
            [ 'Count', 'Reps and holds' ],
            [ 'Speak', 'Corrections mid-exercise, ElevenLabs over LiveKit' ],
            [ 'Show', 'Feedback in a Meta Quest headset' ],
        ]),
        T([ 1, 6, 12, 1 ], 'Most of the work went into the tolerance logic: how far off counts as bad form, and when to speak up.'),
    ],

    fuse: [
        H([ 1, 1, 5, 2 ], 'FUSE', 'Put one thing on each half of a foldable iPhone. Fold it. Get one useful result.', 'Bitrig Hacks at Y Combinator · Sep 2026 · team of five'),
        I([ 6, 1, 7, 3 ], 'yt_h8jK9cSw0xU', 'Both halves of the iPhone Duo, each holding one input'),
        S([ 1, 3, 3, 1 ], '12', 'native result types'),
        S([ 4, 3, 2, 1 ], 'Swift', 'a fully native app'),
        ST([ 1, 4, 8, 2 ], [
            [ 'Left + right', 'A résumé and a job post, or an email and your calendar' ],
            [ 'Fold', 'Plus any spoken instruction' ],
            [ 'Decide', 'OpenAI picks what kind of result fits' ],
            [ 'Render', 'A map itinerary, an event, a draft, a quiz, slides' ],
        ]),
        L([ 9, 4, 4, 2 ], 'Getting content in', [
            [ 'In the app:', 'browser, map, notes and photo panes' ],
            [ 'From anywhere:', 'Share Sheet, a Safari extension, Shortcuts' ],
        ]),
        T([ 1, 6, 12, 1 ], 'Results are kept in a local history. RevenueCat handles subscriptions and Supabase backs a community feed.', small),
    ],

    eyesight: [
        H([ 1, 1, 6, 2 ], 'Eyesight', 'Tells blind and low-vision users what is in front of them, out loud, in real time.', 'Founder · built for the Apple Swift Student Challenge · 2025 to now'),
        I([ 7, 1, 2, 2 ], 'eyesight', null, { contain: true, bg: '#000000' }),
        S([ 9, 1, 4, 2 ], '0', 'bytes about where you are leave the phone'),
        ST([ 1, 3, 12, 2 ], [
            [ 'Sense', 'The iPhone\'s LiDAR measures depth' ],
            [ 'Understand', 'CoreML models run on the device' ],
            [ 'Warn', 'Obstacles are detected as you move' ],
            [ 'Describe', 'The surroundings are narrated out loud' ],
        ]),
        S([ 1, 5, 4, 2 ], 'Offline', 'works with no signal'),
        T([ 5, 5, 8, 2 ], 'Everything runs on the phone, so nothing about what you are looking at is sent anywhere. The TestFlight beta isn\'t taking new testers right now.'),
    ],

    preventaai: [
        H([ 1, 1, 5, 2 ], 'PreventaAI', 'A health app for tracking medication, logging symptoms on a body map, and asking an AI assistant.', 'Founder · 2023 to now'),
        I([ 6, 1, 7, 4 ], 'preventaai', null, top),
        S([ 1, 3, 2, 2 ], '5.0', 'App Store rating'),
        S([ 3, 3, 3, 2 ], 'Live', 'on the App Store, free with in-app purchases'),
        L([ 1, 5, 5, 2 ], 'In the app', [
            [ 'Medication:', 'schedules and streaks' ],
            [ 'Body map:', 'where it hurts and how badly' ],
            [ 'Assistant:', 'AI health answers, a visual scanner, short lessons' ],
        ]),
        T([ 6, 5, 7, 2 ], 'One user reported that it helped them catch severe tuberculosis earlier than standard screening did.'),
    ],

    quickcitepro: [
        H([ 1, 1, 5, 2 ], 'QuickCitePro', 'Triple-click a citation. Land on the PDF.', 'Founder · Chrome extension · 2025 to now'),
        I([ 6, 1, 7, 4 ], 'quickcitepro', null, top),
        S([ 1, 3, 2, 2 ], '5.0', 'Chrome Web Store rating'),
        S([ 3, 3, 3, 2 ], '3 clicks', 'from a reference to the paper'),
        ST([ 1, 5, 5, 2 ], [
            [ 'Before', 'Copy the title, open a tab, fix the DOI, try links' ],
            [ 'After', 'Triple-click' ],
        ], 'Following a citation'),
        T([ 6, 5, 7, 2 ], 'Built during the CMU research work. Professors and lab teammates use it.'),
    ],

    glassbox: [
        H([ 1, 1, 5, 2 ], 'GlassBoxAI', 'Flags AI-assisted answers in a live interview.', 'Co-founder & CEO · Startup in a Weekend Philly · 2024'),
        I([ 6, 1, 7, 3 ], 'veritas-1', null, top),
        S([ 1, 3, 3, 1 ], '2nd of 200+', 'competitors, built in 48 hours'),
        S([ 4, 3, 2, 1 ], 'Only', 'high school team there'),
        ST([ 1, 4, 8, 2 ], [
            [ 'Watch', 'Face tracking follows gaze shifts and blink rate' ],
            [ 'Listen', 'Audio analysis catches odd pauses and flat pitch' ],
            [ 'Read', 'A small language model reads the transcript' ],
            [ 'Flag', 'Script reading, and tools like ChatGPT or Cluely' ],
        ]),
        T([ 9, 4, 4, 2 ], 'It sits on top of Zoom, Teams or Google Meet.'),
        T([ 1, 6, 12, 1 ], 'Built with three friends, against teams from Penn, Drexel and MIT.', small),
    ],

    tsa: [
        H([ 1, 1, 4, 2 ], 'TSA Nationals', 'Eight engineering builds in one season.', '2024 to 2025', { size: 40 }),
        S([ 5, 1, 2, 1 ], '8', 'events at nationals'),
        S([ 5, 2, 2, 1 ], '6', 'teams captained'),
        S([ 7, 1, 2, 2 ], '2', 'national finals'),
        I([ 9, 1, 4, 3 ], 'tsa-dome-front', 'NitroCapture Pro: a 3D-printed dome lined with zeolite that adsorbs nitrous oxide above fertilized soil'),
        I([ 1, 3, 3, 2 ], 'tsa-chart', 'Lower gas pressure than the control in 5 of 5 trials', contain),
        I([ 4, 3, 2, 2 ], 'tsa-dome-side'),
        I([ 6, 3, 3, 2 ], 'drone-assembled', 'A Betaflight FPV drone, built up from a bare carbon frame'),
        L([ 9, 4, 4, 3 ], 'Also that season', [
            [ 'VR Visualization:', 'a Unity escape room for Meta Quest with hand-tracked puzzles' ],
            [ 'Video Game Design:', 'tower defense with custom Blender models and pixel art' ],
            [ 'Robotics:', 'a pick-and-place robot built on-site' ],
            [ 'Systems Control:', 'Python and C++ on-site, no references' ],
        ]),
        I([ 1, 5, 2, 2 ], 'drone-parts'),
        I([ 3, 5, 3, 2 ], 'drone-betaflight', 'Flight controller set up in Betaflight'),
        I([ 6, 5, 3, 2 ], 'drone-schematic', 'Wiring, drawn by hand'),
    ],
}

export const researchCards = {
    'pid-gain': [
        H([ 1, 1, 6, 2 ], 'PID gains under saturation', 'Tuning a robot joint\'s controller for the torque its motor can actually deliver.', 'Under review at IEEE Transactions on Robotics · with Xiaolong Wu and Min Xu, CMU'),
        I([ 7, 1, 3, 4 ], 'arxiv-p1', 'arXiv:2601.18639', contain),
        I([ 10, 1, 3, 4 ], 'arxiv-p8', 'Results from the paper', contain),
        S([ 1, 3, 3, 1 ], '0.687 → 0.470', 'median tracking error (IAE) after robust tuning'),
        S([ 4, 3, 3, 1 ], 'under 2%', 'median overshoot'),
        ST([ 1, 4, 6, 2 ], [
            [ 'Derive', 'PI stability regions in discrete time, via the Jury criterion' ],
            [ 'Protect', 'Back-calculation anti-windup for saturated regimes' ],
            [ 'Search', 'Bayesian optimization that screens out unsafe gains' ],
        ], 'What the paper does'),
        S([ 1, 6, 3, 1 ], '11.6%', 'of sampled gains rejected before full evaluation'),
        T([ 4, 6, 3, 1 ], 'Simulation only, no hardware experiments.', small),
        V([ 7, 5, 6, 2 ], 'saturation', 'A live simulation: a first-order joint (τ = 1 s, Δt = 10 ms) with its torque limited to ±10'),
    ],

    'scig': [
        H([ 1, 1, 5, 2 ], 'SCIG++', 'A safety filter that keeps a robot joint in its safe range even when its commands are under attack.', 'Under review at IEEE IROS · CMU Robotics Institute'),
        I([ 6, 1, 7, 3 ], 'scig-franka', 'The Franka Emika Panda arms used in the demonstration'),
        ST([ 1, 3, 5, 2 ], [
            [ 'Attack', 'Sensor bias or dropped packets' ],
            [ 'Saturate', 'More torque asked than exists' ],
            [ 'Unsafe', 'Joint limit exceeded or motion aborted' ],
        ], 'The failure it prevents'),
        S([ 6, 4, 3, 1 ], '2 attacks', 'bias injection and packet dropout'),
        S([ 9, 4, 4, 1 ], 'Explicit', 'risk bound, from conformal prediction'),
        I([ 1, 5, 8, 2 ], 'scig-method', 'A conformal gate checks each sensor update. A saturation-aware filter shields the command.', contain),
        T([ 9, 5, 4, 2 ], 'It wraps the controller you already have: PID, MPC or impedance.'),
    ],

    'feedback-authority': [
        H([ 1, 1, 6, 2 ], 'Bounding feedback authority', 'How much can a command do if it still gets past the attack detector?', 'IEEE ICRA 2027 · CMU Robotics Institute'),
        I([ 7, 1, 6, 3 ], 'icra-fig1', 'Only the fast message channel can be corrupted. The checkpoint channel is protected.', contain),
        ST([ 1, 3, 6, 2 ], [
            [ 'Assume', 'An attacker can replace or drop fast state messages' ],
            [ 'Bound', 'What any detector-accepted message can do to the torque' ],
            [ 'Certify', 'The command stays feasible before the torque filter' ],
        ], 'The idea'),
        T([ 7, 4, 6, 1 ], 'For robot joints that are torque-limited, where the usual guarantees stop holding.'),
        S([ 1, 5, 4, 2 ], 'CAFA', 'the only method in the paper\'s comparison that needs no extra trusted sensors'),
        T([ 5, 5, 8, 2 ], 'The third paper in a series on actuator saturation: first tuning the gains, then a safety filter, then a bound on what an attacker can still do.'),
    ],

    'courtside': [
        H([ 1, 1, 5, 2 ], 'Courtside', 'A camera that calls the tennis point before the ball lands, and what that head start is worth.', 'Gator Quant Hacks 2026 · with Yoan Exposito, Rafael Penhas and Ian Hoang'),
        I([ 6, 1, 7, 3 ], 'courtside-poster', 'A miss, called before the ball lands, on real match footage'),
        S([ 1, 3, 3, 1 ], '162 ms', 'median early call, none wrong'),
        S([ 4, 3, 2, 1 ], '119.9 fps', 'tracking speed'),
        ST([ 1, 4, 7, 2 ], [
            [ 'Find', 'A model locates the ball in each frame' ],
            [ 'Fit', 'Its flight becomes a trajectory' ],
            [ 'Call', 'Out or into the net, before the bounce' ],
            [ 'Price', 'Polymarket lags each point by about a second' ],
        ]),
        V([ 8, 4, 5, 2 ], 'trajectory', 'The flight is fit while the ball is in the air, so the call comes first'),
        S([ 1, 6, 3, 1 ], '13,084', 'ATP and WTA matches studied'),
        S([ 4, 6, 3, 1 ], '11 of 11', 'months the fastest wallets earned after fees'),
        S([ 7, 6, 3, 1 ], '$42–74', 'a day: the value of the first second'),
        T([ 10, 6, 3, 1 ], 'Paper trading only. No real money.', small),
    ],

    'volition': [
        H([ 1, 1, 5, 2 ], 'Volition', 'A brain-controlled exoskeleton for people with complete paraplegia.', 'Concept design: CAD, controls and simulation. Not built or tested on people.'),
        I([ 6, 1, 4, 4 ], 'exo_iso', 'Parametric CAD, written in CadQuery', contain),
        I([ 10, 1, 3, 2 ], 'actuator_cutaway', 'One actuator for hips and knees', contain),
        S([ 10, 3, 3, 1 ], '100:1', 'strain-wave gear on a frameless motor'),
        S([ 10, 4, 3, 1 ], '1 kHz', 'closed-loop simulation'),
        ST([ 1, 3, 5, 2 ], [
            [ 'Imagine', 'A foot movement, read by a 16-channel EEG cap' ],
            [ 'Confirm', 'A crutch button, within 4 seconds' ],
            [ 'Move', 'Sit, stand, walk' ],
        ], 'How the user controls it'),
        S([ 1, 5, 3, 1 ], '8 steps', 'walked in simulation, 2.66 m'),
        S([ 4, 5, 2, 1 ], '85%', 'decoder accuracy'),
        I([ 6, 5, 4, 2 ], 'volition-antiwindup', 'Sit-to-stand on a nearly empty battery', contain),
        S([ 1, 6, 5, 1 ], '1.69° → 0.38°', 'knee overshoot once the integrator stops winding up'),
        S([ 10, 5, 3, 2 ], '5', 'torque limits recomputed every millisecond'),
    ],

    'neurospine': [
        H([ 1, 1, 7, 2 ], 'NeuroSpine', 'Scoring vertebral bone quality from scans, for the cases where the standard test leaves surgeons unsure.', 'Dream Team Engineering with the UF Department of Neurosurgery · Sep 2026 to now · in progress'),
        S([ 8, 1, 5, 2 ], 'VBQ', 'vertebral bone quality, scored per vertebra'),
        ST([ 1, 3, 12, 2 ], [
            [ 'Scans in', 'CT and MRI volumes' ],
            [ 'Segment', 'nnU-Net and TotalSegmentator find each vertebra' ],
            [ 'Measure', 'MONAI and SimpleITK, per vertebra' ],
            [ 'Score', 'Hounsfield units and VBQ' ],
        ], 'The pipeline I am building'),
        T([ 1, 5, 7, 2 ], 'DEXA cutoffs leave a gray area. The goal is to help spine surgeons judge bone quality before they operate.'),
        L([ 8, 5, 5, 2 ], 'My part', [
            [ 'The Python pipeline', 'that segments the vertebrae and computes the scores' ],
        ]),
    ],

    'textbook': [
        H([ 1, 1, 6, 2 ], 'Robotics textbook', 'An introduction to robotics and programming from first principles, free for anyone.', 'Author · open access on SSRN · 2022 to 2025'),
        I([ 7, 1, 3, 4 ], 'textbook-p1', 'The opening page', contain),
        I([ 10, 1, 3, 4 ], 'textbook-p2', null, contain),
        S([ 1, 3, 3, 2 ], '120', 'pages'),
        S([ 4, 3, 3, 2 ], 'Free', 'open access on SSRN'),
        T([ 1, 5, 6, 2 ], 'Written for students who can\'t get the material any other way.'),
        T([ 7, 5, 6, 2 ], 'Published as the FusionBots robotics curriculum and textbook.', small),
    ],
}

export const researchMinis = {
    'pid-gain': { src: 'arxiv-p8', position: 'top' },
    'scig': { src: 'scig-franka', position: 'center' },
    'feedback-authority': { src: 'icra-fig1', position: 'left center' },
    'courtside': { src: 'courtside-poster', position: 'center' },
    'volition': { src: 'hero', position: 'center' },
    'neurospine': { tag: 'VBQ' },
    'textbook': { src: 'textbook-p1', position: 'top' },
}

