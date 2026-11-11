import * as THREE from 'three/webgpu'
import { color, uniform } from 'three/tsl'
import { Game } from './Game.js'

/**
 * The world is drawn the way the rover would map it: every surface carries a
 * faint measurement grid, and a lidar pulse leaves the rover every few
 * seconds and lights the grid up as it travels outward.
 *
 * The drawing happens in MeshDefaultMaterial; this class owns the uniforms
 * and moves the pulse.
 */
export class Scan
{
    constructor()
    {
        this.game = Game.getInstance()

        // Grid
        this.color = uniform(color('#39b7ff'))
        this.gridIntensity = uniform(0.55)
        this.lineWidth = uniform(0.035)

        // Pulse
        this.center = uniform(new THREE.Vector2())
        this.radius = uniform(0)
        this.width = uniform(1.6)
        this.strength = uniform(0)
        this.period = 4.5
        this.range = 75
        this.time = 0

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 9)
    }

    update()
    {
        const previous = this.time % this.period
        this.time += this.game.ticker.deltaScaled
        const current = this.time % this.period

        // A new pulse starts from wherever the rover is now
        if(current < previous && this.game.player)
            this.center.value.set(this.game.player.position.x, this.game.player.position.z)

        const progress = current / this.period
        this.radius.value = this.range * (1 - Math.pow(1 - progress, 2))
        this.strength.value = Math.pow(1 - progress, 1.5)
    }
}
