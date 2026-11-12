import gsap from 'gsap'
import { Game } from './Game.js'
import { stops } from '../data/route.js'

/**
 * The stops bar at the top of the screen: where the rover is on the route,
 * and one click to be put down at any stop.
 */
export class Guide
{
    constructor()
    {
        this.game = Game.getInstance()
        this.current = null

        this.element = document.createElement('nav')
        this.element.classList.add('guide')
        this.element.setAttribute('aria-label', 'Stops')
        this.element.innerHTML = stops.map(stop => /* html */`<button class="guide-item js-guide-item" data-stop="${stop.id}" style="--accent:${stop.accent}">${stop.label}</button>`).join('') + /* html */`
            <button class="guide-step js-guide-step" data-direction="-1" aria-label="Previous stop"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
            <span class="guide-current js-guide-current"></span>
            <button class="guide-step js-guide-step" data-direction="1" aria-label="Next stop"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        `
        this.game.domElement.append(this.element)

        this.items = [ ...this.element.querySelectorAll('.js-guide-item') ]
        this.frames = new Map()

        for(const item of this.items)
        {
            const stop = stops.find(candidate => candidate.id === item.dataset.stop)

            item.addEventListener('click', () =>
            {
                item.blur()
                this.game.player.respawn(stop.respawn, () =>
                {
                    this.game.view.focusPoint.isTracking = true
                })
            })
            item.addEventListener('keydown', (event) =>
            {
                // Space and Enter belong to the rover
                event.preventDefault()
            })
        }

        // Phones get a compact version: previous, the current stop, next
        this.currentElement = this.element.querySelector('.js-guide-current')

        for(const step of this.element.querySelectorAll('.js-guide-step'))
        {
            step.addEventListener('click', () =>
            {
                step.blur()
                const index = stops.indexOf(this.current ?? stops[0])
                const next = stops[(index + Number(step.dataset.direction) + stops.length) % stops.length]

                // Leaving a board that is open
                for(const stop of stops)
                {
                    if(stop.board)
                        this.game.world.areas[stop.respawn]?.close()
                }

                this.game.player.respawn(next.respawn, () =>
                {
                    this.game.view.focusPoint.isTracking = true

                    // The board at this stop is off to one side of a narrow
                    // screen, so it opens by itself
                    if(next.board)
                        gsap.delayedCall(0.6, () => { this.game.world.areas[next.respawn]?.open() })
                })
            })
            step.addEventListener('keydown', (event) => { event.preventDefault() })
        }

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 14)
    }

    // On an upright screen, a stop's content rarely fits the default view,
    // so while the rover is at one the camera frames what that stop is about
    updateFrame(stop, x, z)
    {
        const frame = this.game.view.frame

        // Not during the intro: the visitor has to tap the rover, which stays in the middle
        if(this.game.viewport.ratio > 0.8 || this.game.inputs.filters.has('intro'))
        {
            frame.target = 0
            return
        }

        // The timeline is driven along, so its framing travels with the rover
        const live = this.game.world.areas?.career?.stopFrameLive?.(x, z)

        if(live)
        {
            frame.x = live.x
            frame.z = live.z
            frame.width = live.width
            frame.target = 1
            return
        }

        if(!this.frames.has(stop))
            this.frames.set(stop, stop.frame ?? this.game.world.areas?.[stop.respawn]?.stopFrame ?? null)

        const stopFrame = this.frames.get(stop)
        const respawn = this.game.respawns.getByName(stop.respawn)

        if(!stopFrame || !respawn)
        {
            frame.target = 0
            return
        }

        // Full strength within a few units of where the stop puts the rover, gone a little further out
        const distance = Math.hypot(respawn.position.x - x, respawn.position.z - z)
        const strength = 1 - Math.min(1, Math.max(0, (distance - 4) / 6))

        if(strength > 0)
        {
            frame.x = stopFrame.x
            frame.z = stopFrame.z
            frame.width = stopFrame.width
        }

        frame.target = strength * strength * (3 - 2 * strength)
    }

    update()
    {
        if(!this.game.player)
            return

        // The stop the rover is closest to
        const { x, z } = this.game.player.position
        let closest = stops[0]
        let closestDistance = Infinity

        for(const stop of stops)
        {
            const distance = Math.hypot(stop.x - x, stop.z - z)
            if(distance < closestDistance)
            {
                closest = stop
                closestDistance = distance
            }
        }

        // Anywhere along the timeline counts as the Timeline stop, though its far end is nearer to Contact
        if(this.game.world.areas?.career?.stopFrameLive?.(x, z))
            closest = stops.find(stop => stop.id === 'timeline')

        this.updateFrame(closest, x, z)

        if(closest !== this.current)
        {
            this.current = closest
            for(const item of this.items)
                item.classList.toggle('is-active', item.dataset.stop === closest.id)

            this.currentElement.textContent = `${closest.label} · ${stops.indexOf(closest) + 1} of ${stops.length}`
        }
    }
}
