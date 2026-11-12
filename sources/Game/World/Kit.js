import * as THREE from 'three/webgpu'
import { color, texture, uniform, vec3, vec4 } from 'three/tsl'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import fontData from '../../data/lettersFont.json'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'

/**
 * Small building kit for the pieces of the world that are made in code
 * instead of in Blender: flat-coloured materials that take the world's
 * lighting, extruded physics letters and canvas textures.
 */
export class Kit
{
    // Colours picked from the world's palette texture
    static COLORS = {
        cream: '#fff2e8',
        sand: '#ebd1a3',
        stone: '#7c7691',
        stoneDark: '#575a5e',
        wood: '#b36d45',
        woodDark: '#4a413c',
        orange: '#e56202',
        red: '#ec3f1c',
        crimson: '#c30e3a',
        yellow: '#e4a90c',
        green: '#91ad78',
        blue: '#3dbbe7',
        purple: '#c366ef',
        pink: '#ed719f',
        ink: '#251f2b',
    }

    static flatMaterials = new Map()
    static font = null

    /**
     * Lit material with a single colour (cached per colour)
     */
    static flat(hex, { grid = true } = {})
    {
        const colorHex = hex in Kit.COLORS ? Kit.COLORS[hex] : hex
        const key = `${colorHex}:${grid}`

        if(Kit.flatMaterials.has(key))
            return Kit.flatMaterials.get(key)

        // The colour is a uniform, so every flat material compiles to the
        // same shader. That matters: Safari takes seconds per new shader.
        const material = new MeshDefaultMaterial({
            colorNode: uniform(color(colorHex)),
            hasGrid: grid,
            hasPulse: true,
        })

        // Tell the materials registry to leave it alone
        material.userData.prevent = true
        Kit.flatMaterials.set(key, material)

        return material
    }

    static glowMaterials = new Map()

    /**
     * Unlit material that glows (bright enough to bloom past intensity 1)
     */
    static glow(hex, intensity = 1.6)
    {
        const key = `${hex}:${intensity}`

        if(Kit.glowMaterials.has(key))
            return Kit.glowMaterials.get(key)

        const game = Game.getInstance()
        const material = new THREE.MeshBasicNodeMaterial()
        const glowColor = uniform(color(hex))
        const glowIntensity = uniform(intensity)
        const lit = glowColor.mul(glowIntensity)
        material.outputNode = vec4(MeshDefaultMaterial.revealDiscardNodeBuilder(game, game.fog.strength.mix(lit, game.fog.color)), 1)
        material.userData.prevent = true
        material.userData.intensity = glowIntensity
        Kit.glowMaterials.set(key, material)

        return material
    }

    /**
     * Lettering printed on the floor: takes the light and shadows of the
     * world, shows only where the texture is opaque
     */
    static decal(map)
    {
        const sample = texture(map)
        const material = new MeshDefaultMaterial({
            colorNode: sample.rgb,
            alphaNode: sample.a,
            normalNode: vec3(0, 1, 0),
            transparent: true,
            depthWrite: false,
            hasCoreShadows: false,
            hasWater: false,
            hasLightBounce: false,
            hasPulse: false,
            alphaTest: 0.02,
        })
        material.userData.prevent = true
        return material
    }

    /**
     * A picture that lights itself, like a display
     */
    static screen(map, brightness = 1)
    {
        const game = Game.getInstance()
        const material = new THREE.MeshBasicNodeMaterial()
        const level = uniform(brightness)
        material.outputNode = vec4(MeshDefaultMaterial.revealDiscardNodeBuilder(game, game.fog.strength.mix(texture(map).rgb.mul(level), game.fog.color)), 1)
        material.userData.prevent = true
        material.userData.level = level
        return material
    }

    /**
     * Named material from the world's shared list (palette, emissive gradients…)
     */
    static shared(name)
    {
        return Game.getInstance().materials.list.get(name)
    }

    static getFont()
    {
        if(!Kit.font)
            Kit.font = new FontLoader().parse(fontData)

        return Kit.font
    }

    /**
     * Extruded geometry for one character, centered on its own bounding box
     */
    static letterGeometry(character, size, depth)
    {
        const geometry = new TextGeometry(character, {
            font: Kit.getFont(),
            size: size,
            depth: depth,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: size * 0.02,
            bevelSize: size * 0.015,
            bevelSegments: 1,
        })
        geometry.computeBoundingBox()

        const box = geometry.boundingBox
        const dimensions = new THREE.Vector3()
        box.getSize(dimensions)

        const center = new THREE.Vector3()
        box.getCenter(center)
        geometry.translate(- center.x, - center.y, - center.z)
        geometry.computeBoundingBox()
        geometry.computeBoundingSphere()

        return { geometry, dimensions, offsetX: center.x }
    }

    /**
     * Measure a string set in the letters font (in world units)
     */
    static measure(text, size, tracking = 0)
    {
        const font = Kit.getFont()
        const scale = size / font.data.resolution
        let width = 0

        for(const character of text)
        {
            const glyph = font.data.glyphs[character] || font.data.glyphs['?']
            width += glyph.ha * scale + tracking
        }

        return width - tracking
    }

    /**
     * A row of physical letters standing on the ground that the vehicle can
     * knock over.
     *
     * `center` is the middle of the row on the ground, `rotationY` turns the
     * reading direction and `maxWidth` shrinks the letters until the row fits.
     */
    static physicalLetters({
        text,
        center,
        rotationY = 0,
        size = 1.7,
        depth = 0.44,
        tracking = 0.06,
        maxWidth = Infinity,
        colorName = 'cream',
        mass = 0.2,
        onCollision = null,
    })
    {
        const game = Game.getInstance()
        const font = Kit.getFont()

        // Shrink to fit
        let finalSize = size
        const naturalWidth = Kit.measure(text, size, tracking)
        if(naturalWidth > maxWidth)
            finalSize = size * maxWidth / naturalWidth

        const ratio = finalSize / size
        const finalDepth = depth * ratio
        const finalTracking = tracking * ratio
        const width = Kit.measure(text, finalSize, finalTracking)
        const scale = finalSize / font.data.resolution

        const material = Kit.flat(colorName)
        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationY)
        const objects = []

        let cursor = - width / 2

        for(const character of text)
        {
            const glyph = font.data.glyphs[character] || font.data.glyphs['?']
            const advance = glyph.ha * scale

            if(character !== ' ')
            {
                const { geometry, dimensions, offsetX } = Kit.letterGeometry(character, finalSize, finalDepth)

                const mesh = new THREE.Mesh(geometry, material)
                mesh.name = `letter${character}`

                // Local position along the row then into world space
                const position = new THREE.Vector3(cursor + offsetX, dimensions.y * 0.5 + 0.02, 0)
                position.applyQuaternion(quaternion)
                position.add(center)

                const physicalDescription = {
                    type: 'dynamic',
                    position: position,
                    rotation: quaternion,
                    sleeping: true,
                    mass: mass,
                    colliders: [
                        { shape: 'cuboid', parameters: [ dimensions.x * 0.5, dimensions.y * 0.5, dimensions.z * 0.5 ], category: 'object' }
                    ],
                }

                if(onCollision)
                {
                    physicalDescription.onCollision = onCollision
                    physicalDescription.contactThreshold = 5
                }

                const object = game.objects.add(
                    { model: mesh, updateMaterials: false },
                    physicalDescription
                )

                objects.push(object)
            }

            cursor += advance + finalTracking
        }

        return objects
    }

    /**
     * Canvas texture set up the same way as the world's label textures
     */
    static canvasTexture(width, height, draw, { filter = THREE.LinearFilter, colorSpace = THREE.SRGBColorSpace } = {})
    {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        draw(context, width, height)

        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = colorSpace
        texture.minFilter = filter
        texture.magFilter = filter
        texture.generateMipmaps = false
        texture.flipY = false
        texture.needsUpdate = true

        return texture
    }

    static DISPLAY = '"Unbounded"'
    static BODY = '"Space Grotesk"'

    /**
     * Wait for the two world typefaces, so canvases don't draw in a fallback
     */
    static async fonts()
    {
        const wanted = [ `800 40px ${Kit.DISPLAY}`, `700 40px ${Kit.DISPLAY}`, `500 40px ${Kit.BODY}`, `600 40px ${Kit.BODY}`, `700 40px ${Kit.BODY}` ]
        const timeout = new Promise(resolve => setTimeout(resolve, 2500))
        await Promise.race([ Promise.all(wanted.map(font => document.fonts.load(font).catch(() => {}))), timeout ])
    }

    /**
     * A block of text printed flat on the floor.
     *
     * `lines` is a list of { text, size (metres), family, weight, color, gap,
     * maxLines }. Text wraps at `width` metres. The mesh's origin is the top
     * corner on the aligned side (top middle when centred), its local +X is
     * the reading direction and it extends toward +Z.
     */
    static label({ lines, width, align = 'left', density = 60 })
    {
        const measureCanvas = Kit.measureCanvas ??= document.createElement('canvas')
        const measure = measureCanvas.getContext('2d')
        const rows = []
        let height = 0

        for(const line of lines)
        {
            if(!line.text)
                continue

            const size = line.size * density
            const font = `${line.weight ?? 600} ${size}px ${line.family ?? Kit.BODY}`
            measure.font = font
            if('letterSpacing' in measure)
                measure.letterSpacing = `${(line.tracking ?? 0) * size}px`

            // Wrap
            const words = String(line.text).split(' ')
            const wrapped = []
            let current = ''
            for(const word of words)
            {
                const attempt = current ? `${current} ${word}` : word
                if(measure.measureText(attempt).width > width * density && current)
                {
                    wrapped.push(current)
                    current = word
                }
                else
                    current = attempt
            }
            wrapped.push(current)

            if(line.maxLines && wrapped.length > line.maxLines)
            {
                wrapped.length = line.maxLines
                wrapped[line.maxLines - 1] = wrapped[line.maxLines - 1].replace(/[\s,.;:]+\S*$/, '') + '…'
            }

            height += (line.gap ?? 0.25) * density
            for(const text of wrapped)
            {
                rows.push({ text, font, size, color: line.color ?? '#eef2f7', tracking: (line.tracking ?? 0) * size, y: height })
                height += size * (line.leading ?? 1.22)
            }
        }

        const canvasWidth = Math.ceil(width * density)
        const canvasHeight = Math.ceil(height + density * 0.15)

        const map = Kit.canvasTexture(canvasWidth, canvasHeight, (context) =>
        {
            context.textBaseline = 'top'
            context.textAlign = align
            const x = align === 'left' ? 0 : align === 'right' ? canvasWidth : canvasWidth / 2

            for(const row of rows)
            {
                context.font = row.font
                if('letterSpacing' in context)
                    context.letterSpacing = `${row.tracking}px`
                context.fillStyle = row.color
                context.fillText(row.text, x, row.y + row.size * 0.12)
            }
        }, { filter: THREE.LinearFilter })

        map.generateMipmaps = true
        map.minFilter = THREE.LinearMipmapLinearFilter
        map.anisotropy = 8
        map.flipY = true
        map.needsUpdate = true

        const worldHeight = canvasHeight / density
        const geometry = new THREE.PlaneGeometry(width, worldHeight)
        geometry.rotateX(- Math.PI * 0.5)
        geometry.translate(align === 'left' ? width / 2 : align === 'right' ? - width / 2 : 0, 0, worldHeight / 2)

        const mesh = new THREE.Mesh(geometry, Kit.decal(map))
        mesh.receiveShadow = true
        mesh.renderOrder = 2
        mesh.userData.height = worldHeight

        return mesh
    }
}
