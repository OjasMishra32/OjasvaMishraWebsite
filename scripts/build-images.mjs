// Prepares every image the site shows from the raw material in scripts/shots
// (raw = captured pages, art = files pulled from the project repos, papers
// and portfolios):
//
//   static/cards            images used by the presentations (data/cards.js)
//   static/lab/images       the small pictures on the research board's side list
//
// The covers on the boards themselves come from build-covers.mjs.
//
// Usage: node scripts/build-images.mjs
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { projects, research } from '../sources/data/profile.js'
import { projectCards, researchCards, researchMinis } from '../sources/data/cards.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..')
const sources = [ path.join(here, 'shots/art'), path.join(here, 'shots/art/src'), path.join(here, 'shots/raw'), path.join(root, 'static/profile/emblems') ]

const find = (name) =>
{
    for(const directory of sources)
    {
        const match = readdirSync(directory).find(file => file.replace(/\.[a-z]+$/i, '') === name)
        if(match)
            return path.join(directory, match)
    }
    throw new Error(`No source image named ${name}`)
}

/**
 * A presentation has to cover its 12 × 6 grid exactly: no holes, no overlaps
 */
const checkGrid = (id, tiles) =>
{
    const cells = new Map()

    for(const tile of tiles)
    {
        const [ column, row, width, height ] = tile.at
        for(let x = column; x < column + width; x++)
        {
            for(let y = row; y < row + height; y++)
            {
                const key = `${x},${y}`
                if(x > 12 || y > 6)
                    throw new Error(`${id}: tile ${tile.type} at ${tile.at} leaves the grid`)
                if(cells.has(key))
                    throw new Error(`${id}: ${tile.type} at ${tile.at} overlaps ${cells.get(key)} on cell ${key}`)
                cells.set(key, `${tile.type} at ${tile.at}`)
            }
        }
    }

    if(cells.size !== 72)
        throw new Error(`${id}: ${72 - cells.size} empty cells`)
}

const cover = (input, output, width, height, position = 'centre') =>
    sharp(input).resize(width, height, { fit: 'cover', position }).webp({ quality: 86 }).toFile(output)

// For work with nothing to photograph yet: a chalkboard slate with its name
const slate = (title, line, note, output, width, height) =>
{
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
        <rect width="1600" height="900" fill="#26222c"/>
        <text x="110" y="420" font-family="-apple-system, Helvetica Neue, Arial" font-weight="700" font-size="150" letter-spacing="-4" fill="#f5f5f7">${title}</text>
        <text x="116" y="520" font-family="-apple-system, Helvetica Neue, Arial" font-weight="500" font-size="52" fill="#a1a1a6">${line}</text>
        <text x="116" y="610" font-family="-apple-system, Helvetica Neue, Arial" font-weight="600" font-size="40" fill="#6e6e73">${note}</text>
    </svg>`
    return sharp(Buffer.from(svg)).resize(width, height).webp({ quality: 88 }).toFile(output)
}

// Presentation images
const cardsDir = path.join(root, 'static/cards')
mkdirSync(cardsDir, { recursive: true })
const names = new Set()

for(const [ id, tiles ] of [ ...Object.entries(projectCards), ...Object.entries(researchCards) ])
{
    checkGrid(id, tiles)
    for(const tile of tiles)
        if(tile.src)
            names.add(tile.src)
}

for(const name of names)
    await sharp(find(name)).resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toFile(path.join(cardsDir, `${name}.webp`))

console.log(`${names.size} presentation images`)

// Project board: imagery only, the write-up is in the presentation
const boardShots = {
    'twinly-1': [ 'twinly', 'top' ],
    'applytwin-1': [ 'applytwin', 'top' ],
    'applytwin-2': [ 'applytwin-demo', 'top' ],
    'drift-1': [ 'drift', 'top' ],
    'dejaview-1': [ 'dejaview-browser' ],
    'dejaview-2': [ 'dejaview-roblox' ],
    'dejaview-3': [ 'dejaview-splats' ],
    'luciddreams-1': [ 'lucid-guitar' ],
    'luciddreams-2': [ 'luciddreams', 'top' ],
    'hive-1': [ 'hive-host', 'top' ],
    'evbots-1': [ 'yt_2A_RMrd1qKo' ],
    'kinetix-1': [ 'yt_-k4Ks9YATTI' ],
    'fuse-1': [ 'yt_h8jK9cSw0xU' ],
    'eyesight-1': [ 'eyesight' ],
    'preventaai-1': [ 'preventaai', 'top' ],
    'quickcitepro-1': [ 'quickcitepro', 'top' ],
    'glassbox-1': [ 'veritas-1', 'top' ],
    'tsa-1': [ 'tsa-dome-front' ],
    'tsa-2': [ 'drone-assembled' ],
    'tsa-3': [ 'tsa-dome-side' ],
}

const projectsDir = path.join(root, 'static/projects/images')
mkdirSync(projectsDir, { recursive: true })

for(const project of projects)
{
    for(const image of project.images)
    {
        // Covers are drawn by build-covers.mjs
        if(image.includes('-cover'))
            continue

        const [ source, position ] = boardShots[image.replace('.webp', '')] || []
        if(!source)
            throw new Error(`No board image defined for ${image}`)
        await cover(find(source), path.join(projectsDir, image), 1600, 900, position)
    }
}

// Research board: the strongest artifact of each entry, and a mini of it
const labShots = {
    'pid-gain': [ 'arxiv-p8', 'top' ],
    'scig': [ 'scig-franka' ],
    'feedback-authority': [ 'icra-fig1' ],
    'courtside': [ 'courtside-poster' ],
    'volition': [ 'hero' ],
    'neurospine': [ '@slate:NeuroSpine:Vertebral bone quality from CT and MRI:In progress' ],
    'textbook': [ 'textbook-p1', 'top' ],
}

const labDir = path.join(root, 'static/lab/images')
mkdirSync(labDir, { recursive: true })

for(const entry of research)
{
    const [ source, position ] = labShots[entry.id]

    if(source.startsWith('@slate:'))
    {
        const [ , title, line, note ] = source.split(':')
        await slate(title, line, note, path.join(labDir, entry.imageMini), 320, 180)
        continue
    }

    // The board's main picture is the cover (build-covers.mjs); only the mini is made here
    await cover(find(source), path.join(labDir, entry.imageMini), 320, 180, position)
}

console.log(`${projects.length} projects, ${research.length} research entries`)
