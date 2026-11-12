/**
 * How each project and paper looks: its colour, and how its picture is
 * framed. Used by the covers on the boards in the world
 * (scripts/build-covers.mjs) and by the presentations (Game/Keynote.js).
 *
 * `bg` is the cover's colour and `ink` the text on it. `accent` is the same
 * idea for dark surfaces (numbers and progress in a presentation).
 * `frame` is how the picture is shown: a browser window, a photo, sheets of
 * paper, a figure on a card, an app icon, or as it is. `shot` is the picture, relative to the
 * repository root.
 */
const LIGHT = '#ffffff'
const DARK = '#0b0c10'

export const themes = {
    // Projects
    twinly: { bg: '#c9f24d', ink: DARK, accent: '#c9f24d', frame: 'photo', shot: 'scripts/shots/raw/twinly.png', emblem: 'twinly.png' },
    applytwin: { bg: '#1f6bff', ink: LIGHT, accent: '#5a9bff', frame: 'browser', shot: 'scripts/shots/raw/applytwin.png', emblem: 'applytwin.png' },
    drift: { bg: '#101014', ink: LIGHT, accent: '#ff4d6d', frame: 'photo', shot: 'scripts/shots/raw/drift.png', emblem: 'drift.png' },
    dejaview: { bg: '#e6efff', ink: DARK, accent: '#4d9dff', frame: 'browser', shot: 'scripts/shots/art/dejaview-browser.jpg', emblem: 'dejaview.png' },
    luciddreams: { bg: '#5b3df5', ink: LIGHT, accent: '#9d8bff', frame: 'photo', shot: 'scripts/shots/art/lucid-guitar.jpg', emblem: 'luciddreams.svg' },
    hive: { bg: '#ffb020', ink: DARK, accent: '#ffb020', frame: 'browser', shot: 'scripts/shots/art/hive-host.png' },
    evbots: { bg: '#efece4', ink: DARK, accent: '#3ddc84', frame: 'photo', shot: 'static/projects/images/evbots-1.webp', emblem: 'evbots.png' },
    kinetix: { bg: '#0d2b2e', ink: LIGHT, accent: '#3fe0c5', frame: 'photo', shot: 'static/projects/images/kinetix-1.webp', emblem: 'kinetix.png' },
    fuse: { bg: '#000000', ink: LIGHT, accent: '#ff9f0a', frame: 'bare', shot: 'static/projects/images/fuse-1.webp' },
    eyesight: { bg: '#0a6cff', ink: LIGHT, accent: '#4d9dff', frame: 'icon', shot: 'static/projects/images/eyesight-1.webp' },
    preventaai: { bg: '#7b3ff2', ink: LIGHT, accent: '#b38bff', frame: 'browser', bar: 'light', shot: 'scripts/shots/raw/preventaai.png', emblem: 'preventaai.png' },
    quickcitepro: { bg: '#14213d', ink: LIGHT, accent: '#fca311', frame: 'photo', bar: 'light', shot: 'scripts/shots/raw/quickcitepro.png', emblem: 'quickcitepro.png' },
    glassbox: { bg: '#0d1117', ink: LIGHT, accent: '#2ee6a8', frame: 'browser', shot: 'static/projects/images/glassbox-1.webp' },
    tsa: { bg: '#f4efe6', ink: DARK, accent: '#ff5a5f', frame: 'photo', shot: 'scripts/shots/art/tsa-dome-front.jpg', emblem: 'tsa.png' },

    // Research
    'pid-gain': { bg: '#f3f1ea', ink: DARK, accent: '#ff6b57', frame: 'paper', shot: 'scripts/shots/art/arxiv-p1.png', shot2: 'scripts/shots/art/arxiv-p8.png', emblem: 'cmu.png' },
    scig: { bg: '#0f1418', ink: LIGHT, accent: '#5fd4ff', frame: 'photo', shot: 'scripts/shots/art/scig-franka.jpg', emblem: 'cmu.png' },
    'feedback-authority': { bg: '#a47bff', ink: DARK, accent: '#b89bff', frame: 'figure', shot: 'scripts/shots/art/icra-fig1.png', emblem: 'cmu.png' },
    courtside: { bg: '#0b3d2e', ink: LIGHT, accent: '#4ade80', frame: 'figure', shot: 'scripts/shots/art/courtside-teaser.png', emblem: 'courtside.jpg' },
    volition: { bg: '#ffffff', ink: DARK, accent: '#e5e7eb', frame: 'bare', shot: 'scripts/shots/art/exo_iso.png', emblem: 'volition.png' },
    neurospine: { bg: '#1b2a4a', ink: LIGHT, accent: '#7fb0ff', frame: 'none', emblem: 'dte.png' },
    textbook: { bg: '#ffd84d', ink: DARK, accent: '#ffd84d', frame: 'paper', shot: 'scripts/shots/art/textbook-p1.png', shot2: 'scripts/shots/art/textbook-p2.png' },
}
