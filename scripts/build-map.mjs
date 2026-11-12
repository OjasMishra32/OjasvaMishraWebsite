// Draws the map shown in the map panel.
//
// The source is a flat top-down picture of the terrain
// (scripts/shots/map-original.webp). This reads it as four kinds of ground
// (water, open ground, vegetation, road) and redraws it the way the rest of
// the world looks: dark surfaces, a survey grid on the land, glowing outlines
// along every boundary and vegetation as a scatter of points.
//
// The picture covers the square around the disc the world is cut to, with
// the route drawn on it.
//
// Usage: node scripts/build-map.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { disc, mapHalf, path as route } from '../sources/data/route.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const input = path.join(here, 'shots/map-original.webp')
const output = path.join(here, '../static/ui/map/map.webp')

const SIZE = 1536
const WATER = 0, GROUND = 1, GREEN = 2, ROAD = 3

/**
 * 1. Read the picture and label every pixel
 */
// Only the square around the disc the world is cut to (the source covers
// 192 m; data/route.js says where the disc is)
const WORLD = 192
const SPAN = mapHalf * 2
const sourceSize = (await sharp(input).metadata()).width
const perMetre = sourceSize / WORLD
const cropLeft = Math.round((disc.x - mapHalf + WORLD / 2) * perMetre)
const cropTop = Math.round((disc.z - mapHalf + WORLD / 2) * perMetre)
const cropSize = Math.round(SPAN * perMetre)

const { data: source, info: sourceInfo } = await sharp(input)
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
    .resize(SIZE, SIZE, { kernel: 'lanczos3' })
    .median(5)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

const count = SIZE * SIZE
if(sourceInfo.channels !== 3)
    throw new Error(`expected 3 channels, got ${sourceInfo.channels}`)
let labels = new Uint8Array(count)

for(let i = 0; i < count; i++)
{
    const r = source[i * 3]
    const g = source[i * 3 + 1]
    const b = source[i * 3 + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    // Blue and teal hues are water, dark warm greys are road, olive greens
    // are vegetation (pink blossom counts too) and the rest is open ground
    if(b > r + 10 && g >= r)
        labels[i] = WATER
    else if(max < 105 && min > 22 && r >= g && g > b && max - min < 46)
        labels[i] = ROAD
    else if(g >= r - 12 && g > b + 32 && r < 205)
        labels[i] = GREEN
    else if(r > g + 45 && b > g + 6)
        labels[i] = GREEN
    else
        labels[i] = GROUND
}

/**
 * 2. Clean up: each pixel takes the most common label around it. Run as two
 * passes of a box count per label, horizontal then vertical.
 */
const majority = (labelsIn, radius) =>
{
    const counts = [ 0, 1, 2, 3 ].map(() => new Uint16Array(count))
    const rows = [ 0, 1, 2, 3 ].map(() => new Uint16Array(count))

    for(let label = 0; label < 4; label++)
    {
        const row = rows[label]
        const total = counts[label]

        for(let y = 0; y < SIZE; y++)
        {
            let sum = 0
            for(let x = - radius; x < SIZE; x++)
            {
                const add = x + radius
                const remove = x - radius - 1
                if(add < SIZE && labelsIn[y * SIZE + add] === label) sum++
                if(remove >= 0 && labelsIn[y * SIZE + remove] === label) sum--
                if(x >= 0) row[y * SIZE + x] = sum
            }
        }

        for(let x = 0; x < SIZE; x++)
        {
            let sum = 0
            for(let y = - radius; y < SIZE; y++)
            {
                const add = y + radius
                const remove = y - radius - 1
                if(add < SIZE) sum += row[add * SIZE + x]
                if(remove >= 0) sum -= row[remove * SIZE + x]
                if(y >= 0) total[y * SIZE + x] = sum
            }
        }
    }

    const result = new Uint8Array(count)
    for(let i = 0; i < count; i++)
    {
        let best = 0
        for(let label = 1; label < 4; label++)
        {
            if(counts[label][i] > counts[best][i])
                best = label
        }
        result[i] = best
    }
    return result
}

labels = majority(labels, 9)
labels = majority(labels, 5)

/**
 * 3. Paint
 */
const base = {
    [ WATER ]: [ 5, 8, 16 ],
    [ GROUND ]: [ 13, 20, 36 ],
    [ GREEN ]: [ 12, 28, 40 ],
    [ ROAD ]: [ 24, 34, 58 ],
}

const pixels = new Float32Array(count * 3)
const lines = new Uint8Array(count) // outline strength, blurred later for the glow

// Cheap repeatable noise
const hash = (x, y) =>
{
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return value - Math.floor(value)
}

const at = (x, y) => labels[Math.min(SIZE - 1, Math.max(0, y)) * SIZE + Math.min(SIZE - 1, Math.max(0, x))]

for(let y = 0; y < SIZE; y++)
{
    for(let x = 0; x < SIZE; x++)
    {
        const i = y * SIZE + x
        const label = labels[i]
        let [ r, g, b ] = base[label]

        // Survey grid on the land: one line every 4 m, a stronger one every 16 m
        if(label !== WATER)
        {
            const cell = SIZE * 4 / SPAN
            const fx = Math.abs(((x + cell / 2) % cell) - cell / 2)
            const fy = Math.abs(((y + cell / 2) % cell) - cell / 2)
            const major = SIZE * 16 / SPAN
            const mx = Math.abs(((x + major / 2) % major) - major / 2)
            const my = Math.abs(((y + major / 2) % major) - major / 2)

            let grid = 0
            if(fx < 0.8 || fy < 0.8) grid = 0.07
            if(mx < 1.2 || my < 1.2) grid = 0.15

            r += (57 - r) * grid
            g += (183 - g) * grid
            b += (255 - b) * grid
        }

        // Outlines wherever the kind of ground changes
        let strength = 0
        for(const [ dx, dy ] of [ [ 2, 0 ], [ - 2, 0 ], [ 0, 2 ], [ 0, - 2 ] ])
        {
            const other = at(x + dx, y + dy)
            if(other === label)
                continue

            const coast = label === WATER || other === WATER
            const road = label === ROAD || other === ROAD
            strength = Math.max(strength, coast ? 255 : road ? 150 : 70)
        }
        lines[i] = strength

        pixels[i * 3] = r
        pixels[i * 3 + 1] = g
        pixels[i * 3 + 2] = b
    }
}

// Vegetation as points
const dots = new Uint8Array(count)
const step = 15
for(let gy = 0; gy < SIZE; gy += step)
{
    for(let gx = 0; gx < SIZE; gx += step)
    {
        const x = Math.round(gx + hash(gx, gy) * step)
        const y = Math.round(gy + hash(gy, gx) * step)
        if(at(x, y) !== GREEN)
            continue

        const size = hash(x, y) > 0.7 ? 2 : 1
        const level = 120 + Math.round(hash(y, x) * 135)
        for(let dy = - size; dy <= size; dy++)
        {
            for(let dx = - size; dx <= size; dx++)
            {
                if(dx * dx + dy * dy > size * size + 1)
                    continue
                const px = x + dx
                const py = y + dy
                if(px >= 0 && py >= 0 && px < SIZE && py < SIZE)
                    dots[py * SIZE + px] = level
            }
        }
    }
}

// Faint depth rings in the water, following the shore
const blurred = async (buffer, sigma) =>
{
    const { data, info } = await sharp(buffer, { raw: { width: SIZE, height: SIZE, channels: 1 } })
        .blur(sigma)
        .raw()
        .toBuffer({ resolveWithObject: true })

    // sharp may hand a grey image back with more than one channel
    if(info.channels === 1)
        return data

    const single = new Uint8Array(count)
    for(let i = 0; i < count; i++)
        single[i] = data[i * info.channels]
    return single
}

const land = new Uint8Array(count)
for(let i = 0; i < count; i++)
    land[i] = labels[i] === WATER ? 0 : 255

const [ crisp, glow, wide, shore ] = await Promise.all([
    blurred(lines, 0.9),
    blurred(lines, 7),
    blurred(lines, 26),
    blurred(land, 46),
])

const out = Buffer.alloc(count * 3)
for(let i = 0; i < count; i++)
{
    let r = pixels[i * 3]
    let g = pixels[i * 3 + 1]
    let b = pixels[i * 3 + 2]

    if(labels[i] === WATER)
    {
        // Contours of the blurred shoreline
        const distance = shore[i] / 255
        const band = Math.abs(((distance * 9) % 1) - 0.5)
        if(distance > 0.06 && distance < 0.9 && band < 0.035)
        {
            r += 18 * distance
            g += 70 * distance
            b += 110 * distance
        }
    }

    const line = Math.min(1, crisp[i] / 255 * 1.6)
    const halo = glow[i] / 255 * 1.5 + wide[i] / 255 * 0.9

    r += 57 * halo * 0.55
    g += 183 * halo * 0.55
    b += 255 * halo * 0.55

    r += (150 - r) * line
    g += (222 - g) * line
    b += (255 - b) * line

    const dot = dots[i] / 255
    r += (46 - r) * dot
    g += (230 - g) * dot
    b += (168 - b) * dot

    out[i * 3] = Math.min(255, r)
    out[i * 3 + 1] = Math.min(255, g)
    out[i * 3 + 2] = Math.min(255, b)
}

/**
 * 4. The edge of the world and the route through it
 */
const toPixel = (x, z) => [ (x - (disc.x - mapHalf)) / SPAN * SIZE, (z - (disc.z - mapHalf)) / SPAN * SIZE ]
const [ centreX, centreY ] = toPixel(disc.x, disc.z)
const radius = disc.radius / SPAN * SIZE
const line = route.map(([ x, z ]) => toPixel(x, z).map(value => value.toFixed(1)).join(',')).join(' ')

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
    <defs><mask id="outside"><rect width="100%" height="100%" fill="white"/><circle cx="${centreX}" cy="${centreY}" r="${radius}" fill="black"/></mask></defs>
    <rect width="100%" height="100%" fill="#05080f" mask="url(#outside)"/>
    <circle cx="${centreX}" cy="${centreY}" r="${radius}" fill="none" stroke="#39b7ff" stroke-opacity="0.25" stroke-width="14"/>
    <circle cx="${centreX}" cy="${centreY}" r="${radius}" fill="none" stroke="#9fe0ff" stroke-width="3"/>
    <polyline points="${line}" fill="none" stroke="#ffd27a" stroke-opacity="0.28" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="${line}" fill="none" stroke="#ffd27a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 18"/>
</svg>`)

await sharp(out, { raw: { width: SIZE, height: SIZE, channels: 3 } })
    .composite([ { input: overlay } ])
    .webp({ quality: 86 })
    .toFile(output)

console.log('map written', output)
