// Converts static/fonts/Pally-Bold.ttf into the typeface JSON that Three.js
// TextGeometry reads, keeping only the glyphs the world's 3D letters need.
//
// Usage: node scripts/build-font.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const input = path.join(here, '../static/fonts/Pally-Bold.ttf')
const output = path.join(here, '../sources/data/lettersFont.json')
const keep = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&!?.\'+ '

const buffer = readFileSync(input)
const source = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))

// Same output format as Three.js TTFLoader
const round = Math.round
const scale = 100000 / ((source.unitsPerEm || 2048) * 72)
const font = {
    glyphs: {},
    familyName: source.getEnglishName('fullName'),
    ascender: round(source.ascender * scale),
    descender: round(source.descender * scale),
    underlinePosition: source.tables.post.underlinePosition,
    underlineThickness: source.tables.post.underlineThickness,
    boundingBox: {
        xMin: source.tables.head.xMin,
        xMax: source.tables.head.xMax,
        yMin: source.tables.head.yMin,
        yMax: source.tables.head.yMax,
    },
    resolution: 1000,
    original_font_information: source.tables.name,
}

for(const character of keep)
{
    const glyph = source.charToGlyph(character)
    const token = { ha: round(glyph.advanceWidth * scale), x_min: round(glyph.xMin * scale), x_max: round(glyph.xMax * scale), o: '' }

    for(const command of glyph.path.commands)
    {
        const type = command.type.toLowerCase() === 'c' ? 'b' : command.type.toLowerCase()
        token.o += type + ' '

        if(command.x !== undefined && command.y !== undefined)
            token.o += round(command.x * scale) + ' ' + round(command.y * scale) + ' '
        if(command.x1 !== undefined && command.y1 !== undefined)
            token.o += round(command.x1 * scale) + ' ' + round(command.y1 * scale) + ' '
        if(command.x2 !== undefined && command.y2 !== undefined)
            token.o += round(command.x2 * scale) + ' ' + round(command.y2 * scale) + ' '
    }

    font.glyphs[character] = token
}

writeFileSync(output, JSON.stringify(font))
console.log(`${Object.keys(font.glyphs).length} glyphs → ${output}`)
