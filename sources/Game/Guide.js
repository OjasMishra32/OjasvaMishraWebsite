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
        this.element.innerHTML = stops.map(stop => /* html */`<button class="guide-item js-guide-item" data-stop="${stop.id}" style="--accent:${stop.accent}">${stop.label}</button>`).join('')
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
            {
                const active = item.dataset.stop === closest.id
                item.classList.toggle('is-active', active)

                // Keep the current stop in view where the bar scrolls (phones)
                if(active && this.element.scrollWidth > this.element.clientWidth)
                    this.element.scrollTo({ left: item.offsetLeft - (this.element.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' })
            }
        }
    }
}
