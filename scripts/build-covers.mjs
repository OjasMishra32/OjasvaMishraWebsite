// Draws the cover of every project and paper: the picture on its board in
// the world.
//
// A cover explains the project in three panels (sources/data/explainers.js):
// what goes in, what the project does, what comes out, each with a caption.
// Covers are laid out as a web page and photographed with Chrome.
//
// Usage: node scripts/build-covers.mjs [id ...]      (needs Chrome)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { projects, research, experience, emblems } from '../sources/data/profile.js'
import { themes } from '../sources/data/themes.js'
import { explainers } from '../sources/data/explainers.js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const only = process.argv.slice(2)
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const file = (relative) => pathToFileURL(path.join(root, relative)).href
const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const entries = [
    ...projects.map(project => ({ id: project.id, title: project.title, output: `static/projects/images/${project.id}-cover.webp` })),
    ...research.map(entry => ({ id: entry.id, title: entry.title, output: `static/lab/images/${entry.id}-cover.webp` })),
]

/**
 * Drawn stand-ins, for steps that have no picture of their own
 */
const drawings = {
    // A list of openings, the matching ones marked
    feed: () => `<div class="draw feed">
        ${[ [ 'Software intern', 1 ], [ 'ML research intern', 1 ], [ 'Marketing associate', 0 ], [ 'Data science intern', 1 ], [ 'Staff engineer', 0 ] ].map(([ role, fits ]) => `
            <div class="row ${fits ? 'is-fit' : ''}">
                <span class="dot"></span>
                <span class="role">${role}</span>
                <span class="mark">${fits ? 'fits you' : ''}</span>
            </div>`).join('')}
    </div>`,

    // Sheets of paper, fanned
    sheets: (panel) => `<div class="draw sheets ${panel.span ? 'is-wide' : ''}">
        ${panel.images.map((image, index) => `<img class="sheet" style="--i:${index}" src="${file(image)}">`).join('')}
    </div>`,

    // An application form, filled in, with Submit left for the person
    form: () => `<div class="draw form">
        ${[ 'Full name', 'School', 'Graduation date', 'Why this role?' ].map((label, index) => `
            <div class="field"><span class="label">${label}</span><span class="value" style="width:${[ 46, 62, 30, 84 ][index]}%"></span><span class="tick">✓</span></div>`).join('')}
        <div class="attach">résumé.pdf attached <span class="tick">✓</span></div>
        <div class="submit">Submit <span>left for you</span></div>
    </div>`,

    // Something said: by the person, or out loud by the product
    say: (item) => `<div class="draw say ${item.spoken ? 'is-spoken' : ''}">
        <div class="who">${item.spoken ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>' : ''}${escape(item.who)}</div>
        <div class="bubble">${escape(item.text)}</div>
    </div>`,

    // A list of things done, each ticked
    apps: (item) => `<div class="draw apps ${item.compact ? 'is-compact' : ''}">
        ${item.items.map(name => `<div class="app"><span>${escape(name)}</span><b>✓</b></div>`).join('')}
    </div>`,

    // A screenshot in the window it runs in
    window: (item) => `<div class="draw window ${item.bar === 'light' ? 'is-light' : ''}">
        <div class="chrome"><i></i><i></i><i></i></div>
        <div class="view"><img src="${file(item.img)}" style="object-position:${item.position ?? 'center top'};${item.zoom ? `transform:scale(${item.zoom});transform-origin:${item.position ?? 'center top'};` : ''}"></div>
    </div>`,

    // A screenshot on a phone
    phone: (item) => `<div class="draw phone"><div class="device"><img src="${file(item.img)}"></div></div>`,

    // An app icon
    icon: (item) => `<div class="draw icon"><img src="${file(item.img)}"></div>`,

    // One number
    stat: (item) => `<div class="draw stat">
        <div class="value" style="font-size:${Math.round(Math.min(132, 600 / Math.max(4, item.value.length)))}px">${escape(item.value)}</div>
        <div class="label">${escape(item.label)}</div>
    </div>`,

    // Two things side by side, about to be folded together
    pair: (item) => `<div class="draw pair">
        <div class="half"><div class="lines"><i></i><i></i><i></i><i></i></div><b>${escape(item.left)}</b></div>
        <div class="hinge"></div>
        <div class="half"><div class="lines"><i></i><i></i><i></i><i></i></div><b>${escape(item.right)}</b></div>
    </div>`,

    // A result card
    card: (item) => `<div class="draw card">
        <div class="result">
            <b>${escape(item.title)}</b>
            ${item.rows.map(width => `<i style="width:${width}%"></i>`).join('')}
        </div>
    </div>`,

    // A reference list with one entry selected
    cite: () => `<div class="draw cite">
        ${[ 0, 1, 2, 3 ].map(index => `<div class="ref ${index === 1 ? 'is-picked' : ''}"><span>[${index + 7}]</span><div><i style="width:${[ 92, 100, 84, 96 ][index]}%"></i><i style="width:${[ 58, 72, 66, 40 ][index]}%"></i></div></div>`).join('')}
        <div class="clicks">triple-click</div>
    </div>`,

    // A step response against a torque limit: plain PI overshoots, anti-windup doesn't
    plot: () => `<div class="draw plot"><svg viewBox="0 0 448 438">
        <line x1="40" y1="118" x2="420" y2="118" stroke="#86868b" stroke-width="2.5" stroke-dasharray="9 8"/>
        <text x="420" y="104" text-anchor="end" font-size="19" font-weight="600" fill="#86868b">target</text>
        <path d="M40 330 L96 330 C150 330 150 70 214 62 C270 56 300 118 420 118" fill="none" stroke="#ff9f0a" stroke-width="6" stroke-linecap="round"/>
        <path d="M40 330 L96 330 C150 330 160 122 232 119 L420 118" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
        <rect x="96" y="368" width="150" height="12" rx="6" fill="#ff9f0a"/>
        <rect x="96" y="388" width="84" height="12" rx="6" fill="var(--accent)"/>
        <text x="96" y="424" font-size="18" font-weight="600" fill="#6e6e73">time spent at the torque limit</text>
        <text x="228" y="52" font-size="19" font-weight="700" fill="#ff9f0a">overshoot</text>
    </svg></div>`,

    // A column of vertebrae: as a scan, outlined, then scored
    spine: (item) => `<div class="draw spine is-${item.mode}">
        ${[ 'L1', 'L2', 'L3', 'L4', 'L5' ].map((name, index) => `<div class="vertebra" style="--w:${[ 150, 160, 170, 180, 188 ][index]}px"><span>${item.mode === 'scan' ? '' : name}</span>${item.mode === 'score' ? '<b>HU · VBQ</b>' : ''}</div>`).join('')}
    </div>`,
}

const panel = (item) =>
{
    const inner = item.draw
        ? drawings[item.draw](item)
        : `<img class="picture" src="${file(item.img)}" style="object-fit:${item.fit ?? 'cover'};${item.position ? `object-position:${item.position};` : ''}${item.zoom ? `transform:scale(${item.zoom});transform-origin:${item.position ?? 'center'};` : ''}">`

    return `<figure class="panel" style="flex:${item.span ?? 1}">
        <div class="frame" style="${item.background ? `background:${item.background};` : ''}">${inner}</div>
        <figcaption><b class="${item.caption.length > 44 ? 'is-long' : ''}">${escape(item.caption)}</b><span>${escape(item.sub ?? '')}</span></figcaption>
    </figure>`
}

const arrow = '<div class="arrow"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24h30"/><path d="m26 11 13 13-13 13"/></svg></div>'

const page = (entry, explainer, theme) =>
{
    const emblem = theme?.emblem ? Object.values(emblems).find(item => item.file === theme.emblem) : null

    return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=block" rel="stylesheet">
<style>
    * { box-sizing: border-box; }
    body { margin: 0; width: 1600px; height: 900px; overflow: hidden; background: #fbfbfd; color: #1d1d1f; font-family: 'Inter', sans-serif; --accent: ${explainer.accent}; }
    header { position: absolute; left: 72px; right: 72px; top: 58px; display: flex; align-items: center; gap: 26px; }
    .chip { flex: none; width: 92px; height: 92px; border-radius: 22px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.06); }
    .chip img { width: 100%; height: 100%; padding: 14%; object-fit: contain; }
    h1 { margin: 0; font-size: 76px; font-weight: 800; letter-spacing: -0.045em; line-height: 1; white-space: nowrap; }
    h1.is-long { font-size: 60px; }
    .line.is-long { font-size: 27px; }
    .line { margin: 12px 0 0; font-size: 31px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.2; color: #515154; }
    .strip { position: absolute; left: 72px; right: 72px; top: 214px; display: flex; align-items: flex-start; }
    .panel { flex: 1; min-width: 0; margin: 0; }
    .frame { position: relative; height: 438px; border-radius: 28px; overflow: hidden; background: #ececf0; box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06); }
    .picture { display: block; width: 100%; height: 100%; }
    figcaption { padding: 22px 4px 0; }
    figcaption b { display: block; font-size: 30px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.16; }
    figcaption span { display: block; margin-top: 8px; font-size: 22px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.3; color: #6e6e73; }
    .arrow { flex: none; width: 76px; height: 438px; display: flex; align-items: center; justify-content: center; color: var(--accent); }
    .arrow svg { width: 44px; height: 44px; }
    .gap { flex: none; width: 34px; }
    figcaption b.is-long { font-size: 26px; }
    .proof { position: absolute; left: 72px; right: 72px; bottom: 40px; font-size: 22px; font-weight: 600; letter-spacing: -0.01em; color: var(--accent); }

    .draw { position: absolute; inset: 0; }
    .feed { display: flex; flex-direction: column; justify-content: center; gap: 14px; padding: 0 30px; background: #ffffff; }
    .feed .row { display: flex; align-items: center; gap: 14px; height: 60px; padding: 0 18px; border-radius: 16px; background: #f2f2f5; font-size: 22px; font-weight: 600; letter-spacing: -0.015em; color: #a1a1a6; }
    .feed .row .dot { flex: none; width: 12px; height: 12px; border-radius: 50%; background: #d2d2d7; }
    .feed .row .role { flex: 1; white-space: nowrap; overflow: hidden; }
    .feed .row.is-fit { background: color-mix(in srgb, var(--accent) 11%, #ffffff); color: #1d1d1f; box-shadow: inset 0 0 0 2px var(--accent); }
    .feed .row.is-fit .dot { background: var(--accent); }
    .feed .row .mark { font-size: 18px; font-weight: 700; color: var(--accent); }
    .sheets { background: #e9e9ee; }
    .sheets .sheet { position: absolute; top: 54px; left: calc(34px + var(--i) * 92px); width: 258px; border-radius: 4px; background: #fff; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.07); }
    .sheets.is-wide .sheet { top: 40px; left: calc(200px + var(--i) * 260px); width: 330px; }
    .form { display: flex; flex-direction: column; justify-content: center; gap: 13px; padding: 0 34px; background: #ffffff; }
    .form .field { position: relative; height: 52px; padding: 8px 16px; border-radius: 13px; background: #f2f2f5; }
    .form .label { display: block; font-size: 13px; font-weight: 600; color: #86868b; }
    .form .value { display: block; height: 10px; margin-top: 8px; border-radius: 5px; background: #c7c7cc; }
    .form .tick { position: absolute; right: 16px; top: 13px; font-size: 22px; font-weight: 800; color: #30b158; }
    .form .attach { position: relative; padding: 0 16px; font-size: 19px; font-weight: 600; color: #1d1d1f; }
    .form .attach .tick { position: static; margin-left: 6px; }
    .form .submit { display: flex; align-items: center; justify-content: center; gap: 12px; height: 54px; border-radius: 14px; border: 2px dashed var(--accent); font-size: 21px; font-weight: 700; color: var(--accent); }
    .form .submit span { font-size: 16px; font-weight: 600; opacity: 0.75; }
    .say { display: flex; flex-direction: column; justify-content: center; gap: 18px; padding: 0 34px; background: #ffffff; }
    .say .who { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 700; color: #86868b; }
    .say .who svg { width: 26px; height: 26px; color: var(--accent); }
    .say .bubble { padding: 26px 28px; border-radius: 28px 28px 28px 8px; background: var(--accent); color: #ffffff; font-size: 34px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.2; }
    .say.is-spoken .bubble { border-radius: 28px; background: #1d1d1f; }
    .apps { display: flex; flex-direction: column; justify-content: center; gap: 13px; padding: 0 32px; background: #ffffff; }
    .apps .app { display: flex; align-items: center; justify-content: space-between; min-height: 60px; padding: 10px 20px; border-radius: 16px; background: #f2f2f5; font-size: 25px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.15; }
    .apps .app b { flex: none; margin-left: 12px; font-size: 26px; font-weight: 800; color: #30b158; }
    .apps.is-compact { gap: 9px; }
    .apps.is-compact .app { min-height: 50px; padding: 6px 18px; font-size: 22px; }
    .window { display: flex; flex-direction: column; background: #17181c; }
    .window .chrome { flex: none; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; background: #1d1e23; }
    .window.is-light { background: #ffffff; }
    .window.is-light .chrome { background: #ebecef; }
    .window .chrome i { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; }
    .window .chrome i:nth-child(2) { background: #febc2e; }
    .window .chrome i:nth-child(3) { background: #28c840; }
    .window .view { flex: 1; min-height: 0; overflow: hidden; }
    .window .view img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .phone { display: flex; align-items: center; justify-content: center; background: #e9e9ee; }
    .phone .device { width: 210px; height: 400px; padding: 9px; border-radius: 38px; background: #1d1d1f; box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28); }
    .phone .device img { display: block; width: 100%; height: 100%; border-radius: 30px; object-fit: cover; object-position: center top; }
    .icon { display: flex; align-items: center; justify-content: center; background: #e9e9ee; }
    .icon img { width: 250px; height: 250px; border-radius: 58px; object-fit: cover; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24); }
    .stat { display: flex; flex-direction: column; justify-content: center; padding: 0 36px; background: #ffffff; }
    .stat .value { font-weight: 800; letter-spacing: -0.055em; line-height: 1; color: var(--accent); white-space: nowrap; }
    .stat .label { margin-top: 18px; font-size: 29px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; color: #1d1d1f; }
    .pair { display: flex; align-items: stretch; padding: 46px 30px; gap: 0; background: #e9e9ee; }
    .pair .half { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 22px; background: #ffffff; border-radius: 26px 6px 6px 26px; box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12); }
    .pair .half:last-child { border-radius: 6px 26px 26px 6px; }
    .pair .half b { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
    .pair .lines i { display: block; height: 11px; margin-bottom: 13px; border-radius: 6px; background: #d2d2d7; }
    .pair .lines i:nth-child(2) { width: 80%; } .pair .lines i:nth-child(3) { width: 92%; } .pair .lines i:nth-child(4) { width: 55%; }
    .pair .hinge { flex: none; width: 8px; margin: 14px 0; border-radius: 4px; background: var(--accent); }
    .card { display: flex; align-items: center; justify-content: center; padding: 0 34px; background: #e9e9ee; }
    .card .result { width: 100%; padding: 30px 28px 22px; border-radius: 26px; background: #ffffff; box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14); border-top: 8px solid var(--accent); }
    .card .result b { display: block; margin-bottom: 22px; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; }
    .card .result i { display: block; height: 12px; margin-bottom: 15px; border-radius: 6px; background: #d2d2d7; }
    .cite { display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: 0 28px; background: #ffffff; }
    .cite .ref { display: flex; gap: 14px; padding: 14px 16px; border-radius: 14px; font-size: 20px; font-weight: 700; color: #86868b; }
    .cite .ref div { flex: 1; padding-top: 6px; }
    .cite .ref i { display: block; height: 10px; margin-bottom: 11px; border-radius: 5px; background: #d2d2d7; }
    .cite .ref.is-picked { background: color-mix(in srgb, var(--accent) 16%, #ffffff); box-shadow: inset 0 0 0 2px var(--accent); color: #1d1d1f; }
    .cite .ref.is-picked i { background: color-mix(in srgb, var(--accent) 55%, #ffffff); }
    .cite .clicks { align-self: flex-end; padding: 8px 16px; border-radius: 999px; background: #1d1d1f; color: #ffffff; font-size: 19px; font-weight: 700; }
    .plot { background: #ffffff; }
    .plot svg { display: block; width: 100%; height: 100%; font-family: 'Inter', sans-serif; }
    .spine { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; background: #0e1116; }
    .spine .vertebra { position: relative; display: flex; align-items: center; justify-content: center; width: var(--w); height: 56px; border-radius: 20px; background: #3a4150; color: #ffffff; font-size: 20px; font-weight: 700; }
    .spine.is-scan .vertebra { background: #5a6170; filter: blur(2.5px); }
    .spine.is-segment .vertebra { background: color-mix(in srgb, var(--accent) 30%, #0e1116); box-shadow: inset 0 0 0 3px var(--accent); }
    .spine.is-score { background: #ffffff; align-items: flex-start; padding-left: 44px; }
    .spine.is-score .vertebra { background: color-mix(in srgb, var(--accent) 14%, #ffffff); box-shadow: inset 0 0 0 3px var(--accent); color: #1d1d1f; }
    .spine.is-score .vertebra b { position: absolute; left: calc(100% + 16px); white-space: nowrap; padding: 6px 12px; border-radius: 999px; background: var(--accent); color: #ffffff; font-size: 17px; font-weight: 700; }
</style></head><body>
    <header>
        ${emblem ? `<div class="chip" style="background:${emblem.bg}"><img src="${file(`static/profile/emblems/${emblem.file}`)}"></div>` : ''}
        <div>
            <h1 class="${entry.title.length > 22 ? 'is-long' : ''}">${escape(entry.title)}</h1>
            <p class="line ${explainer.line.length > 86 ? 'is-long' : ''}">${escape(explainer.line)}</p>
        </div>
    </header>
    <div class="strip">${explainer.panels.map(panel).join(explainer.arrows === false ? '<div class="gap"></div>' : arrow)}</div>
    <div class="proof">${escape(explainer.proof)}</div>
</body></html>`
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: [ '--allow-file-access-from-files', '--hide-scrollbars' ] })
const tab = await browser.newPage()
await tab.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 })

const temporary = path.join(root, 'scripts/shots/tmp')
fs.mkdirSync(temporary, { recursive: true })

for(const entry of entries)
{
    if(only.length && !only.includes(entry.id))
        continue

    const explainer = explainers[entry.id]
    if(!explainer)
    {
        console.log('no explainer for', entry.id)
        continue
    }

    // Loaded from a file so the page may read the pictures next to it
    const html = path.join(temporary, `cover-${entry.id}.html`)
    fs.writeFileSync(html, page(entry, explainer, themes[entry.id]))
    await tab.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' })
    await tab.evaluate(() => document.fonts.ready)

    const png = await tab.screenshot({ type: 'png' })
    await sharp(png).webp({ quality: 90 }).toFile(path.join(root, entry.output))

    // The three pictures alone, without the words: the About page sets its own type around them
    const strip = await tab.screenshot({ type: 'png', clip: { x: 52, y: 196, width: 1496, height: 482 } })
    await sharp(strip).resize({ width: 1200 }).webp({ quality: 84 }).toFile(path.join(root, entry.output.replace('-cover.webp', '-strip.webp')))
    fs.unlinkSync(html)
    console.log('cover', entry.output)
}

/**
 * Role cards: the plaques along the first stretch of the route
 */
const rolePage = (role) =>
{
    const emblem = emblems[role.company]
    const metrics = (role.metrics ?? []).slice(0, 2)

    return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=block" rel="stylesheet">
<style>
    * { box-sizing: border-box; }
    body { margin: 0; width: 1280px; height: 800px; overflow: hidden; background: #fbfbfd; color: #1d1d1f; font-family: 'Inter', sans-serif; padding: 60px 64px; display: flex; flex-direction: column; }
    .top { display: flex; align-items: center; gap: 32px; }
    .chip { flex: none; width: 150px; height: 150px; border-radius: 34px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.06); }
    .chip img { width: 100%; height: 100%; padding: 14%; object-fit: contain; }
    .company { font-size: 50px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; }
    .period { margin-top: 10px; font-size: 34px; font-weight: 500; letter-spacing: -0.015em; color: #6e6e73; }
    h1 { margin: 40px 0 0; font-size: 108px; font-weight: 800; letter-spacing: -0.05em; line-height: 1; }
    h1.is-long { font-size: 82px; }
    .metrics { margin-top: auto; display: flex; gap: 0; border-top: 3px solid #e5e5ea; padding-top: 32px; }
    .metric { flex: 1; min-width: 0; padding-right: 24px; }
    .metric + .metric { padding-left: 34px; border-left: 3px solid #e5e5ea; }
    .value { font-size: 84px; font-weight: 800; letter-spacing: -0.045em; line-height: 1; white-space: nowrap; }
    .value.is-long { font-size: 50px; }
    .label { margin-top: 12px; font-size: 32px; font-weight: 500; letter-spacing: -0.015em; line-height: 1.2; color: #6e6e73; }
</style></head><body>
    <div class="top">
        ${emblem?.file ? `<div class="chip" style="background:${emblem.bg}"><img src="${file(`static/profile/emblems/${emblem.file}`)}"></div>` : ''}
        <div>
            <div class="company">${escape(role.company)}</div>
            <div class="period">${escape(role.period)}</div>
        </div>
    </div>
    <h1 class="${role.title.length > 20 ? 'is-long' : ''}">${escape(role.title)}</h1>
    <div class="metrics">
        ${metrics.map(([ value, label ]) => `<div class="metric"><div class="value ${value.length > 8 ? 'is-long' : ''}">${escape(value)}</div><div class="label">${escape(label)}</div></div>`).join('')}
    </div>
</body></html>`
}

if(!only.length || only.includes('roles'))
{
    await tab.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    fs.mkdirSync(path.join(root, 'static/experience'), { recursive: true })

    for(const [ index, role ] of experience.slice(0, 6).entries())
    {
        const html = path.join(temporary, `role-${index}.html`)
        fs.writeFileSync(html, rolePage(role))
        await tab.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' })
        await tab.evaluate(() => document.fonts.ready)

        const png = await tab.screenshot({ type: 'png' })
        await sharp(png).webp({ quality: 90 }).toFile(path.join(root, `static/experience/role-${index}.webp`))
        fs.unlinkSync(html)
        console.log('role', index, role.company)
    }
}

await browser.close()
