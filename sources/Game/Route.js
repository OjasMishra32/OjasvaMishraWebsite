import * as THREE from 'three/webgpu'
import { Game } from './Game.js'
import { Kit } from './World/Kit.js'
import { path, stops, nearest, plaques, extraRespawns } from '../data/route.js'

/**
 * Keeps the visit on rails (see data/route.js).
 *
 * - An invisible wall follows the edge of the corridor. The rover slides
 *   along it instead of leaving.
 * - A fence of light marks that edge.
 * - Arrows hover along the path, pointing to the next stop.
 * - A column of light stands over each stop.
 */
export class Route
{
    constructor()
    {
        this.game = Game.getInstance()

        this.setRespawns()
        this.setFence()
        this.setArrows()
        this.setBeacons()
        this.setPlaques()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 5)
    }

    setRespawns()
    {
        for(const respawn of extraRespawns)
        {
            this.game.respawns.items.set(respawn.name, {
                name: respawn.name,
                position: new THREE.Vector3(respawn.x, 4, respawn.z),
                rotation: respawn.rotation,
            })
        }
    }

    /**
     * Experience: one plaque per role, leaning back to face the camera so
     * it reads as you drive past (the cards are drawn by
     * scripts/build-covers.mjs)
     */
    setPlaques()
    {
        const loader = new THREE.TextureLoader()
        const width = 3.9
        const height = width * 800 / 1280
        const lean = - (Math.PI * 0.5 - this.game.view.spherical.phi)

        const frameGeometry = new THREE.BoxGeometry(width + 0.22, height + 0.22, 0.12)
        const faceGeometry = new THREE.PlaneGeometry(width, height)
        const legGeometry = new THREE.BoxGeometry(0.12, 1.2, 0.12)

        plaques.forEach(([ x, z, index ]) =>
        {
            const group = new THREE.Group()
            group.rotation.order = 'YXZ'
            group.rotation.y = Math.PI * 0.25
            group.rotation.x = lean
            group.position.set(x, 1.3, z)
            this.game.scene.add(group)

            const frame = new THREE.Mesh(frameGeometry, Kit.flat('#161a24', { grid: false }))
            frame.castShadow = true
            group.add(frame)

            const map = loader.load(`experience/role-${index}.webp`)
            map.colorSpace = THREE.SRGBColorSpace
            map.anisotropy = 8
            const face = new THREE.Mesh(faceGeometry, Kit.screen(map, 0.98))
            face.position.z = 0.065
            group.add(face)

            for(const side of [ - 1, 1 ])
            {
                const leg = new THREE.Mesh(legGeometry, Kit.flat('#161a24', { grid: false }))
                leg.castShadow = true
                leg.position.set(x + side * (width / 2 - 0.4) * Math.SQRT1_2, 0.6, z - side * (width / 2 - 0.4) * Math.SQRT1_2)
                this.game.scene.add(leg)
            }

            this.game.objects.add(null, {
                type: 'fixed',
                position: { x, y: 0.6, z },
                rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.25),
                friction: 0.3,
                colliders: [ { shape: 'cuboid', parameters: [ width / 2, 0.6, 0.35 ], category: 'floor' } ],
            })
        })
    }

    /**
     * The corridor's edge is where (distance to the path - half-width) is
     * zero. Marching squares turns that into short segments.
     */
    setFence()
    {
        const cell = 0.75
        const minX = Math.min(...path.map(point => point[0] - point[2])) - 2
        const maxX = Math.max(...path.map(point => point[0] + point[2])) + 2
        const minZ = Math.min(...path.map(point => point[1] - point[2])) - 2
        const maxZ = Math.max(...path.map(point => point[1] + point[2])) + 2
        const columns = Math.ceil((maxX - minX) / cell)
        const rows = Math.ceil((maxZ - minZ) / cell)

        const field = new Float32Array((columns + 1) * (rows + 1))
        for(let row = 0; row <= rows; row++)
        {
            for(let column = 0; column <= columns; column++)
                field[row * (columns + 1) + column] = nearest(minX + column * cell, minZ + row * cell).outside
        }

        const segments = []
        const cross = (ax, az, a, bx, bz, b) =>
        {
            const t = a / (a - b)
            return [ ax + (bx - ax) * t, az + (bz - az) * t ]
        }

        for(let row = 0; row < rows; row++)
        {
            for(let column = 0; column < columns; column++)
            {
                const x0 = minX + column * cell
                const z0 = minZ + row * cell
                const x1 = x0 + cell
                const z1 = z0 + cell
                const a = field[row * (columns + 1) + column]
                const b = field[row * (columns + 1) + column + 1]
                const c = field[(row + 1) * (columns + 1) + column + 1]
                const d = field[(row + 1) * (columns + 1) + column]

                const points = []
                if((a < 0) !== (b < 0)) points.push(cross(x0, z0, a, x1, z0, b))
                if((b < 0) !== (c < 0)) points.push(cross(x1, z0, b, x1, z1, c))
                if((c < 0) !== (d < 0)) points.push(cross(x1, z1, c, x0, z1, d))
                if((d < 0) !== (a < 0)) points.push(cross(x0, z1, d, x0, z0, a))

                if(points.length >= 2)
                    segments.push([ points[0], points[1] ])
                if(points.length === 4)
                    segments.push([ points[2], points[3] ])
            }
        }

        // A thin beam at knee height, and a fainter one above it
        const dummy = new THREE.Object3D()
        const beamGeometry = new THREE.BoxGeometry(1, 0.045, 0.045)

        for(const [ height, intensity ] of [ [ 0.55, 1.5 ], [ 1.05, 0.7 ] ])
        {
            const beams = new THREE.InstancedMesh(beamGeometry, Kit.glow('#5fd4ff', intensity), segments.length)
            segments.forEach(([ from, to ], index) =>
            {
                const dx = to[0] - from[0]
                const dz = to[1] - from[1]
                dummy.position.set((from[0] + to[0]) / 2, height, (from[1] + to[1]) / 2)
                dummy.rotation.set(0, - Math.atan2(dz, dx), 0)
                dummy.scale.set(Math.hypot(dx, dz) + 0.02, 1, 1)
                dummy.updateMatrix()
                beams.setMatrixAt(index, dummy.matrix)
            })
            beams.instanceMatrix.needsUpdate = true
            beams.frustumCulled = false
            this.game.scene.add(beams)
        }

        // Posts
        const posts = segments.filter((_, index) => index % 5 === 0)
        const postMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 1.25, 0.09), Kit.flat('#1b2130', { grid: false }), posts.length)
        posts.forEach(([ from ], index) =>
        {
            dummy.position.set(from[0], 0.625, from[1])
            dummy.rotation.set(0, 0, 0)
            dummy.scale.set(1, 1, 1)
            dummy.updateMatrix()
            postMesh.setMatrixAt(index, dummy.matrix)
        })
        postMesh.instanceMatrix.needsUpdate = true
        postMesh.frustumCulled = false
        this.game.scene.add(postMesh)
    }

    /**
     * Arrows along the path
     */
    setArrows()
    {
        const shape = new THREE.Shape()
        shape.moveTo(0.42, 0)
        shape.lineTo(- 0.2, 0.42)
        shape.lineTo(- 0.2, 0.2)
        shape.lineTo(0.12, 0)
        shape.lineTo(- 0.2, - 0.2)
        shape.lineTo(- 0.2, - 0.42)
        shape.closePath()

        // Lying flat, pointing along +X
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false })
        geometry.rotateX(- Math.PI * 0.5)

        const spacing = 3.2
        const items = []
        let carry = spacing * 0.5

        for(let i = 0; i < path.length - 1; i++)
        {
            const [ ax, az ] = path[i]
            const [ bx, bz ] = path[i + 1]
            const length = Math.hypot(bx - ax, bz - az)

            while(carry < length)
            {
                const t = carry / length
                items.push({ x: ax + (bx - ax) * t, z: az + (bz - az) * t, yaw: - Math.atan2(bz - az, bx - ax) })
                carry += spacing
            }
            carry -= length
        }

        // Not on top of a stop: the exhibits need the room
        this.arrows = {
            items: items.filter(item => stops.every(stop => Math.hypot(stop.x - item.x, stop.z - item.z) > 4.5)),
            dummy: new THREE.Object3D(),
        }
        this.arrows.mesh = new THREE.InstancedMesh(geometry, Kit.glow('#ffd27a', 1.9), this.arrows.items.length)
        this.arrows.mesh.frustumCulled = false
        this.game.scene.add(this.arrows.mesh)
    }

    /**
     * A column of light over each stop, so the next one is visible from the last
     */
    setBeacons()
    {
        this.beacons = []

        for(const stop of stops)
        {
            if(stop.id === 'start' || stop.beacon === false)
                continue

            const group = new THREE.Group()
            group.position.set(stop.x, 0, stop.z)
            this.game.scene.add(group)

            const material = Kit.glow(stop.accent, 1.1)
            const column = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 24, 8), material)
            column.position.y = 19
            group.add(column)

            const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.04, 6, 40), material)
            ring.rotation.x = Math.PI * 0.5
            ring.position.y = 7
            group.add(ring)

            this.beacons.push({ stop, group, ring, scale: 1 })
        }
    }

    update()
    {
        const vehicle = this.game.physicalVehicle
        const player = this.game.player
        if(!vehicle || !player)
            return

        /**
         * Wall: remove the part of the velocity that leaves the corridor and
         * ease the rover back inside
         */
        const body = vehicle.chassis.physical.body
        const position = body.translation()
        const closest = nearest(position.x, position.z)

        if(closest.outside > - 0.6 && closest.distance > 0.001)
        {
            const normalX = (position.x - closest.x) / closest.distance
            const normalZ = (position.z - closest.z) / closest.distance
            const velocity = body.linvel()
            const outward = velocity.x * normalX + velocity.z * normalZ

            // Soft over the last 0.6 m, firm past the line
            const firmness = Math.min(1, (closest.outside + 0.6) / 0.6)
            let removeX = 0
            let removeZ = 0

            if(outward > 0)
            {
                removeX = normalX * outward * firmness
                removeZ = normalZ * outward * firmness
            }

            // Leaning on the wall shouldn't roll the rover over
            if(firmness > 0.2)
            {
                const spin = body.angvel()
                body.setAngvel({ x: spin.x * 0.6, y: spin.y, z: spin.z * 0.6 }, true)
            }

            const pushBack = Math.max(0, closest.outside) * 3
            body.setLinvel({
                x: velocity.x - removeX - normalX * pushBack,
                y: velocity.y,
                z: velocity.z - removeZ - normalZ * pushBack,
            }, true)

            // Far outside (a respawn elsewhere, an explosion): put it back on the path
            if(closest.outside > 6)
                player.respawn()
        }

        /**
         * Arrows bob, and the ones just ahead of the rover are brighter
         */
        const time = this.game.ticker.elapsedScaled
        const here = nearest(player.position.x, player.position.z)
        const { items, dummy, mesh } = this.arrows

        items.forEach((item, index) =>
        {
            const along = nearest(item.x, item.z).along
            const ahead = along - here.along
            const wave = Math.sin(time * 1.6 - along * 0.55)
            const near = ahead > - 2 && ahead < 26 ? 1 : 0.55

            dummy.position.set(item.x, 1.15 + wave * 0.12, item.z)
            dummy.rotation.set(0, item.yaw, 0)
            dummy.scale.setScalar((0.8 + Math.max(0, wave) * 0.35) * near)
            dummy.updateMatrix()
            mesh.setMatrixAt(index, dummy.matrix)
        })
        mesh.instanceMatrix.needsUpdate = true

        // A beacon is for finding a stop from far away: it folds away on arrival
        for(const beacon of this.beacons)
        {
            const distance = Math.hypot(beacon.stop.x - player.position.x, beacon.stop.z - player.position.z)
            const target = distance < 13 ? 0 : 1
            beacon.scale += (target - beacon.scale) * Math.min(1, this.game.ticker.delta * 4)
            beacon.group.visible = beacon.scale > 0.01
            beacon.group.scale.set(1, beacon.scale, 1)
            beacon.ring.position.y = 7 + Math.sin(time * 0.8 + beacon.stop.x) * 0.35
            beacon.ring.rotation.z = time * 0.4
        }
    }
}
