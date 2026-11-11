// Repaints the world's palette texture.
//
// Every model in the world samples its colours from one small strip
// (static/palette.png). The models were authored against a warm, rustic
// palette; this maps each of those colours to the site's own scheme: graphite
// surfaces that sit back, and blue, mint and violet accents that glow.
//
// Usage: node scripts/build-palette.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const input = path.join(here, 'shots/palette-original.png')
const output = path.join(here, '../static/palette.png')

const remap = {
    '7c7691': '2a3040', // stone
    'ebd1a3': '39404f', // pale wood
    '574e37': '1a1e28', // dark olive
    '3dbbe7': '32b8ff', // blue
    'c8c2c1': '434b5c', // light grey
    '4a413c': '14171f', // dark brown
    '575a5e': '1b1f29', // dark grey
    'eec3af': '3a4252', // peach
    'e4a90c': 'ffd60a', // yellow
    '91ad78': '2ee6a8', // green
    'e49a78': '333a49', // salmon wood
    '988165': '262c39', // brown wood
    'abae2b': '25c79a', // olive green
    'a49876': '2f3644', // khaki
    'b36d45': '1f2430', // main wood
    'e56202': '0a84ff', // orange trim
    'ec3f1c': 'ff375f', // red
    'fde6e1': '566076', // near white
    'f8a658': '2a3148', // planks
    'c30e3a': 'bf5af2', // crimson
    'c366ef': 'bf5af2', // purple
    'ed719f': '32b8ff', // pink (buttons, arrows)
    '1e0603': '0b0d12', // near black
    'fff2e8': '5a657c', // cream
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const unknown = new Set()

// The strip has slight compression noise, so match each pixel to the nearest known colour
const sources = Object.keys(remap).map(key => [ parseInt(key.slice(0, 2), 16), parseInt(key.slice(2, 4), 16), parseInt(key.slice(4, 6), 16), remap[key] ])

for(let i = 0; i < data.length; i += 4)
{
    if(data[i] + data[i + 1] + data[i + 2] === 0)
        continue

    let best = null
    let bestDistance = Infinity

    for(const [ r, g, b, target ] of sources)
    {
        const distance = Math.abs(r - data[i]) + Math.abs(g - data[i + 1]) + Math.abs(b - data[i + 2])
        if(distance < bestDistance)
        {
            bestDistance = distance
            best = target
        }
    }

    if(bestDistance > 12)
    {
        unknown.add([ data[i], data[i + 1], data[i + 2] ].join(','))
        continue
    }

    data[i] = parseInt(best.slice(0, 2), 16)
    data[i + 1] = parseInt(best.slice(2, 4), 16)
    data[i + 2] = parseInt(best.slice(4, 6), 16)
}

await sharp(data, { raw: info }).png().toFile(output)
console.log(`palette written${unknown.size ? `, unmapped colours: ${[ ...unknown ].join(' ')}` : ''}`)
