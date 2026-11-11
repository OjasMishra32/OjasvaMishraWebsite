import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
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
    static flat(hex)
    {
        const key = hex in Kit.COLORS ? Kit.COLORS[hex] : hex

        if(Kit.flatMaterials.has(key))
            return Kit.flatMaterials.get(key)

        const material = new MeshDefaultMaterial({ colorNode: color(key), hasGrid: true })

        // Tell the materials registry to leave it alone
        material.userData.prevent = true
        Kit.flatMaterials.set(key, material)

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
}
