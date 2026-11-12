/**
 * How each project works, in three pictures.
 *
 * This is what goes on a project's board in the world
 * (scripts/build-covers.mjs draws it). Someone who has never heard of the
 * project should understand it from the three panels and their captions:
 * what goes in, what the project does to it, what comes out.
 *
 * A panel is either a real picture (`img`, relative to the repository root)
 * or a small drawn stand-in (`draw`) where no picture exists. Every caption
 * comes from the project's own README, paper or write-up.
 */
const ART = 'scripts/shots/art'
const SRC = 'scripts/shots/art/src'

export const explainers = {
    dejaview: {
        accent: '#0a84ff',
        line: 'Turns a video of any place into a 3D world you can walk into.',
        proof: '1st place in the AI/ML and DeepSpace tracks at SwampHacks XII',
        panels: [
            { img: `${SRC}/dejaview-photo1.jpg`, caption: 'Film a place', sub: 'A phone video, one photo or a game screenshot' },
            { img: `${SRC}/dejaview-splats-discs.jpg`, caption: 'It becomes a million 3D splats', sub: 'A world model fills in what the camera never saw' },
            { img: `${SRC}/dejaview-headset.jpg`, caption: 'Walk around inside it', sub: 'In a Meta Quest, a browser or a Roblox map' },
        ],
    },

    applytwin: {
        accent: '#1f6bff',
        line: 'Finds the internship, tailors your résumé, fills out the form.',
        proof: 'Reads 600+ company career sites · runs on your Claude Code or Codex plan',
        panels: [
            { draw: 'feed', caption: 'It finds the roles that fit you', sub: 'Greenhouse, Lever, Ashby, Workday and more' },
            { draw: 'sheets', images: [ `${SRC}/applytwin-data.png`, `${SRC}/applytwin-ml.png`, `${SRC}/applytwin-swe.png` ], caption: 'Writes a one-page résumé for each', sub: 'Only from what you wrote, checked line by line' },
            { draw: 'form', caption: 'Fills out the application', sub: 'Uploads the PDF and stops at Submit' },
        ],
    },

    luciddreams: {
        accent: '#7c5cff',
        line: 'Lifts a person out of an ordinary video and rebuilds them as a life-size 3D human.',
        proof: 'Built in 48 hours at Gator Hack V on 12 NVIDIA B200 GPUs',
        panels: [
            { img: `${SRC}/lucid-input.jpg`, position: 'center 22%', caption: 'Start with a phone video of someone', sub: 'One clip. No studio, no markers.' },
            { img: `${SRC}/lucid-cameras.jpg`, position: '50% 66%', zoom: 1.5, caption: 'They are lifted out and rebuilt in 3D', sub: '48 views generated around them, then fitted with Gaussians frame by frame' },
            { img: `${SRC}/lucid-talk.jpg`, position: '38% center', caption: 'A life-size 3D copy stands in your room', sub: 'Seen through a Meta Quest. Walk around them.' },
        ],
    },

    twinly: {
        accent: '#7fa800',
        line: 'An AI agent that does the work on your computer and phone for you, the way you would.',
        proof: 'Z Fellows, September 2026 cohort · 1,000+ active users on macOS, Windows and iOS',
        arrows: false,
        panels: [
            { img: `${SRC}/twinly-chat.jpg`, fit: 'contain', background: '#12110c', caption: 'It answers your messages', sub: 'In your tone, knowing your plans. Here it settles a group trip.' },
            { img: `${SRC}/twinly-call.jpg`, fit: 'contain', background: '#12110c', span: 1.35, caption: 'It makes phone calls in your voice', sub: 'A clone of your voice books the table and reports back' },
            { img: `${SRC}/twinly-overnight.jpg`, fit: 'contain', background: '#12110c', caption: 'It works while you are away', sub: 'Email, calendar, files and the browser, overnight' },
        ],
    },

    drift: {
        accent: '#ff4d6d',
        line: 'Rebuilds the real place a robot will work in as a simulation, so the robot can be tested before it ships.',
        proof: '#5 Product of the Day on Product Hunt · 1,000+ robotics engineers · backed by Antler',
        panels: [
            { img: `${SRC}/drift-world.jpg`, span: 1.5, position: '70% center', caption: 'A real building, rebuilt as a 3D world', sub: 'Reconstructed from captures of the site. I built the pipeline that turns photos into these worlds.' },
            { img: `${SRC}/drift-asset.jpg`, caption: 'Objects that behave like the real ones', sub: 'Boxes, cloth and cables, with measured physics' },
            { draw: 'stat', value: '129', label: 'robots in the catalog I built', caption: 'Then the robot is tested in it', sub: 'In Isaac Sim, MuJoCo or Gazebo, before deployment' },
        ],
    },

    hive: {
        accent: '#e08a00',
        line: 'Coordinates a group of people building something, one spoken instruction at a time.',
        proof: '1st place at YC Transpose',
        panels: [
            { draw: 'say', who: 'For example', text: 'Build a red, blue and green tower.', caption: 'Give it one goal', sub: 'One sentence is the whole brief' },
            { draw: 'window', img: `${ART}/hive-host.png`, position: '62% 30%', zoom: 1.5, caption: 'It works out who does what, and when', sub: 'A task graph, scheduled by reach, workload and collision risk' },
            { draw: 'phone', img: `${ART}/hive-worker.png`, caption: 'Each phone gets only its next step', sub: 'A camera checks the work and replans when it goes wrong' },
        ],
    },

    evbots: {
        accent: '#1f9d55',
        line: 'A robot arm that finds an electric car\'s charging port and plugs in by itself.',
        proof: 'Work that went into several provisional patents',
        panels: [
            { img: 'scripts/shots/raw/yt_2A_RMrd1qKo.jpg', span: 2, caption: 'The arm finds the port and plugs itself in', sub: 'Built for charging fleets of electric vehicles with nobody standing by' },
            { draw: 'stat', value: '1st', label: 'autonomous prototype at the company to work end to end', caption: 'From nothing to a working robot', sub: 'I built it as an AI robotics engineering intern' },
        ],
    },

    kinetix: {
        accent: '#0fb5a0',
        line: 'A physical therapy coach that watches you exercise through a webcam and corrects your form out loud.',
        proof: 'I was 1 of 3 high schoolers accepted to the hackathon, out of 1,500+ applicants',
        panels: [
            { img: 'scripts/shots/raw/yt_-k4Ks9YATTI.jpg', position: '55% center', caption: 'A webcam watches you exercise', sub: 'It reads your pose and measures your joint angles' },
            { draw: 'say', who: 'For example, it says', spoken: true, text: 'Get into starting position: arms straight, body aligned.', caption: 'It tells you what to fix, out loud', sub: 'While you are still mid-rep' },
            { draw: 'apps', items: [ 'Reps counted', 'Holds timed', 'Form checked each rep' ], caption: 'And keeps count for you', sub: 'Feedback also shows in a Meta Quest headset' },
        ],
    },

    fuse: {
        accent: '#ff9f0a',
        line: 'Put any two things on the two halves of a foldable iPhone, fold it shut, and get one result made from both.',
        proof: 'Native Swift app with 12 kinds of result',
        panels: [
            { img: `${SRC}/fuse-two.jpg`, fit: 'contain', background: '#ffffff', span: 1.4, caption: 'Put anything on each half', sub: 'A web page, a map, a note, a photo, a file, your calendar' },
            { img: `${SRC}/fuse-fold.jpg`, fit: 'contain', background: '#ffffff', span: 0.8, caption: 'Fold the phone shut', sub: 'The fold is the command. It works out how the two relate.' },
            { draw: 'apps', items: [ 'A day plan with a map', 'A calendar event', 'A graded test', 'A draft email', 'A side-by-side comparison' ], caption: 'Get one result made from both', sub: 'It picks the kind of result that fits the pair' },
        ],
    },

    eyesight: {
        accent: '#0a6cff',
        line: 'Tells blind and low-vision people what is in front of them, out loud, as they walk.',
        proof: 'LiDAR and on-device CoreML · TestFlight beta',
        panels: [
            { draw: 'icon', img: 'static/projects/images/eyesight-1.webp', caption: 'Point an iPhone ahead', sub: 'Its LiDAR measures the distance to what is in view' },
            { draw: 'say', who: 'For example, it says', spoken: true, text: 'Stop. Stairs down.', caption: 'It warns you, out loud', sub: 'Stairs, drop-offs and obstacles as you move' },
            { draw: 'stat', value: '0 bytes', label: 'about where you are leave the phone', caption: 'Everything runs on the phone', sub: 'It works with no signal' },
        ],
    },

    preventaai: {
        accent: '#7b3ff2',
        line: 'A health app for tracking medication, marking symptoms on a body map and asking an AI assistant.',
        proof: 'One user reported it helped them catch severe tuberculosis earlier than standard screening did',
        panels: [
            { img: 'scripts/shots/raw/preventaai.png', span: 2, position: '78% 86%', zoom: 1.55, caption: 'Schedules, a body map for symptoms, and an assistant', sub: 'Mark where it hurts and how badly, then ask about it' },
            { draw: 'stat', value: '5.0', label: 'rating on the App Store', caption: 'Live on the App Store', sub: 'Free, with in-app purchases' },
        ],
    },

    quickcitepro: {
        accent: '#f08c00',
        line: 'Select a citation in any paper and the paper it points to opens, with a summary beside it.',
        proof: 'Rated 5.0 on the Chrome Web Store · used by professors and lab teammates',
        panels: [
            { img: `${SRC}/qcp-select.jpg`, position: 'left center', caption: 'Select a reference', sub: 'Triple-click it on a web page, or right-click it in a PDF' },
            { img: `${SRC}/qcp-open.jpg`, span: 1.5, position: 'left top', caption: 'The cited paper opens, already summarised', sub: 'What is new, the method and the key findings' },
            { draw: 'stat', value: '3 clicks', label: 'from a reference to the paper', caption: 'Built because I needed it', sub: 'During the CMU research work' },
        ],
    },

    glassbox: {
        accent: '#0fb58a',
        line: 'Flags AI-assisted answers during a live video interview.',
        proof: '2nd of 200+ at Startup in a Weekend Philly, built in 48 hours, the only high school team',
        panels: [
            { draw: 'window', img: `${ART}/veritas-1.png`, position: 'center top', caption: 'It sits on top of the video call', sub: 'Zoom, Teams or Google Meet' },
            { draw: 'apps', items: [ 'Gaze shifts and blink rate', 'Odd pauses, flat pitch', 'Answers that read like a script' ], caption: 'It watches, listens and reads', sub: 'Face tracking, audio analysis and a small language model' },
            { img: `${SRC}/glassbox-flags.jpg`, fit: 'contain', background: '#0b1016', span: 0.72, caption: 'And flags it while the candidate talks', sub: 'AI voices and script reading, with a live integrity score' },
        ],
    },

    tsa: {
        accent: '#c8102e',
        line: 'A national engineering competition for students. I entered eight events in one season.',
        proof: 'Technology Student Association nationals · captain for 6 events · national finalist in 2',
        arrows: false,
        panels: [
            { img: `${ART}/tsa-dome-side.jpg`, caption: 'A dome that cleans the air over farm soil', sub: 'Engineering Design. Lined with zeolite that traps nitrous oxide; beat the control in 5 of 5 trials.' },
            { img: `${ART}/drone-assembled.jpg`, caption: 'A racing drone built from parts', sub: 'Drone Challenge. Wired by hand and tuned in Betaflight.' },
            { draw: 'apps', compact: true, items: [ 'A VR escape room', 'A tower defense game', 'A pick-and-place robot', 'Control code written on-site', 'A carbon-credit web app', 'A board game' ], caption: 'And six more builds', sub: 'Games, software, robotics and controls' },
        ],
    },

    'pid-gain': {
        accent: '#e8590c',
        line: 'Tunes a robot joint\'s controller for the torque its motor can actually deliver.',
        proof: 'Under review at IEEE Transactions on Robotics · arXiv 2601.18639',
        panels: [
            { draw: 'plot', caption: 'Every motor has a torque limit', sub: 'Ask for more and an ordinary controller overshoots' },
            { draw: 'sheets', images: [ `${ART}/arxiv-p8.png`, `${ART}/arxiv-p1.png` ], caption: 'So the limit goes into the tuning itself', sub: 'Stability regions, anti-windup and a search that rejects unsafe gains' },
            { draw: 'stat', value: '0.687 → 0.470', label: 'median tracking error', caption: 'Tracking error drops by a third', sub: 'With under 2% overshoot. Simulation only.' },
        ],
    },

    scig: {
        accent: '#0a84ff',
        line: 'A safety filter that keeps a robot joint in its safe range even when its commands are tampered with.',
        proof: 'Under review at IEEE IROS',
        panels: [
            { img: `${ART}/scig-franka.jpg`, caption: 'A robot arm whose signals are attacked', sub: 'Sensor readings biased, packets dropped' },
            { img: `${ART}/scig-method.png`, fit: 'contain', background: '#ffffff', caption: 'A filter checks each command first', sub: 'It wraps the controller you already have: PID, MPC or impedance' },
            { draw: 'stat', value: 'Bounded', label: 'risk, stated explicitly', caption: 'The joint stays in its safe range', sub: 'The bound comes from conformal prediction' },
        ],
    },

    'feedback-authority': {
        accent: '#7c5cff',
        line: 'Bounds how much damage a command can do if it slips past the attack detector.',
        proof: 'IEEE ICRA 2027',
        panels: [
            { draw: 'say', who: 'The threat', text: 'An attacker replaces or drops a robot\'s fast state messages.', caption: 'Some attacks get past any detector', sub: 'Especially on joints that are torque-limited' },
            { img: `${ART}/icra-fig1.png`, fit: 'contain', background: '#ffffff', caption: 'So bound what an accepted message can do', sub: 'To the torque, before the torque filter' },
            { draw: 'stat', value: '0', label: 'extra trusted sensors needed', caption: 'The command stays feasible', sub: 'The only method in the paper\'s comparison that needs none' },
        ],
    },

    courtside: {
        accent: '#12a150',
        line: 'A camera that calls a tennis or table tennis point before the ball lands, and what that head start is worth.',
        proof: 'Gator Quant Hacks 2026, Systematic Trading track · paper trading, no real money',
        panels: [
            { img: `${SRC}/courtside-call.png`, position: '60% 30%', caption: 'A camera tracks the ball in flight', sub: 'At 119.9 frames per second' },
            { img: `${SRC}/courtside-call.png`, position: '24% 72%', zoom: 1.22, caption: 'It calls the point before the bounce', sub: 'A median of 162 ms early, with none wrong' },
            { draw: 'stat', value: '$42–74', label: 'a day is what the first second is worth', caption: 'That head start has a price', sub: 'Betting markets lag each point by about a second' },
        ],
    },

    volition: {
        accent: '#5e5ce6',
        line: 'A brain-controlled exoskeleton, designed for people with complete paraplegia.',
        proof: 'Concept design and simulation · not built',
        panels: [
            { img: `${SRC}/volition-poster.jpg`, position: '42% center', caption: 'Imagine moving a foot', sub: 'A 16-channel EEG cap reads it, and a crutch button confirms' },
            { img: `${ART}/actuator_cutaway.png`, fit: 'contain', background: '#ffffff', caption: 'A custom actuator drives each joint', sub: 'A frameless motor with a 100:1 strain-wave gear' },
            { img: `${ART}/exo_iso.png`, fit: 'contain', background: '#ffffff', caption: 'Sit, stand, walk', sub: '8 steps walked in a 1 kHz closed-loop simulation' },
        ],
    },

    neurospine: {
        accent: '#2f6fed',
        line: 'Scores bone quality in the spine from CT and MRI scans, to help surgeons before they operate.',
        proof: 'Dream Team Engineering, with the UF Department of Neurosurgery · in progress',
        panels: [
            { draw: 'spine', mode: 'scan', caption: 'CT and MRI scans go in', sub: 'The standard test leaves a gray area' },
            { draw: 'spine', mode: 'segment', caption: 'Each vertebra is found and outlined', sub: 'With nnU-Net and TotalSegmentator' },
            { draw: 'spine', mode: 'score', caption: 'Each one gets a bone quality score', sub: 'Hounsfield units and VBQ, per vertebra' },
        ],
    },

    textbook: {
        accent: '#b8860b',
        line: 'A free robotics textbook, written for students who can\'t get the material any other way.',
        proof: 'Published open access on SSRN as the FusionBots robotics curriculum',
        panels: [
            { draw: 'sheets', images: [ `${ART}/textbook-p2.png`, `${ART}/textbook-p1.png` ], span: 2, caption: 'Robotics and programming from first principles', sub: 'Modules, units and lessons, from beginner to advanced' },
            { draw: 'stat', value: '120', label: 'pages, free for anyone', caption: 'Free to read', sub: 'Open access on SSRN' },
        ],
    },
}
