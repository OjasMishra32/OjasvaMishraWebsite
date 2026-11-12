import * as THREE from 'three/webgpu'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import { Kit } from '../Kit.js'
import { person } from '../../../data/profile.js'

// Logo outlines on a 24 unit grid
const LINKEDIN = 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z'
const GITHUB = 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z'

/**
 * The contact plaza: a row of logo blocks, one per way to reach me, behind a
 * row of letters you can drive through.
 */
export class SocialArea extends Area
{
    // The model's own sculptures are all removed: the links are built in
    // setLinks() from the real logos.
    static KEEP = []

    static prepare(model)
    {
        SocialArea.pedestals = new Map()

        for(const child of [...model.children])
        {
            const name = child.name.replace(/PhysicalDynamic.*$/i, '').toLowerCase()
            const isSculpture = /PhysicalDynamic/i.test(child.name)

            if(isSculpture && SocialArea.KEEP.includes(name))
            {
                SocialArea.pedestals.set(name, child.position.clone().add(model.position))
                continue
            }

            const isReference = /^ref(Center|Zone)/i.test(child.name)
            if(!isReference)
                child.removeFromParent()
        }

        return model
    }

    constructor(model)
    {
        super(SocialArea.prepare(model))

        this.center = this.references.items.get('center')[0].position.clone()
        this.center.y = 0

        this.setLinks()
        this.setLetters()
        this.setAchievement()
    }

    createPoint(position, label, align, url)
    {
        return this.game.interactivePoints.create(
            position,
            label,
            align,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                window.open(url, '_blank')
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    /**
     * One block per way to reach me, each the real logo on its own colour,
     * standing in a row behind the letters and leaning back to face the
     * camera. Drive up to one and press Enter.
     */
    setLinksVisible(visible)
    {
        for(const group of this.linkGroups ?? [])
            group.visible = visible
    }

    setLinks()
    {
        const links = [
            { name: 'Email', action: 'Email me', url: `mailto:${person.email}`, color: '#0a84ff', draw: SocialArea.drawMail },
            { name: 'LinkedIn', action: 'Open LinkedIn', url: person.links.linkedin, color: '#0a66c2', draw: SocialArea.drawPath(LINKEDIN) },
            { name: 'GitHub', action: 'Open GitHub', url: person.links.github, color: '#181b22', draw: SocialArea.drawPath(GITHUB) },
            { name: 'Instagram', action: 'Open Instagram', url: person.links.instagram, color: '#d6249f', draw: SocialArea.drawInstagram, background: SocialArea.instagramBackground },
            { name: 'Résumé', action: 'Open my résumé', url: person.resume, color: '#f2f4f8', ink: '#12151c', draw: SocialArea.drawDocument },
        ]

        const size = 1.9
        const spacing = 2.5
        const lean = - (Math.PI * 0.5 - this.game.view.spherical.phi)

        // Screen directions on the ground: right, and away from the camera
        const right = new THREE.Vector3(Math.SQRT1_2, 0, - Math.SQRT1_2)
        const back = new THREE.Vector3(- Math.SQRT1_2, 0, - Math.SQRT1_2)

        // Rounded square, used for the block and for its face
        const shape = new THREE.Shape()
        const half = size / 2
        const radius = size * 0.23
        shape.moveTo(- half + radius, - half)
        shape.lineTo(half - radius, - half)
        shape.quadraticCurveTo(half, - half, half, - half + radius)
        shape.lineTo(half, half - radius)
        shape.quadraticCurveTo(half, half, half - radius, half)
        shape.lineTo(- half + radius, half)
        shape.quadraticCurveTo(- half, half, - half, half - radius)
        shape.lineTo(- half, - half + radius)
        shape.quadraticCurveTo(- half, - half, - half + radius, - half)

        const blockGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 3, curveSegments: 10 })
        blockGeometry.translate(0, 0, - 0.56)

        const faceGeometry = new THREE.ShapeGeometry(shape, 10)
        const uv = faceGeometry.attributes.uv
        for(let i = 0; i < uv.count; i++)
            uv.setXY(i, uv.getX(i) / size + 0.5, uv.getY(i) / size + 0.5)

        const plateGeometry = new THREE.BoxGeometry(size, 0.5, 0.1)
        const plateFace = new THREE.PlaneGeometry(size, 0.5)
        const standGeometry = new THREE.BoxGeometry(0.5, 1, 0.3)

        // Kept so the row can step aside while a board in front of it is being read
        this.linkGroups = []

        // A phone at this stop sees the whole row
        const frameCenter = this.center.clone().addScaledVector(back, 1.6).addScaledVector(right, - 1.2)
        this.stopFrame = { x: frameCenter.x, z: frameCenter.z, width: (links.length - 1) * spacing + size + 1 }

        links.forEach((link, index) =>
        {
            const position = this.center.clone()
                .addScaledVector(back, 3.6)
                .addScaledVector(right, (index - (links.length - 1) / 2) * spacing - 1.2)

            const group = new THREE.Group()
            group.rotation.order = 'YXZ'
            group.rotation.y = Math.PI * 0.25
            group.rotation.x = lean
            group.position.set(position.x, 2, position.z)
            this.game.scene.add(group)
            this.linkGroups.push(group)

            // Block
            const block = new THREE.Mesh(blockGeometry, Kit.flat(link.color, { grid: false }))
            block.castShadow = true
            group.add(block)

            // Logo
            const resolution = 512
            const map = Kit.canvasTexture(resolution, resolution, (context) =>
            {
                if(link.background)
                    link.background(context, resolution)
                else
                {
                    context.fillStyle = link.color
                    context.fillRect(0, 0, resolution, resolution)
                }

                context.fillStyle = link.ink ?? '#ffffff'
                context.strokeStyle = link.ink ?? '#ffffff'
                link.draw(context, resolution)
            })
            map.flipY = true
            map.generateMipmaps = true
            map.minFilter = THREE.LinearMipmapLinearFilter
            map.anisotropy = 8
            map.needsUpdate = true

            const face = new THREE.Mesh(faceGeometry, Kit.screen(map, 0.96))
            face.position.z = 0.012
            group.add(face)

            // Name plate under the block
            const plateMap = Kit.canvasTexture(736, 194, (context) =>
            {
                context.fillStyle = '#12151c'
                context.fillRect(0, 0, 736, 194)
                context.fillStyle = '#f5f5f7'
                context.font = '700 92px system-ui, -apple-system, "Inter", sans-serif'
                context.textAlign = 'center'
                context.textBaseline = 'middle'
                context.fillText(link.name, 368, 101)
            })
            plateMap.flipY = true
            plateMap.generateMipmaps = true
            plateMap.minFilter = THREE.LinearMipmapLinearFilter
            plateMap.anisotropy = 8
            plateMap.needsUpdate = true

            const plate = new THREE.Mesh(plateGeometry, Kit.flat('#12151c', { grid: false }))
            plate.position.set(0, - size / 2 - 0.42, - 0.06)
            group.add(plate)

            const plateText = new THREE.Mesh(plateFace, Kit.screen(plateMap, 1))
            plateText.position.set(0, - size / 2 - 0.42, 0.001)
            group.add(plateText)

            // Stand
            const stand = new THREE.Mesh(standGeometry, Kit.flat('#12151c', { grid: false }))
            stand.rotation.y = Math.PI * 0.25
            stand.position.set(position.x - 0.35 * Math.SQRT1_2, 0.5, position.z - 0.35 * Math.SQRT1_2)
            stand.castShadow = true
            this.game.scene.add(stand)

            this.game.objects.add(null, {
                type: 'fixed',
                position: { x: position.x, y: 1, z: position.z },
                rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.25),
                friction: 0.3,
                colliders: [ { shape: 'cuboid', parameters: [ size / 2, 1, 0.45 ], category: 'floor' } ],
            })

            // In front of it, toward the camera
            const point = position.clone().addScaledVector(back, - 1.9)
            point.y = 1
            this.createPoint(point, link.action, InteractivePoints.ALIGN_RIGHT, link.url)
        })
    }

    /**
     * Logos. Each draws in white on a square of `size` pixels.
     */
    static drawPath(path)
    {
        return (context, size) =>
        {
            const scale = size * 0.62 / 24
            context.save()
            context.translate(size * 0.19, size * 0.19)
            context.scale(scale, scale)
            context.fill(new Path2D(path), 'evenodd')
            context.restore()
        }
    }

    static drawMail(context, size)
    {
        const x = size * 0.2
        const y = size * 0.3
        const width = size * 0.6
        const height = size * 0.4

        context.lineWidth = size * 0.05
        context.lineJoin = 'round'
        context.lineCap = 'round'
        context.beginPath()
        context.roundRect(x, y, width, height, size * 0.045)
        context.stroke()
        context.beginPath()
        context.moveTo(x + size * 0.02, y + size * 0.04)
        context.lineTo(x + width / 2, y + height * 0.56)
        context.lineTo(x + width - size * 0.02, y + size * 0.04)
        context.stroke()
    }

    static instagramBackground(context, size)
    {
        // The mark's own colours: yellow at the bottom left through pink to violet
        const gradient = context.createRadialGradient(size * 0.27, size * 1.07, 0, size * 0.27, size * 1.07, size * 1.25)
        gradient.addColorStop(0, '#fdf497')
        gradient.addColorStop(0.1, '#fdf497')
        gradient.addColorStop(0.45, '#fd5949')
        gradient.addColorStop(0.62, '#d6249f')
        gradient.addColorStop(0.92, '#285aeb')
        context.fillStyle = gradient
        context.fillRect(0, 0, size, size)
    }

    static drawInstagram(context, size)
    {
        context.lineWidth = size * 0.052
        context.beginPath()
        context.roundRect(size * 0.22, size * 0.22, size * 0.56, size * 0.56, size * 0.15)
        context.stroke()
        context.beginPath()
        context.arc(size * 0.5, size * 0.5, size * 0.135, 0, Math.PI * 2)
        context.stroke()
        context.beginPath()
        context.arc(size * 0.655, size * 0.345, size * 0.034, 0, Math.PI * 2)
        context.fill()
    }

    static drawDocument(context, size)
    {
        const x = size * 0.29
        const y = size * 0.2
        const width = size * 0.42
        const height = size * 0.6
        const fold = size * 0.13

        context.lineWidth = size * 0.045
        context.lineJoin = 'round'
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x + width - fold, y)
        context.lineTo(x + width, y + fold)
        context.lineTo(x + width, y + height)
        context.lineTo(x, y + height)
        context.closePath()
        context.stroke()

        for(let i = 0; i < 3; i++)
        {
            context.beginPath()
            context.moveTo(x + size * 0.08, y + size * (0.25 + i * 0.1))
            context.lineTo(x + width - size * 0.08, y + size * (0.25 + i * 0.1))
            context.stroke()
        }
    }

    setLetters()
    {
        this.letters = Kit.physicalLetters({
            text: 'SAY HI',
            center: this.center,
            rotationY: Math.PI * 0.14,
            size: 1.7,
            depth: 0.5,
            colorName: '#f2f5ff',
            mass: 0.2,
            onCollision: (force, position) =>
            {
                this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
            }
        })
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'social')
        })
    }
}
