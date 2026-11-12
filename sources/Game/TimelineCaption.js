import { Game } from './Game.js'
import { CareerArea } from './World/Areas/CareerArea.js'
import { timeline } from '../data/profile.js'

const COLORS = { blue: '#5390ff', orange: '#ff8039', purple: '#b65fff' }

/**
 * The timeline's stones carry their text at a size made for a wide screen.
 * On a phone held upright this card says the same thing in readable type:
 * the year the rover is at and what was going on then.
 */
export class TimelineCaption
{
    constructor()
    {
        this.game = Game.getInstance()
        this.visible = false
        this.year = null
        this.key = null

        this.element = document.createElement('div')
        this.element.className = 'timeline-caption'
        this.element.innerHTML = /* html */`
            <div class="timeline-caption-head">
                <b class="js-year"></b>
                <span class="js-hint">Drive along the line to move through the years</span>
            </div>
            <div class="timeline-caption-rows js-rows"></div>
        `
        this.game.domElement.append(this.element)

        this.yearElement = this.element.querySelector('.js-year')
        this.hintElement = this.element.querySelector('.js-hint')
        this.rowsElement = this.element.querySelector('.js-rows')

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 14)
    }

    update()
    {
        const career = this.game.world?.areas?.career
        const player = this.game.player

        if(!career?.lines || !player || this.game.viewport.ratio > 0.8)
        {
            this.toggle(false)
            return
        }

        const along = career.lines.startZ - player.position.z
        const across = player.position.x - (career.lines.startX + career.lines.laneSpacing * 2)
        const inside = along > - 4 && along < career.year.size + 3 && Math.abs(across) < 7 && !this.game.inputs.filters.has('intro')

        this.toggle(inside)

        if(!inside)
            return

        const year = CareerArea.distanceToYear(Math.min(Math.max(along, 0), career.year.size - 0.001))
        const shownYear = Math.min(timeline.end - 1, Math.floor(year + 0.0001))

        if(shownYear !== this.year)
        {
            this.year = shownYear
            this.yearElement.textContent = shownYear
        }

        const active = timeline.lines.filter(line => year >= line.from && year < (line.to ?? timeline.end))
        const key = active.map(line => line.name).join('|')

        if(key !== this.key)
        {
            this.key = key
            this.hintElement.hidden = along > 1
            this.rowsElement.innerHTML = active.map(line => /* html */`
                <div class="timeline-caption-row" style="--line: ${COLORS[line.color]}">
                    <b>${line.name}</b><span>${line.detail}</span>
                </div>
            `).join('')
        }
        else if(!this.hintElement.hidden && along > 1)
        {
            this.hintElement.hidden = true
        }
    }

    toggle(visible)
    {
        if(visible === this.visible)
            return

        this.visible = visible
        this.element.classList.toggle('is-visible', visible)
    }
}
