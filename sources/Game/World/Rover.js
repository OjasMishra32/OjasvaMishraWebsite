import * as THREE from 'three/webgpu'
import { Kit } from './Kit.js'

/**
 * The vehicle: a small research rover, modelled in code.
 *
 * It follows the structure VisualVehicle expects from a vehicle model (a
 * `chassis` group, a `wheelContainer` to clone four times, parts found by
 * name) and sits on the same physics as before: forward is +X, the wheels
 * have a radius of 0.4.
 */
export const createRover = () =>
{
    const model = new THREE.Group()

    // Materials the world swaps in by name (paint, lights)
    const named = (name) => new THREE.MeshBasicMaterial({ name })
    const paint = named('redGradient')
    const glowWarm = named('emissiveOrangeRadialGradient')
    const glowBlue = named('emissiveBlueRadialGradient')

    const shell = Kit.flat('#f4f6fa')
    const graphite = Kit.flat('#2b2f38')
    const steel = Kit.flat('#8e98a8')
    const tire = Kit.flat('#1d1f25')
    const glass = Kit.flat('#16264a')

    const box = (parent, material, width, height, depth, x, y, z, name = '') =>
    {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
        mesh.position.set(x, y, z)
        mesh.name = name
        parent.add(mesh)
        return mesh
    }

    // axis: 'y' stands up, 'z' lies across the rover (an axle), 'x' points forward
    const cylinder = (parent, material, radius, length, x, y, z, axis = 'y', segments = 14, name = '') =>
    {
        const geometry = new THREE.CylinderGeometry(radius, radius, length, segments)
        if(axis === 'z')
            geometry.rotateX(Math.PI * 0.5)
        else if(axis === 'x')
            geometry.rotateZ(Math.PI * 0.5)

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z)
        mesh.name = name
        parent.add(mesh)
        return mesh
    }

    /**
     * Chassis
     */
    const chassis = new THREE.Group()
    chassis.name = 'chassis'
    chassis.position.set(0, 0.91, 0)
    model.add(chassis)

    // Deck (takes the paint) and the darker tub under it
    const body = new THREE.Group()
    body.name = 'body'
    chassis.add(body)

    const deckGeometry = new THREE.BoxGeometry(2.15, 0.3, 1.16)
    const deck = new THREE.Mesh(deckGeometry, paint)
    deck.name = 'bodyPainted'
    deck.position.set(0, 0.02, 0)
    chassis.add(deck)

    box(body, graphite, 1.95, 0.26, 0.92, 0, - 0.24, 0)
    box(body, graphite, 0.16, 0.2, 1.22, 1.12, - 0.02, 0) // Front bumper
    box(body, graphite, 0.12, 0.16, 1.1, - 1.12, - 0.02, 0) // Rear bumper

    // Rocker beams along each side, like a rover's suspension
    for(const side of [ - 1, 1 ])
    {
        box(body, steel, 1.86, 0.09, 0.09, 0, - 0.3, side * 0.64)
        box(body, steel, 0.09, 0.3, 0.09, 0.55, - 0.16, side * 0.64)
        box(body, steel, 0.09, 0.3, 0.09, - 0.55, - 0.16, side * 0.64)
    }

    // Headlights
    for(const side of [ - 1, 1 ])
        box(body, glowWarm, 0.06, 0.1, 0.26, 1.21, 0, side * 0.38, 'headlights')

    // Solar deck on the back
    const panel = box(body, glass, 0.86, 0.04, 0.9, - 0.5, 0.2, 0)
    panel.rotation.z = 0.07
    box(body, steel, 0.9, 0.03, 0.03, - 0.5, 0.215, 0)
    box(body, steel, 0.03, 0.03, 0.92, - 0.5, 0.215, 0)

    // Sensor mast with a stereo camera head: the rover's face
    cylinder(body, steel, 0.055, 0.62, 0.62, 0.48, 0, 'y', 10)
    cylinder(body, graphite, 0.11, 0.08, 0.62, 0.2, 0, 'y', 12)

    const head = new THREE.Group()
    head.position.set(0.62, 0.86, 0)
    body.add(head)

    box(head, shell, 0.26, 0.2, 0.62, 0, 0, 0)
    box(head, graphite, 0.04, 0.14, 0.56, 0.135, 0, 0)
    for(const side of [ - 1, 1 ])
    {
        cylinder(head, glass, 0.075, 0.06, 0.16, 0, side * 0.17, 'x', 14)
        cylinder(head, glowBlue, 0.035, 0.07, 0.165, 0, side * 0.17, 'x', 10)
    }

    // Lidar puck that keeps spinning
    cylinder(body, graphite, 0.15, 0.06, - 0.05, 0.2, 0, 'y', 14)
    const lidar = new THREE.Group()
    lidar.position.set(- 0.05, 0.31, 0)
    body.add(lidar)
    cylinder(lidar, shell, 0.13, 0.14, 0, 0, 0, 'y', 14)
    box(lidar, glowBlue, 0.04, 0.05, 0.16, 0.115, 0, 0)

    // A folded arm on the deck
    const armBase = cylinder(body, steel, 0.09, 0.1, 0.15, 0.22, 0.38, 'y', 10)
    const upperArm = box(body, shell, 0.5, 0.09, 0.09, - 0.02, 0.36, 0.38)
    upperArm.rotation.z = 0.5
    const foreArm = box(body, shell, 0.42, 0.075, 0.075, - 0.06, 0.43, 0.38)
    foreArm.rotation.z = - 0.32
    box(body, graphite, 0.1, 0.05, 0.14, 0.15, 0.37, 0.38)
    armBase.rotation.y = 0.3

    // Antenna
    cylinder(body, steel, 0.012, 0.7, - 0.95, 0.52, - 0.45, 'y', 6)
    cylinder(body, glowBlue, 0.035, 0.035, - 0.95, 0.88, - 0.45, 'y', 8)

    // Lights the vehicle code switches on and off
    const stopLights = box(chassis, glowWarm, 0.05, 0.08, 0.9, - 1.19, 0.0, 0, 'stopLights')
    const backLights = box(chassis, glowWarm, 0.05, 0.05, 0.5, - 1.19, - 0.09, 0, 'backLights')
    box(chassis, glowWarm, 0.08, 0.08, 0.08, 1.15, 0.12, - 0.56, 'blinkerLeft')
    box(chassis, glowWarm, 0.08, 0.08, 0.08, 1.15, 0.12, 0.56, 'blinkerRight')
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

    cylinder(wheelCylinder, tire, 0.4, 0.3, 0, 0, 0, 'z', 16)
    cylinder(wheelCylinder, paint, 0.24, 0.32, 0, 0, 0, 'z', 12, 'wheelPainted')

    // Grousers, so the spin reads
    for(let i = 0; i < 8; i++)
    {
        const angle = i / 8 * Math.PI * 2
        const tread = box(wheelCylinder, graphite, 0.1, 0.07, 0.34, Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0)
        tread.rotation.z = angle + Math.PI * 0.5
    }

    // Spokes on the hub
    for(let i = 0; i < 3; i++)
    {
        const spoke = box(wheelCylinder, steel, 0.42, 0.05, 0.33, 0, 0, 0)
        spoke.rotation.z = i / 3 * Math.PI
    }

    box(wheelContainer, steel, 0.07, 1, 0.07, 0, 0.48, 0.1, 'wheelSuspension')

    /**
     * Life: the lidar spins and the head turns into the corners
     */
    model.userData.update = (deltaTime, steering, speed) =>
    {
        lidar.rotation.y += deltaTime * (4 + Math.min(Math.abs(speed), 20) * 0.5)
        head.rotation.y += (steering * 0.9 - head.rotation.y) * Math.min(1, deltaTime * 6)
    }

    return model
}
