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
 * The set pieces along the route: a Franka Emika Panda arm that follows the
 * rover and a terminal that keeps running out of usage. Where they stand is
 * in data/route.js.
 */
export class Machines
{
    constructor()
    {
        this.game = Game.getInstance()

        this.setArm()
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
     * Robot arm: a Franka Emika Panda (the model is the official robot
     * description, see scripts/build-panda.mjs). Its first joint turns the
     * arm to face the rover, and it reaches toward the rover as it comes
     * close. The joints are the robot's real ones, moved within their limits.
     */
    setArm()
    {
        const { x, z } = machines.arm
        const scale = 6
        const facing = Math.PI * 0.5 // the arm's resting direction points at the path

        const root = new THREE.Group()
        root.position.set(x, 0.3, z)
        root.rotation.y = facing
        root.scale.setScalar(scale)
        this.game.scene.add(root)

        const model = this.game.resources.pandaModel.scene
        root.add(model)

        // The model's five materials, as the world's own
        const paint = {
            white: Kit.flat('#f4f5f7', PLAIN),
            off_white: Kit.flat('#dfe4e8', PLAIN),
            black: Kit.flat('#2b2e34', PLAIN),
            green: Kit.glow('#30d158', 2.2),
            light_blue: Kit.glow('#1e9bff', 2.2),
        }

        model.traverse((child) =>
        {
            if(!child.isMesh)
                return

            child.material = paint[child.material.name] ?? paint.white
            child.castShadow = true
            child.receiveShadow = true
        })

        // Joints: each link turns about its own Z from its resting orientation
        const joints = []
        for(let i = 1; i <= 7; i++)
        {
            const node = model.getObjectByName(`link${i}`)
            joints.push({ node, rest: node.quaternion.clone() })
        }

        const fingers = [ 'left_finger', 'right_finger' ].map((name, index) =>
        {
            const node = model.getObjectByName(name)
            return { node, rest: node.position.clone(), direction: index === 0 ? 1 : - 1 }
        })

        // Plinth
        this.mesh(new THREE.BoxGeometry(2.2, 0.3, 2.2), '#12151c', this.game.scene, x, 0.15, z)
        this.solid(x, z, 1.1, 0.6, 1.1)

        this.arm = {
            facing,
            joints,
            fingers,
            angles: [ 0, - 0.785, 0, - 2.356, 0, 1.571, 0.785 ],
            grip: 0.02,
            axis: new THREE.Vector3(0, 0, 1),
            turn: new THREE.Quaternion(),
        }
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
            const near = distance < 20

            // Three poses, in joint angles: resting, reaching far, reaching close
            const READY = [ 0, - 0.785, 0, - 2.356, 0, 1.571, 0.785 ]
            const FAR = [ 0, 0.62, 0, - 1.5, 0, 2.15, 0.785 ]
            const CLOSE = [ 0, 0.05, 0, - 2.45, 0, 2.5, 0.785 ]

            let target = READY
            let blend = 0

            if(near)
            {
                // Within reach the hand follows the rover in; further out it stretches toward it
                const reach = THREE.MathUtils.clamp((distance - 2.6) / 2.2, 0, 1)
                const interest = THREE.MathUtils.smoothstep(distance, 9, 5)
                target = FAR.map((angle, index) => THREE.MathUtils.lerp(CLOSE[index], angle, reach))
                blend = 1 - interest
            }

            const goal = target.map((angle, index) => THREE.MathUtils.lerp(angle, READY[index], near ? blend : 1))

            // Joint 1 faces the rover, or sweeps slowly when nobody is around
            let yaw = near ? Math.atan2(- dz, dx) - state.facing : Math.sin(time * 0.12) * 1.1
            yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw))
            goal[0] = THREE.MathUtils.clamp(yaw, - 2.8, 2.8)

            // A little life while idle
            if(!near)
            {
                goal[1] += Math.sin(time * 0.31) * 0.12
                goal[3] += Math.sin(time * 0.23) * 0.15
            }

            const ease = Math.min(1, delta * 1.7)
            state.angles.forEach((angle, index) =>
            {
                state.angles[index] = angle + (goal[index] - angle) * ease
                const joint = state.joints[index]
                joint.node.quaternion.copy(joint.rest).multiply(state.turn.setFromAxisAngle(state.axis, state.angles[index]))
            })

            // The gripper opens as the rover comes close
            const grip = near && distance < 6 ? 0.04 : 0.012
            state.grip += (grip - state.grip) * ease
            for(const finger of state.fingers)
                finger.node.position.set(finger.rest.x, finger.rest.y + state.grip * finger.direction, finger.rest.z)
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
