import * as THREE from 'three/webgpu'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { Kit } from './Kit.js'

const SHELL = '#f3f5f9'
const GRAPHITE = '#1a1d24'
const TIRE = '#101216'
const STEEL = '#8d96a5'
const CYAN = '#5fd4ff'

/**
 * The vehicle: a small robot, modelled in code.
 *
 * A white rounded shell on four fat wheels, with a dark visor across the
 * front. Two eyes on the visor look into the corners as it steers and blink
 * now and then; a lidar turns on its back.
 *
 * It keeps the structure VisualVehicle expects from a vehicle model (a
 * `chassis` group, a `wheelContainer` to clone four times, parts found by
 * name) and the same physics: forward is +X, the wheels have a radius of 0.4.
 */
export const createRover = () =>
{
    const model = new THREE.Group()

    // Materials the world swaps in by name
    const named = (name) => new THREE.MeshBasicMaterial({ name })
    const paint = named('redGradient')
    const glowWarm = named('emissiveOrangeRadialGradient')

    // No measurement grid on the robot: it is the one doing the measuring
    const plain = { grid: false }
    const shell = Kit.flat(SHELL, plain)
    const graphite = Kit.flat(GRAPHITE, plain)
    const tire = Kit.flat(TIRE, plain)
    const steel = Kit.flat(STEEL, plain)
    const eyeGlow = Kit.glow(CYAN, 3.2)
    const lineGlow = Kit.glow(CYAN, 1.9)
    const lampGlow = Kit.glow('#fff6e0', 2.6)

    const add = (parent, geometry, material, x = 0, y = 0, z = 0, name = '') =>
    {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z)
        mesh.name = name
        parent.add(mesh)
        return mesh
    }

    const rounded = (width, height, depth, radius, segments = 4) => new RoundedBoxGeometry(width, height, depth, segments, radius)

    // axis: 'y' stands up, 'z' lies across the rover (an axle), 'x' points forward
    const cylinder = (radius, length, axis = 'y', segments = 24, radiusTop = radius) =>
    {
        const geometry = new THREE.CylinderGeometry(radiusTop, radius, length, segments)
        if(axis === 'z')
            geometry.rotateX(Math.PI * 0.5)
        else if(axis === 'x')
            geometry.rotateZ(Math.PI * 0.5)
        return geometry
    }

    /**
     * Chassis
     */
    const chassis = new THREE.Group()
    chassis.name = 'chassis'
    chassis.position.set(0, 0.91, 0)
    model.add(chassis)

    const body = new THREE.Group()
    body.name = 'body'
    chassis.add(body)

    // The vehicle code repaints a part with this name; it is the skid plate here
    add(chassis, rounded(1.7, 0.16, 0.86, 0.07), paint, 0, - 0.3, 0, 'bodyPainted')

    // Shell
    add(body, rounded(2.02, 0.66, 1.16, 0.27, 6), shell, 0, 0.08, 0)

    // Belt line of light around the shell
    add(body, rounded(2.045, 0.035, 1.185, 0.016, 2), lineGlow, 0, - 0.06, 0)

    // Dark tub under the shell and the arches the wheels sit in
    add(body, rounded(1.86, 0.3, 1, 0.1), graphite, 0, - 0.2, 0)

    // Visor: a dark band across the front, wrapping the corners
    add(body, rounded(0.52, 0.34, 1.02, 0.15, 5), graphite, 0.79, 0.14, 0)

    // Eyes
    const eyes = new THREE.Group()
    eyes.position.set(1.052, 0.15, 0)
    body.add(eyes)

    const eyeGeometry = rounded(0.03, 0.17, 0.13, 0.014, 3)
    const eyeLeft = add(eyes, eyeGeometry, eyeGlow, 0, 0, - 0.2)
    const eyeRight = add(eyes, eyeGeometry, eyeGlow, 0, 0, 0.2)

    // Headlights low in the bumper
    add(body, rounded(0.2, 0.2, 1.08, 0.08), graphite, 0.96, - 0.2, 0)
    for(const side of [ - 1, 1 ])
        add(body, rounded(0.04, 0.07, 0.2, 0.02, 2), lampGlow, 1.065, - 0.2, side * 0.34, 'headlights')

    // Back: a pack with gold contacts, like a module plugged into a board
    add(body, rounded(0.56, 0.2, 0.84, 0.07), graphite, - 0.62, 0.46, 0)
    for(let i = 0; i < 5; i++)
        add(body, new THREE.BoxGeometry(0.2, 0.012, 0.07), Kit.flat('#d6a44e', plain), - 0.62, 0.566, (i - 2) * 0.15)

    // Lidar: a dark puck with a slit of light that keeps turning
    add(body, cylinder(0.2, 0.07, 'y', 28), graphite, 0.08, 0.445, 0)
    const lidar = new THREE.Group()
    lidar.position.set(0.08, 0.56, 0)
    body.add(lidar)
    add(lidar, cylinder(0.17, 0.16, 'y', 28), shell)
    add(lidar, new THREE.BoxGeometry(0.03, 0.06, 0.2), eyeGlow, 0.158, 0, 0)
    add(lidar, cylinder(0.175, 0.02, 'y', 28), graphite, 0, 0.09, 0)

    // Antenna with a lit tip
    add(body, cylinder(0.014, 0.62, 'y', 8), steel, - 0.72, 0.86, - 0.36)
    add(body, new THREE.SphereGeometry(0.045, 12, 10), eyeGlow, - 0.72, 1.18, - 0.36)

    // Lights the vehicle code switches on and off
    const stopLights = add(chassis, rounded(0.05, 0.07, 0.86, 0.02, 2), glowWarm, - 1.02, 0.14, 0, 'stopLights')
    const backLights = add(chassis, rounded(0.05, 0.05, 0.4, 0.02, 2), glowWarm, - 1.02, 0.02, 0, 'backLights')
    add(chassis, rounded(0.07, 0.07, 0.1, 0.02, 2), glowWarm, 0.98, 0.14, - 0.56, 'blinkerLeft')
    add(chassis, rounded(0.07, 0.07, 0.1, 0.02, 2), glowWarm, 0.98, 0.14, 0.56, 'blinkerRight')
    stopLights.visible = false
    backLights.visible = false

    /**
     * Wheel (cloned four times by VisualVehicle)
     */
    const wheelContainer = new THREE.Group()
    wheelContainer.name = 'wheelContainer'
    wheelContainer.position.set(0.87, - 0.42, - 0.7)
    model.add(wheelContainer)

    const wheelCylinder = new THREE.Group()
    wheelCylinder.name = 'wheelCylinder'
    wheelContainer.add(wheelCylinder)

    // Tyre with rounded shoulders, a white hub and a ring of light
    add(wheelCylinder, cylinder(0.4, 0.2, 'z', 28), tire)
    add(wheelCylinder, cylinder(0.4, 0.07, 'z', 28, 0.34), tire, 0, 0, 0.135)
    add(wheelCylinder, cylinder(0.34, 0.07, 'z', 28, 0.4), tire, 0, 0, - 0.135)
    add(wheelCylinder, cylinder(0.25, 0.36, 'z', 24), shell, 0, 0, 0, 'wheelPainted')
    add(wheelCylinder, cylinder(0.27, 0.34, 'z', 24), lineGlow)
    add(wheelCylinder, cylinder(0.1, 0.38, 'z', 16), graphite)

    // Tread blocks, so the spin reads
    for(let i = 0; i < 10; i++)
    {
        const angle = i / 10 * Math.PI * 2
        const tread = add(wheelCylinder, new THREE.BoxGeometry(0.11, 0.045, 0.3), graphite, Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0)
        tread.rotation.z = angle + Math.PI * 0.5
    }

    // Three slots in the hub
    for(let i = 0; i < 3; i++)
    {
        const slot = add(wheelCylinder, new THREE.BoxGeometry(0.34, 0.06, 0.365), graphite)
        slot.rotation.z = i / 3 * Math.PI
    }

    add(wheelContainer, new THREE.BoxGeometry(0.08, 0.8, 0.08), steel, 0, 0.42, 0.12, 'wheelSuspension')

    /**
     * Life: the lidar turns, the eyes look into the corners and blink
     */
    let blinkIn = 2.5
    let blink = 0
    let look = 0

    model.userData.update = (deltaTime, steering, speed) =>
    {
        lidar.rotation.y += deltaTime * (3 + Math.min(Math.abs(speed), 20) * 0.45)

        look += (steering - look) * Math.min(1, deltaTime * 7)
        eyes.position.z = - look * 0.16

        blinkIn -= deltaTime
        if(blinkIn < 0)
        {
            blink = 1
            blinkIn = 2.2 + Math.random() * 4.5
        }
        blink = Math.max(0, blink - deltaTime * 5)

        // Squint a little at speed, close when blinking
        const open = (1 - Math.sin(Math.min(1, blink) * Math.PI) * 0.92) * (1 - Math.min(Math.abs(speed), 30) / 30 * 0.3)
        eyeLeft.scale.y = open
        eyeRight.scale.y = open
    }

    return model
}
