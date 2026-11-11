import * as THREE from 'three/webgpu'
import { color, float, Fn, luminance, max, mix, positionGeometry, step, texture, uniform, uv, vec4 } from 'three/tsl'
import gsap from 'gsap'
import { clamp } from 'three/src/math/MathUtils.js'
import { Area } from './Area.js'
import { Kit } from '../Kit.js'
import { FONT_STACK } from '../../fonts.js'
import { timeline } from '../../../data/profile.js'

/**
 * The timeline: drive along it and each role lights up as you pass its dates.
 *
 * The lines are built in code from data/profile.js (`timeline`). The model
 * only provides the stones (one per colour, cloned as needed) and the year
 * counter.
 */
export class CareerArea extends Area
{
    // Distance driven per year. Recent years get more room: that's where
    // most of the roles are.
    static SCALE = [
        { from: 2019, to: 2023, unitsPerYear: 1 },
        { from: 2023, to: 2025, unitsPerYear: 2 },
        { from: 2025, to: 2027, unitsPerYear: 4.5 },
    ]

    /**
     * The model ships with ground tracks laid out for someone else's career
     */
    static prepare(model)
    {
        for(const child of [...model.children])
        {
            if(/^Plane\.?0?(18|22|35|49)$/.test(child.name))
                child.removeFromParent()
        }

        return model
    }

    static yearToDistance(year)
    {
        let distance = 0

        for(const segment of CareerArea.SCALE)
        {
            if(year <= segment.from)
                break

            distance += (Math.min(year, segment.to) - segment.from) * segment.unitsPerYear
        }

        return distance
    }

    static distanceToYear(distance)
    {
        let remaining = distance

        for(const segment of CareerArea.SCALE)
        {
            const length = (segment.to - segment.from) * segment.unitsPerYear

            if(remaining <= length)
                return segment.from + remaining / segment.unitsPerYear

            remaining -= length
        }

        return timeline.end
    }

    constructor(model)
    {
        super(CareerArea.prepare(model))

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '💼 Career',
                expanded: false,
            })
        }

        this.setSounds()
        this.setLines()
        this.setYears()
        this.setAchievement()
    }

    setSounds()
    {
        this.sounds = {}
        this.sounds.stoneOut = this.game.audio.register({
            path: 'sounds/stoneSlides/stoneSlideOut.mp3',
            autoplay: false,
            loop: false,
            volume: 0.3,
            antiSpam: 0.1,
            positions: new THREE.Vector3(),
            distanceFade: 14,
            onPlay: (item, line) =>
            {
                item.positions[0].copy(line.origin)
                item.rate = 1.2 + (line.index % 6) * 0.1
            }
        })
        this.sounds.stoneIn = this.game.audio.register({
            path: 'sounds/stoneSlides/stoneSlideIn.mp3',
            autoplay: false,
            loop: false,
            volume: 0.2,
            rate: 0.8,
            antiSpam: 0.1,
            positions: new THREE.Vector3(),
            distanceFade: 14,
            onPlay: (item, line) =>
            {
                item.positions[0].copy(line.origin)
            }
        })
    }

    /**
     * Label texture in the format the stones' shader expects:
     * red is the text, green is the dark panel behind each line.
     */
    createLabelTexture(lines)
    {
        const fontSize = 30
        const lineHeight = 38
        const padding = 10

        const measureCanvas = document.createElement('canvas')
        const measureContext = measureCanvas.getContext('2d')

        const fonts = lines.map((line, index) => `${index === 0 ? 700 : 500} ${fontSize}px ${FONT_STACK}`)
        const widths = lines.map((line, index) =>
        {
            measureContext.font = fonts[index]
            return Math.ceil(measureContext.measureText(line).width) + padding * 2
        })

        const width = Math.max(...widths)
        const height = lines.length * lineHeight

        const labelTexture = Kit.canvasTexture(width, height, (context) =>
        {
            context.fillStyle = '#000000'
            context.fillRect(0, 0, width, height)
            context.textBaseline = 'middle'
            context.textAlign = 'left'

            lines.forEach((line, index) =>
            {
                context.fillStyle = '#00ff00'
                context.fillRect(0, index * lineHeight, widths[index], lineHeight - 3)

                context.font = fonts[index]
                context.fillStyle = '#ff0000'
                context.fillText(line, padding, index * lineHeight + (lineHeight - 3) * 0.5 + 1)
            })
        }, { colorSpace: THREE.NoColorSpace })

        return { texture: labelTexture, aspect: width / height, lines: lines.length }
    }

    setLines()
    {
        this.lines = {}
        this.lines.items = []
        this.lines.activeElevation = 2.5
        this.lines.padding = 0.25
        this.lines.laneSpacing = 1.3

        const colors = {
            blue: uniform(color('#5390ff')),
            orange: uniform(color('#ff8039')),
            purple: uniform(color('#b65fff')),
        }
        const emissiveMaterials = {
            blue: Kit.shared('emissiveBlueRadialGradient'),
            orange: Kit.shared('emissiveOrangeRadialGradient'),
            purple: Kit.shared('emissivePurpleRadialGradient'),
        }

        // The model's own lines: keep one stone per colour as a template
        const templates = {}
        let startX = Infinity
        let startZ = - Infinity
        let groundY = 0

        for(const group of this.references.items.get('line'))
        {
            const name = group.userData.color
            const stone = group.children.find(child => child.name.startsWith('stone'))

            if(!templates[name])
                templates[name] = stone

            startX = Math.min(startX, group.position.x)
            startZ = Math.max(startZ, group.position.z)
            groundY = group.position.y

            group.removeFromParent()
        }

        this.lines.startZ = startZ
        this.lines.root = new THREE.Group()
        this.game.scene.add(this.lines.root)
        this.objects.hideable.push(this.lines.root)

        const trackMaterial = Kit.flat('#3b3542')
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

        const addBox = (material, x, y, z, width, height, depth) =>
        {
            const mesh = new THREE.Mesh(boxGeometry, material)
            mesh.position.set(x, y, z)
            mesh.scale.set(width, height, depth)
            mesh.receiveShadow = true
            this.lines.root.add(mesh)
            return mesh
        }

        let index = 0

        for(const data of timeline.lines)
        {
            const line = {}
            line.index = index++
            line.hasEnd = data.to !== null
            line.color = data.color

            const from = CareerArea.yearToDistance(data.from)
            const to = CareerArea.yearToDistance(line.hasEnd ? data.to : timeline.end)
            line.size = to - from

            const x = startX + data.lane * this.lines.laneSpacing
            const z = startZ - from
            line.origin = new THREE.Vector3(x, groundY, z)

            // Ground track: a dark bed, a glowing strip and a node at each end
            const centerZ = z - line.size * 0.5
            addBox(trackMaterial, x, groundY + 0.015, centerZ, 0.34, 0.05, line.size)
            addBox(emissiveMaterials[line.color], x, groundY + 0.03, centerZ, 0.1, 0.05, line.size)
            addBox(trackMaterial, x, groundY + 0.02, z, 0.62, 0.06, 0.62)
            addBox(emissiveMaterials[line.color], x, groundY + 0.04, z, 0.3, 0.06, 0.3)

            if(line.hasEnd)
            {
                addBox(trackMaterial, x, groundY + 0.02, z - line.size, 0.62, 0.06, 0.62)
                addBox(emissiveMaterials[line.color], x, groundY + 0.04, z - line.size, 0.3, 0.06, 0.3)
            }

            // Stone
            line.group = new THREE.Group()
            line.group.position.copy(line.origin)
            this.lines.root.add(line.group)

            line.stone = templates[line.color].clone(true)
            line.stone.position.set(0, 0, 0)
            line.group.add(line.stone)

            line.isIn = false
            line.isUp = false
            line.elevationTarget = 0
            line.offsetTarget = 0
            line.labelReveal = uniform(0)

            // Label
            {
                const label = this.createLabelTexture(data.label)
                line.textMesh = line.stone.children.find(child => child.name.startsWith('careerText'))

                const height = 0.153 * label.lines
                const width = height * label.aspect
                line.textMesh.scale.x = width
                line.textMesh.scale.z = height
                line.textMesh.position.x = width * 0.5 + 0.04

                const material = new THREE.MeshLambertNodeMaterial({ transparent: true })
                const baseColor = colors[line.color]

                material.outputNode = Fn(() =>
                {
                    const baseUv = uv().toVar()

                    step(baseUv.x, line.labelReveal).lessThan(0.5).discard()

                    const textureColor = texture(label.texture, baseUv)
                    const alpha = step(0.1, max(textureColor.r, textureColor.g))
                    const emissiveColor = baseColor.div(luminance(baseColor)).mul(1.7)
                    const maskColor = color('#251f2b')
                    const finalColor = mix(maskColor, emissiveColor, textureColor.r)

                    return vec4(finalColor, alpha)
                })()

                line.textMesh.castShadow = false
                line.textMesh.receiveShadow = false
                line.textMesh.material = material
            }

            this.lines.items.push(line)
        }
    }

    setYears()
    {
        this.year = {}
        this.year.group = this.references.items.get('year')[0]
        this.year.group.position.z = this.lines.startZ
        this.year.originZ = this.year.group.position.z
        this.year.size = CareerArea.yearToDistance(timeline.end)
        this.year.offsetTarget = 0
        this.year.start = timeline.start
        this.year.current = this.year.start

        //    Digit indexes
        //
        //      --- 0 ---
        //    |           |
        //    5           1
        //    |           |
        //      --- 6 ---
        //    |           |
        //    4           2
        //    |           |
        //      --- 3 ---

        const a = 255

        const digitData = new Uint8Array([
            a, a, a, a, a, a, 0, // 0
            0, a, a, 0, 0, 0, 0, // 1
            a, a, 0, a, a, 0, a, // 2
            a, a, a, a, 0, 0, a, // 3
            0, a, a, 0, 0, a, a, // 4
            a, 0, a, a, 0, a, a, // 5
            a, 0, a, a, a, a, a, // 6
            a, a, a, 0, 0, 0, 0, // 7
            a, a, a, a, a, a, a, // 8
            a, a, a, a, 0, a, a, // 9
        ])

        this.year.digitsTexture = new THREE.DataTexture(
            digitData,
            7,
            10,
            THREE.RedFormat,
            THREE.UnsignedByteType,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
            THREE.NearestFilter,
            THREE.NearestFilter
        )
        this.year.digitsTexture.generateMipmaps = false
        this.year.digitsTexture.needsUpdate = true

        this.year.digits = []

        const digitMeshes = this.year.group.children.filter(child => child.name.startsWith('digit'))

        for(const mesh of digitMeshes)
        {
            const digit = {}
            digit.mesh = mesh
            digit.indexUniform = uniform(0)

            const material = new THREE.MeshBasicNodeMaterial()
            material.outputNode = vec4(1.7)

            material.positionNode = Fn(() =>
            {
                const barUv = uv(1).toVar()

                const uvY = digit.indexUniform.div(10).add(float(0.5).div(10))
                barUv.y.assign(uvY)

                const barActive = texture(this.year.digitsTexture, barUv).r

                const newPosition = positionGeometry.toVar()
                newPosition.y.subAssign(barActive.oneMinus())

                return newPosition
            })()

            digit.mesh.material = material

            this.year.digits.push(digit)
        }

        this.year.updateDigits = (year) =>
        {
            const yearString = `${year}`
            let i = 0
            for(const digit of this.year.digits)
            {
                digit.indexUniform.value = parseInt(yearString[i])
                i++
            }
        }

        this.year.updateDigits(this.year.current)
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'career')
        })
    }

    update()
    {
        // Lines
        for(const line of this.lines.items)
        {
            const delta = line.origin.z - this.game.player.position.z

            // Is in
            if(delta > - this.lines.padding && delta < line.size + this.lines.padding * 2)
            {
                if(!line.isIn)
                {
                    line.isIn = true
                    gsap.to(line.labelReveal, { value: 1, duration: 1, delay: 0.3, overwrite: true, ease: 'power2.inOut' })
                }
            }

            // Is out
            else
            {
                if(line.isIn)
                {
                    line.isIn = false
                    gsap.to(line.labelReveal, { value: 0, duration: 1, overwrite: true, ease: 'power2.inOut' })
                }
            }

            // Elevation
            if(line.isIn)
            {
                if(!line.isUp)
                {
                    line.isUp = true
                    this.sounds.stoneOut.play(line)
                }
            }
            else if(line.isUp)
            {
                line.isUp = false
                gsap.delayedCall(0.3, () =>
                {
                    this.sounds.stoneIn.play(line)
                })
            }

            line.elevationTarget = line.isUp ? this.lines.activeElevation : 0
            line.stone.position.y += (line.elevationTarget - line.stone.position.y) * this.game.ticker.deltaScaled * 3

            // Position: the stone follows the vehicle along its line
            if(line.isIn)
            {
                if(line.stone.position.y > 1)
                    line.offsetTarget = - clamp(delta, 0, line.size)
            }
            else
            {
                line.offsetTarget = delta > line.size ? - line.size : 0
            }

            line.stone.position.z += (line.offsetTarget - line.stone.position.z) * this.game.ticker.deltaScaled * 10
        }

        // Year
        const delta = this.year.originZ - this.game.player.position.z
        this.year.offsetTarget = clamp(delta, 0, this.year.size)

        const finalPositionZ = this.year.originZ - this.year.offsetTarget
        this.year.group.position.z += (finalPositionZ - this.year.group.position.z) * this.game.ticker.deltaScaled * 10

        const yearCurrent = Math.min(timeline.end - 1, Math.floor(CareerArea.distanceToYear(this.year.offsetTarget) + 0.0001))

        if(yearCurrent !== this.year.current)
        {
            this.year.current = yearCurrent
            this.year.updateDigits(this.year.current)
        }
    }
}
