import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import { InteractivePoints } from '../InteractivePoints.js'
import { Kit } from './Kit.js'
import { machines } from '../../data/route.js'

const SHELL = '#eef1f6'
const JOINT = '#1b1f27'
const CYAN = '#5fd4ff'
const PLAIN = { grid: false }

/**
 * The moving set pieces along the route: a robot arm that follows the rover,
 * a drone on patrol and a terminal that keeps running out of usage.
 * All three are built from primitives and animated here; where they stand
 * is in data/route.js.
 */
export class Machines
{
    constructor()
    {
        this.game = Game.getInstance()

        this.setArm()
        this.setDrone()
        this.setTerminal()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 9)
    }

    mesh(geometry, hex, parent, x = 0, y = 0, z = 0)
    {
        const mesh = new THREE.Mesh(geometry, Kit.flat(hex, PLAIN))
        mesh.position.set(x, y, z)
        mesh.castShadow = true
        mesh.receiveShadow = true
        parent.add(mesh)
        return mesh
    }

    solid(x, z, halfX, halfY, halfZ, yaw = 0)
    {
        this.game.objects.add(null, {
            type: 'fixed',
            position: { x, y: halfY, z },
            rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw),
            friction: 0.3,
            colliders: [ { shape: 'cuboid', parameters: [ halfX, halfY, halfZ ], category: 'floor' } ],
        })
    }

    /**
     * Robot arm: a turret, two links and a sensor head. It turns to face the
     * rover and reaches toward it when the rover comes close.
     */
    setArm()
    {
        const { x, z } = machines.arm
        const root = new THREE.Group()
        root.position.set(x, 0, z)
        this.game.scene.add(root)

        this.arm = {
            upper: 3.1,
            fore: 2.7,
            shoulderHeight: 1.75,
            yaw: 0,
            q1: 1.9,
            q2: - 1.6,
        }
        const arm = this.arm

        // Base
        this.mesh(new THREE.CylinderGeometry(1.45, 1.65, 0.55, 32), JOINT, root, 0, 0.275, 0)
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.05, 8, 48), Kit.glow(CYAN, 2.4))
        ring.rotation.x = Math.PI * 0.5
        ring.position.y = 0.57
        root.add(ring)

        // Turret
        arm.turret = new THREE.Group()
        root.add(arm.turret)
        this.mesh(new THREE.CylinderGeometry(0.9, 1.05, 0.85, 28), SHELL, arm.turret, 0, 0.97, 0)

        const shoulderCap = new THREE.CylinderGeometry(0.62, 0.62, 1.25, 24)
        shoulderCap.rotateX(Math.PI * 0.5)
        this.mesh(shoulderCap, JOINT, arm.turret, 0, arm.shoulderHeight, 0)

        // Upper arm
        arm.shoulder = new THREE.Group()
        arm.shoulder.position.y = arm.shoulderHeight
        arm.turret.add(arm.shoulder)
        this.mesh(new THREE.BoxGeometry(0.7, arm.upper, 0.78), SHELL, arm.shoulder, 0, arm.upper / 2, 0)
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.72, arm.upper * 0.5, 0.12), Kit.glow(CYAN, 1.8))
        stripe.position.set(0, arm.upper * 0.5, 0)
        arm.shoulder.add(stripe)

        // Elbow and forearm
        arm.elbow = new THREE.Group()
        arm.elbow.position.y = arm.upper
        arm.shoulder.add(arm.elbow)
        const elbowCap = new THREE.CylinderGeometry(0.46, 0.46, 1, 24)
        elbowCap.rotateX(Math.PI * 0.5)
        this.mesh(elbowCap, JOINT, arm.elbow)
        this.mesh(new THREE.BoxGeometry(0.54, arm.fore, 0.6), SHELL, arm.elbow, 0, arm.fore / 2, 0)

        // Wrist and sensor head: the lenses look along the head's +X
        arm.wrist = new THREE.Group()
        arm.wrist.position.y = arm.fore
        arm.elbow.add(arm.wrist)
        const wristCap = new THREE.CylinderGeometry(0.34, 0.34, 0.8, 20)
        wristCap.rotateX(Math.PI * 0.5)
        this.mesh(wristCap, JOINT, arm.wrist)
        this.mesh(new THREE.BoxGeometry(1.1, 0.74, 0.92), SHELL, arm.wrist, 0.4, 0, 0)
        this.mesh(new THREE.BoxGeometry(0.1, 0.54, 0.7), JOINT, arm.wrist, 0.97, 0, 0)

        const lensGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 20)
        lensGeometry.rotateZ(Math.PI * 0.5)
        for(const side of [ - 1, 1 ])
        {
            const lens = new THREE.Mesh(lensGeometry, Kit.glow(CYAN, 3))
            lens.position.set(1.03, 0, side * 0.18)
            arm.wrist.add(lens)
        }

        this.solid(x, z, 1.45, 0.5, 1.45)
    }

    /**
     * Drone: flies a slow loop over the route
     */
    setDrone()
    {
        const root = new THREE.Group()
        this.game.scene.add(root)

        const tilt = new THREE.Group()
        root.add(tilt)

        this.mesh(new THREE.BoxGeometry(1.5, 0.42, 1), SHELL, tilt)
        this.mesh(new THREE.BoxGeometry(0.5, 0.3, 0.7), JOINT, tilt, 0.72, - 0.02, 0)

        const light = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.5), Kit.glow(CYAN, 3))
        light.position.y = - 0.24
        tilt.add(light)

        const rotors = []
        const bladeGeometry = new THREE.BoxGeometry(1.4, 0.035, 0.14)
        const guardGeometry = new THREE.TorusGeometry(0.76, 0.035, 6, 28)
        const boomGeometry = new THREE.BoxGeometry(1.5, 0.12, 0.16)
        const motorGeometry = new THREE.CylinderGeometry(0.16, 0.2, 0.34, 12)

        for(const [ x, z ] of [ [ 1, 1 ], [ 1, - 1 ], [ - 1, 1 ], [ - 1, - 1 ] ])
        {
            const boom = this.mesh(boomGeometry, JOINT, tilt, x * 0.75, 0.05, z * 0.75)
            boom.rotation.y = - Math.atan2(z, x)

            this.mesh(motorGeometry, JOINT, tilt, x * 1.25, 0.16, z * 1.25)

            const guard = this.mesh(guardGeometry, SHELL, tilt, x * 1.25, 0.34, z * 1.25)
            guard.rotation.x = Math.PI * 0.5

            const rotor = this.mesh(bladeGeometry, JOINT, tilt, x * 1.25, 0.36, z * 1.25)
            rotor.userData.direction = x * z
            rotors.push(rotor)
        }

        this.drone = { root, tilt, rotors, angle: 0 }
    }

    /**
     * The terminal: three coding assistants and their usage limits. Every
     * prompt uses one up; when all three are out, that's the day.
     */
    setTerminal()
    {
        const { x, z } = machines.terminal
        const width = 5.4
        const height = width * 640 / 1024
        const lean = - (Math.PI * 0.5 - this.game.view.spherical.phi)

        const state = this.terminal = {
            tools: [
                { name: 'Claude Code', left: 1, lines: [ 'You\'re absolutely right!', 'Let me try a different approach.', 'Compacting conversation…' ] },
                { name: 'Codex', left: 1, lines: [ 'Thinking for 4m 12s…', 'Applied patch. Did not run tests.' ] },
                { name: 'Cursor', left: 1, lines: [ 'Tab. Tab. Tab. Tab.', 'Slow request. You are #847 in line.' ] },
            ],
            log: [ 'Send a prompt. See how far you get.' ],
            prompts: 0,
            resetIn: 0,
        }

        // Screen
        state.map = Kit.canvasTexture(1024, 640, () => {})
        state.map.flipY = true
        state.map.generateMipmaps = true
        state.map.minFilter = THREE.LinearMipmapLinearFilter
        state.map.anisotropy = 8

        const group = new THREE.Group()
        group.rotation.order = 'YXZ'
        group.rotation.y = Math.PI * 0.25
        group.rotation.x = lean
        group.position.set(x, 1.75, z)
        this.game.scene.add(group)

        this.mesh(new THREE.BoxGeometry(width + 0.3, height + 0.3, 0.2), '#12151c', group)
        const face = new THREE.Mesh(new THREE.PlaneGeometry(width, height), Kit.screen(state.map, 1))
        face.position.z = 0.105
        group.add(face)

        const strip = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.07, 0.24), Kit.glow('#ff9f0a', 2.2))
        strip.position.y = height / 2 + 0.19
        group.add(strip)

        // Stand
        const stand = new THREE.Group()
        stand.rotation.y = Math.PI * 0.25
        stand.position.set(x, 0, z)
        this.game.scene.add(stand)
        this.mesh(new THREE.BoxGeometry(width * 0.7, 0.9, 0.5), '#12151c', stand, 0, 0.45, - 0.25)
        this.mesh(new THREE.BoxGeometry(width + 0.3, 0.16, 1.5), '#12151c', stand, 0, 0.08, - 0.1)

        this.solid(x, z, width / 2 + 0.15, 0.8, 0.6, Math.PI * 0.25)

        this.drawTerminal()

        // Standing in front of it (toward the camera)
        const buttons = this.game.inputs.interactiveButtons
        this.game.interactivePoints.create(
            new THREE.Vector3(x + 2.3, 1, z + 2.3),
            'Send a prompt',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () => { this.prompt() },
            () => { buttons.addItems([ 'interact' ]) },
            () => { buttons.removeItems([ 'interact' ]) },
            () => { buttons.removeItems([ 'interact' ]) }
        )
    }

    prompt()
    {
        const state = this.terminal
        const index = state.tools.findIndex(tool => tool.left > 0)

        // Everything is used up
        if(index === - 1)
        {
            state.log.push('Still rate limited. Go outside.')
            this.drawTerminal()
            return
        }

        const tool = state.tools[index]
        state.prompts++
        state.log.push(`${tool.name}: ${tool.lines[state.prompts % tool.lines.length]}`)
        tool.left = Math.max(0, tool.left - (0.34 + ((state.prompts * 37) % 17) / 100))

        if(tool.left < 0.06)
        {
            tool.left = 0
            const next = state.tools[index + 1]

            if(next)
                state.log.push(`${tool.name} limit reached. Switching to ${next.name}.`)
            else
            {
                state.log.push('All three limits reached. Writing it by hand.')
                state.resetIn = 30

                if(this.game.world.confetti)
                {
                    const { x, z } = machines.terminal
                    this.game.world.confetti.pop(new THREE.Vector3(x, 2.5, z))
                }
            }
        }

        this.drawTerminal()
    }

    drawTerminal()
    {
        const state = this.terminal
        const context = state.map.image.getContext('2d')
        const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'
        const sans = 'system-ui, -apple-system, "Inter", sans-serif'

        context.fillStyle = '#0b0d12'
        context.fillRect(0, 0, 1024, 640)

        // Header
        context.textBaseline = 'alphabetic'
        context.textAlign = 'left'
        context.fillStyle = '#f5f5f7'
        context.font = `800 58px ${sans}`
        context.fillText('My coworkers', 56, 96)
        context.textAlign = 'right'
        context.fillStyle = '#8e8e93'
        context.font = `600 26px ${sans}`
        context.fillText(state.resetIn > 0 ? `resets in ${Math.ceil(state.resetIn)}s` : '5-hour usage window', 968, 92)

        // One bar per tool
        state.tools.forEach((tool, index) =>
        {
            const y = 150 + index * 92
            const out = tool.left <= 0

            context.textAlign = 'left'
            context.fillStyle = out ? '#8e8e93' : '#f5f5f7'
            context.font = `700 34px ${sans}`
            context.fillText(tool.name, 56, y + 40)

            context.fillStyle = '#23262e'
            context.beginPath()
            context.roundRect(320, y + 12, 440, 32, 16)
            context.fill()

            if(!out)
            {
                context.fillStyle = tool.left > 0.5 ? '#30d158' : tool.left > 0.2 ? '#ffd60a' : '#ff453a'
                context.beginPath()
                context.roundRect(320, y + 12, Math.max(32, 440 * tool.left), 32, 16)
                context.fill()
            }

            context.textAlign = 'right'
            context.fillStyle = out ? '#ff453a' : '#f5f5f7'
            context.font = `700 30px ${sans}`
            context.fillText(out ? 'limit reached' : `${Math.round(tool.left * 100)}% left`, 968, y + 39)
        })

        // Log
        context.fillStyle = '#14171e'
        context.beginPath()
        context.roundRect(40, 440, 944, 168, 22)
        context.fill()

        const lines = state.log.slice(- 3)
        context.textAlign = 'left'
        context.font = `500 29px ${mono}`
        lines.forEach((line, index) =>
        {
            context.fillStyle = index === lines.length - 1 ? '#f5f5f7' : '#6e6e73'
            context.fillText(`> ${line}`, 68, 492 + index * 46)
        })

        state.map.needsUpdate = true
    }

    update()
    {
        const delta = this.game.ticker.deltaScaled
        const time = this.game.ticker.elapsedScaled
        const player = this.game.player

        /**
         * Arm
         */
        {
            const state = this.arm
            const dx = (player ? player.position.x : 1000) - machines.arm.x
            const dz = (player ? player.position.z : 1000) - machines.arm.z
            const distance = Math.hypot(dx, dz)
            const near = distance < 22

            // Face the rover, or sweep slowly when nobody is around
            const targetYaw = near ? Math.atan2(- dz, dx) : Math.sin(time * 0.12) * 1.2
            let yawDelta = targetYaw - state.yaw
            yawDelta = Math.atan2(Math.sin(yawDelta), Math.cos(yawDelta))
            state.yaw += yawDelta * Math.min(1, delta * 1.6)

            // Reach toward a point above the rover (two-link inverse kinematics)
            const reach = near ? THREE.MathUtils.clamp(distance - 2, 1.9, 4.8) : 3 + Math.sin(time * 0.31) * 0.8
            const height = (near ? 2.2 : 3.4 + Math.sin(time * 0.23) * 0.7) - state.shoulderHeight
            const span = THREE.MathUtils.clamp(Math.hypot(reach, height), Math.abs(state.upper - state.fore) + 0.2, state.upper + state.fore - 0.2)

            const elbowAngle = Math.acos(THREE.MathUtils.clamp((state.upper ** 2 + state.fore ** 2 - span ** 2) / (2 * state.upper * state.fore), - 1, 1))
            const lift = Math.acos(THREE.MathUtils.clamp((state.upper ** 2 + span ** 2 - state.fore ** 2) / (2 * state.upper * span), - 1, 1))
            const q1 = Math.atan2(height, reach) + lift
            const q2 = - (Math.PI - elbowAngle)

            const ease = Math.min(1, delta * 1.8)
            state.q1 += (q1 - state.q1) * ease
            state.q2 += (q2 - state.q2) * ease

            state.turret.rotation.y = state.yaw
            state.shoulder.rotation.z = state.q1 - Math.PI * 0.5
            state.elbow.rotation.z = state.q2
            state.wrist.rotation.z = (near ? - 0.55 : - 0.2) - (state.q1 - Math.PI * 0.5 + state.q2)
        }

        /**
         * Drone
         */
        {
            const state = this.drone
            const loop = machines.drone
            state.angle += delta * 0.09

            const x = loop.x + Math.cos(state.angle) * loop.radiusX
            const z = loop.z + Math.sin(state.angle) * loop.radiusZ
            const velocityX = - Math.sin(state.angle) * loop.radiusX
            const velocityZ = Math.cos(state.angle) * loop.radiusZ

            state.root.position.set(x, loop.height + Math.sin(time * 0.9) * 0.35, z)
            state.root.rotation.y = Math.atan2(- velocityZ, velocityX)
            state.tilt.rotation.z = - 0.16
            state.tilt.rotation.x = Math.sin(time * 0.7) * 0.05

            for(const rotor of state.rotors)
                rotor.rotation.y += delta * 26 * rotor.userData.direction
        }

        /**
         * Terminal: limits come back after a while
         */
        {
            const state = this.terminal

            if(state.resetIn > 0)
            {
                const before = Math.ceil(state.resetIn)
                state.resetIn -= this.game.ticker.delta

                if(state.resetIn <= 0)
                {
                    for(const tool of state.tools)
                        tool.left = 1
                    state.log.push('Limits reset. Back to work.')
                    this.drawTerminal()
                }
                else if(Math.ceil(state.resetIn) !== before)
                    this.drawTerminal()
            }
        }
    }
}
