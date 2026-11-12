/**
 * The site's icon and the pictures that stand for the world outside it:
 * the browser tab and home-screen icons, the image link previews show, and
 * the four stills on the first screen.
 *
 * The icon is the rover's face: the white shell, the dark visor, two eyes.
 * The stills come from scripts/shots/world (captured with the interface
 * hidden).
 *
 * Run: node scripts/build-icons.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = (file) => path.join(root, 'static', file)

// `radius` rounds the tile (0 where the system crops it itself), `inset` shrinks the face for maskable icons
const face = (radius = 14, inset = 0) =>
{
    const scale = 1 - inset * 2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="${radius}" fill="#0b0d14"/>
    <g transform="translate(${64 * inset} ${64 * inset}) scale(${scale})">
        <rect x="14" y="41" width="10" height="8" rx="3.5" fill="#2b303b"/>
        <rect x="40" y="41" width="10" height="8" rx="3.5" fill="#2b303b"/>
        <rect x="10" y="17" width="44" height="28" rx="11" fill="#f3f5f9"/>
        <rect x="15" y="23" width="34" height="14" rx="7" fill="#151820"/>
        <rect x="22" y="26.5" width="5.5" height="7" rx="2.2" fill="#5fd4ff"/>
        <rect x="36.5" y="26.5" width="5.5" height="7" rx="2.2" fill="#5fd4ff"/>
    </g>
</svg>`
}

const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 * size / 64 * 4 }).resize(size, size).png().toBuffer()

// An .ico is a small directory followed by ordinary PNG files
const ico = (images) =>
{
    const header = Buffer.alloc(6)
    header.writeUInt16LE(1, 2)
    header.writeUInt16LE(images.length, 4)

    let offset = 6 + images.length * 16
    const entries = images.map(({ size, data }) =>
    {
        const entry = Buffer.alloc(16)
        entry.writeUInt8(size === 256 ? 0 : size, 0)
        entry.writeUInt8(size === 256 ? 0 : size, 1)
        entry.writeUInt16LE(1, 4)
        entry.writeUInt16LE(32, 6)
        entry.writeUInt32LE(data.length, 8)
        entry.writeUInt32LE(offset, 12)
        offset += data.length
        return entry
    })

    return Buffer.concat([ header, ...entries, ...images.map(image => image.data) ])
}

fs.writeFileSync(out('favicons/favicon.svg'), face())
fs.writeFileSync(out('favicons/favicon-96x96.png'), await png(face(), 96))
fs.writeFileSync(out('favicons/apple-touch-icon.png'), await png(face(0, 0.04), 180))
fs.writeFileSync(out('favicons/web-app-manifest-192x192.png'), await png(face(0, 0.1), 192))
fs.writeFileSync(out('favicons/web-app-manifest-512x512.png'), await png(face(0, 0.1), 512))
fs.writeFileSync(out('favicons/favicon.ico'), ico([ { size: 32, data: await png(face(), 32) }, { size: 48, data: await png(face(), 48) } ]))
console.log('icons')

// Stills for the first screen, and the link preview
const shots = path.join(root, 'scripts/shots/world')

for(const [ index, name ] of [ 'start', 'experience', 'board', 'contact' ].entries())
    await sharp(path.join(shots, `${name}.png`)).resize({ width: 1120 }).webp({ quality: 78 }).toFile(out(`ui/previews/world-${index + 1}.webp`))

await sharp(path.join(shots, 'start.png')).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 88, mozjpeg: true }).toFile(out('social/share-image.jpg'))
console.log('stills and share image')
