// Draws the cover of every project and paper: the picture on its board in
// the world.
//
// A cover is one 1600 x 900 image: the project's colour, its logo, its name,
// one line on what it is, the proof, and the real thing in a clean frame
// (sources/data/themes.js says which colour and which frame). They are laid
// out as a web page and photographed with Chrome, so the type is the site's
// own.
//
// Usage: node scripts/build-covers.mjs [id ...]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { projects, research, emblems } from '../sources/data/profile.js'
import { projectCards, researchCards } from '../sources/data/cards.js'
import { themes } from '../sources/data/themes.js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const only = process.argv.slice(2)
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const file = (relative) => pathToFileURL(path.join(root, relative)).href
const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const entries = [
    ...projects.map(project => ({
        id: project.id,
        title: project.title,
        line: projectCards[project.id]?.[0]?.line ?? project.tagline,
        proof: project.proof,
        output: `static/projects/images/${project.id}-cover.webp`,
    })),
    ...research.map(entry => ({
        id: entry.id,
        title: entry.title,
        line: researchCards[entry.id]?.[0]?.line ?? entry.summary,
        proof: `${entry.venue} · ${entry.status}`,
        output: `static/lab/images/${entry.id}-cover.webp`,
    })),
]

const stage = (theme) =>
{
    if(!theme.shot)
        return ''

    const shot = file(theme.shot)

    if(theme.frame === 'browser')
        return `<div class="browser ${theme.bar === 'light' ? 'is-light' : ''}"><div class="bar"><i></i><i></i><i></i></div><img src="${shot}"></div>`

    if(theme.frame === 'photo')
        return `<div class="photo"><img src="${shot}"></div>`

    if(theme.frame === 'paper')
        return `<div class="sheet is-back"><img src="${file(theme.shot2 ?? theme.shot)}"></div><div class="sheet"><img src="${shot}"></div>`

    if(theme.frame === 'figure')
        return `<div class="figure"><img src="${shot}"></div>`

    if(theme.frame === 'icon')
        return `<div class="icon"><img src="${shot}"></div>`

    return `<div class="bare"><img src="${shot}"></div>`
}

const page = (entry, theme) =>
{
    const longest = Math.max(...entry.title.split(' ').map(word => word.length))
    const size = Math.round(Math.min(132, 600 / (0.8 * longest)))
    const emblem = theme.emblem ? Object.values(emblems).find(item => item.file === theme.emblem) : null
    const wide = theme.frame === 'none'

    return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&family=Space+Grotesk:wght@500;600&display=block" rel="stylesheet">
<style>
    * { box-sizing: border-box; }
    body { margin: 0; width: 1600px; height: 900px; overflow: hidden; position: relative; background: ${theme.bg}; color: ${theme.ink}; font-family: 'Space Grotesk', sans-serif; }
    .copy { position: absolute; left: 92px; top: 0; bottom: 0; width: ${wide ? 1200 : 610}px; display: flex; flex-direction: column; justify-content: center; }
    .chip { width: 92px; height: 92px; margin-bottom: 46px; border-radius: 22px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08); }
    .chip img { width: 100%; height: 100%; padding: 14%; object-fit: contain; }
    h1 { margin: 0; font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: ${wide ? 132 : size}px; line-height: 1.02; letter-spacing: -0.045em; }
    .line { margin: 30px 0 0; max-width: ${wide ? 900 : 560}px; font-size: 36px; font-weight: 500; line-height: 1.28; opacity: 0.88; }
    .proof { margin: 30px 0 0; max-width: ${wide ? 900 : 540}px; font-size: 24px; font-weight: 600; line-height: 1.38; opacity: 0.6; }
    .stage { position: absolute; left: 760px; top: 0; right: 0; bottom: 0; }
    .stage img { display: block; }
    .browser { position: absolute; left: 0; top: 128px; width: 1060px; border-radius: 18px; overflow: hidden; background: #17181c; box-shadow: 0 44px 90px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(128, 128, 128, 0.28); }
    .browser .bar { display: flex; align-items: center; gap: 9px; height: 46px; padding: 0 18px; background: #1d1e23; }
    .browser.is-light { background: #ffffff; }
    .browser.is-light .bar { background: #ebecef; }
    .browser .bar i { width: 13px; height: 13px; border-radius: 50%; background: #ff5f57; }
    .browser .bar i:nth-child(2) { background: #febc2e; }
    .browser .bar i:nth-child(3) { background: #28c840; }
    .browser img { width: 100%; }
    .photo { position: absolute; left: 0; top: 104px; width: 760px; height: 692px; border-radius: 30px; overflow: hidden; box-shadow: 0 44px 90px rgba(0, 0, 0, 0.36), 0 0 0 1px rgba(0, 0, 0, 0.1); }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .sheet { position: absolute; left: 40px; top: 96px; width: 478px; background: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 34px 70px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08); }
    .sheet.is-back { left: 330px; top: 178px; }
    .sheet img { width: 100%; }
    .figure { position: absolute; left: 0; top: 250px; width: 780px; padding: 44px 40px; background: #ffffff; border-radius: 26px; box-shadow: 0 44px 90px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08); }
    .figure img { width: 100%; }
    .icon { position: absolute; left: 190px; top: 230px; width: 440px; height: 440px; border-radius: 100px; overflow: hidden; box-shadow: 0 44px 90px rgba(0, 0, 0, 0.36); }
    .icon img { width: 100%; height: 100%; object-fit: cover; }
    .bare { position: absolute; left: 0; top: 50px; width: 800px; height: 800px; }
    .bare img { width: 100%; height: 100%; object-fit: contain; }
</style></head><body>
    <div class="copy">
        ${emblem ? `<div class="chip" style="background:${emblem.bg}"><img src="${file(`static/profile/emblems/${emblem.file}`)}"></div>` : ''}
        <h1>${escape(entry.title)}</h1>
        <p class="line">${escape(entry.line)}</p>
        <p class="proof">${escape(entry.proof)}</p>
    </div>
    <div class="stage">${stage(theme)}</div>
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

    const theme = themes[entry.id]
    if(!theme)
    {
        console.log('no theme for', entry.id)
        continue
    }

    // Loaded from a file so the page may read the pictures next to it
    const html = path.join(temporary, `cover-${entry.id}.html`)
    fs.writeFileSync(html, page(entry, theme))
    await tab.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' })
    await tab.evaluate(() => document.fonts.ready)

    const png = await tab.screenshot({ type: 'png' })
    await sharp(png).webp({ quality: 88 }).toFile(path.join(root, entry.output))
    fs.unlinkSync(html)
    console.log('cover', entry.output)
}

await browser.close()
