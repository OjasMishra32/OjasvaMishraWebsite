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
                this.game.player.respawn(next.respawn, () =>
                {
                    this.game.view.focusPoint.isTracking = true
                })
            })
            step.addEventListener('keydown', (event) => { event.preventDefault() })
        }

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 14)
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

        if(closest !== this.current)
        {
            this.current = closest
            for(const item of this.items)
                item.classList.toggle('is-active', item.dataset.stop === closest.id)

            this.currentElement.textContent = `${closest.label} · ${stops.indexOf(closest) + 1} of ${stops.length}`
        }
    }
}
