import { Game } from './Game.js'
import { themes } from '../data/themes.js'
import { emblems } from '../data/profile.js'
import { projects, research } from '../data/profile.js'
import { projectCards, researchCards } from '../data/cards.js'
import { live } from './KeynoteLive.js'

/**
 * A full-screen presentation of one project or paper: a grid of tiles that
 * assembles itself, counts its numbers up and walks through how the thing
 * works. Opened from the boards in the world and from the short version.
 *
 * The content is in data/cards.js, the links come from data/profile.js.
 */
export class Keynote
{
    constructor()
    {
        this.game = Game.getInstance()

        this.modal = this.game.modals.items.get('keynote')
        this.element = this.modal.element
        this.bentoElement = this.element.querySelector('.js-keynote-bento')
        this.titleElement = this.element.querySelector('.js-keynote-title')
        this.countElement = this.element.querySelector('.js-keynote-count')
        this.linksElement = this.element.querySelector('.js-keynote-links')

        this.sets = {
            projects: { entries: projects, cards: projectCards, area: 'projects' },
            research: { entries: research, cards: researchCards, area: 'lab' },
        }
        this.type = 'projects'
        this.index = 0
        this.liveTiles = []
        this.timers = []
        this.openedAt = 0

        this.setControls()
        this.setPointerLight()

        this.modal.events.on('close', () =>
        {
            this.stop()
        })

        this.game.ticker.events.on('tick', () =>
        {
            if(this.modal.isOpen)
                this.drawLive()
        }, 14)
    }

    static escape(text)
    {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
    }

    setControls()
    {
        this.element.querySelector('.js-keynote-previous').addEventListener('click', () => { this.go(- 1) })
        this.element.querySelector('.js-keynote-next').addEventListener('click', () => { this.go(1) })
        this.element.querySelector('.js-keynote-world').addEventListener('click', () =>
        {
            this.game.profile.showInWorld(this.sets[this.type].area, this.index)
        })

        // Arrow keys while the presentation is open
        addEventListener('keydown', (event) =>
        {
            if(!this.modal.isOpen)
                return

            if(event.code === 'ArrowRight')
                this.go(1)
            else if(event.code === 'ArrowLeft')
                this.go(- 1)
        })
    }

    /**
     * A soft light that follows the pointer across the tiles
     */
    setPointerLight()
    {
        this.bentoElement.addEventListener('pointermove', (event) =>
        {
            const tile = event.target.closest('.tile')
            if(!tile)
                return

            const bounding = tile.getBoundingClientRect()
            tile.style.setProperty('--light-x', `${event.clientX - bounding.left}px`)
            tile.style.setProperty('--light-y', `${event.clientY - bounding.top}px`)
        })
    }

    open(type, id)
    {
        const set = this.sets[type]
        if(!set)
            return

        const index = Math.max(0, set.entries.findIndex(entry => entry.id === id))
        this.type = type
        this.index = index

        this.game.modals.open('keynote')
        this.render()
    }

    go(direction)
    {
        const set = this.sets[this.type]
        this.index = (this.index + direction + set.entries.length) % set.entries.length

        const sound = this.game.audio.groups.get('click')
        if(sound)
            sound.play(true)

        this.bentoElement.classList.add('is-leaving')
        this.later(220, () =>
        {
            this.bentoElement.classList.remove('is-leaving')
            this.render()
        })
    }

    later(delay, callback)
    {
        const timer = setTimeout(callback, delay)
        this.timers.push(timer)
        return timer
    }

    stop()
    {
        for(const timer of this.timers)
            clearTimeout(timer)

        this.timers = []
        this.liveTiles = []
    }

    renderTile(tile, order)
    {
        const e = Keynote.escape
        const [ column, row, width, height ] = tile.at
        const style = `grid-column:${column} / span ${width};grid-row:${row} / span ${height};--order:${order};`
        const emphasis = tile.dark ? 'is-emphasis' : ''

        if(tile.type === 'hero')
        {
            const size = tile.name.length > 22 ? 'is-long' : tile.name.length > 12 ? 'is-medium' : ''
            const emblem = this.theme?.emblem ? Object.values(emblems).find(item => item.file === this.theme.emblem) : null
            return `<div class="tile hero ${size} ${this.theme ? 'is-themed' : ''}" style="${style}">
                ${emblem ? `<div class="mark" style="background:${emblem.bg}"><img src="profile/emblems/${emblem.file}" alt="" draggable="false"></div>` : ''}
                <div class="name">${e(tile.name)}</div>
                <div class="line">${e(tile.line)}</div>
                ${tile.meta ? `<div class="meta">${e(tile.meta)}</div>` : ''}
            </div>`
        }

        if(tile.type === 'stat')
        {
            const tall = height > 1
            // Scale the numeral down when it is long for its tile
            const natural = tall ? 6 : 3.1
            const fitted = (width * 7.2 - 2.6) / (tile.value.length * 0.6)
            return `<div class="tile stat ${tall ? 'is-tall' : ''} ${emphasis}" style="${style}">
                <div class="value js-count" style="font-size:${Math.min(natural, fitted).toFixed(2)}cqw" data-value="${e(tile.value)}">${e(tile.value)}</div>
                <div class="label">${e(tile.label)}</div>
            </div>`
        }

        if(tile.type === 'image')
        {
            const position = tile.position ? `object-position:${tile.position};` : ''
            const background = tile.bg ? `background:${tile.bg};` : ''

            if(tile.contain)
                return `<div class="tile image is-contain" style="${style}">
                    <div class="holder" style="${background}"><img src="cards/${e(tile.src)}.webp" alt="" draggable="false" style="${position}"></div>
                    ${tile.caption ? `<div class="note">${e(tile.caption)}</div>` : ''}
                </div>`

            // The first picture of a product is shown as the window it runs in
            if(this.theme?.frame === 'browser' && tile === this.firstImage)
                return `<div class="tile image is-window ${this.theme.bar === 'light' ? 'is-light' : ''}" style="${style}">
                    <div class="window">
                        <div class="bar"><i></i><i></i><i></i></div>
                        <img src="cards/${e(tile.src)}.webp" alt="" draggable="false">
                    </div>
                    ${tile.caption ? `<div class="caption">${e(tile.caption)}</div>` : ''}
                </div>`

            return `<div class="tile image" style="${style}">
                <img src="cards/${e(tile.src)}.webp" alt="" draggable="false" style="${position}">
                ${tile.caption ? `<div class="caption">${e(tile.caption)}</div>` : ''}
            </div>`
        }

        if(tile.type === 'live')
            return `<div class="tile live" style="${style}">
                <canvas class="js-live" data-live="${e(tile.id)}"></canvas>
                ${tile.caption ? `<div class="note">${e(tile.caption)}</div>` : ''}
            </div>`

        if(tile.type === 'steps')
            return `<div class="tile steps js-steps ${tile.steps.length > 4 || width < 8 ? 'is-compact' : ''}" style="${style}">
                <div class="heading">${e(tile.heading || 'How it works')}</div>
                <div class="row">
                    ${tile.steps.map(([ title, detail ], index) => `
                        <div class="step js-step">
                            <div class="bar"><div class="fill"></div></div>
                            <div class="n">${index + 1}</div>
                            <div class="t">${e(title)}</div>
                            <div class="d">${e(detail)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>`

        if(tile.type === 'list')
            return `<div class="tile list ${emphasis}" style="${style}">
                <div class="heading">${e(tile.heading)}</div>
                <div class="rows">${tile.items.map(([ lead, rest ]) => `<div class="item"><b>${e(lead)}</b> ${e(rest || '')}</div>`).join('')}</div>
            </div>`

        return `<div class="tile text ${tile.small ? 'is-small' : ''} ${emphasis}" style="${style}">${e(tile.text)}</div>`
    }

    render()
    {
        this.stop()

        const e = Keynote.escape
        const set = this.sets[this.type]
        const entry = set.entries[this.index]
        const tiles = set.cards[entry.id]

        // Reveal order: reading order, top-left first
        const order = [ ...tiles ].sort((a, b) => (a.at[1] - b.at[1]) || (a.at[0] - b.at[0]))

        this.bentoElement.classList.remove('is-in')
        // The project's own colours (data/themes.js)
        this.theme = themes[entry.id] ?? null
        this.firstImage = tiles.find(tile => tile.type === 'image' && !tile.contain) ?? null
        this.bentoElement.style.setProperty('--accent', this.theme?.accent ?? '#f5f5f7')
        this.bentoElement.style.setProperty('--hero-bg', this.theme?.bg ?? 'transparent')
        this.bentoElement.style.setProperty('--hero-ink', this.theme?.ink ?? '#f5f5f7')

        this.bentoElement.innerHTML = tiles.map(tile => this.renderTile(tile, order.indexOf(tile))).join('')
        this.bentoElement.scrollTop = 0

        this.titleElement.textContent = this.type === 'projects' ? 'Projects' : 'Research'
        this.countElement.textContent = `${this.index + 1} of ${set.entries.length}`

        this.linksElement.innerHTML = (entry.links || []).map(link => `<a class="pill" href="${e(link.url)}" target="_blank" rel="noreferrer">${e(link.label)}<span class="arrow" aria-hidden="true">↗</span></a>`).join('')

        // Live tiles
        this.openedAt = performance.now()
        this.liveTiles = [ ...this.bentoElement.querySelectorAll('.js-live') ].map(canvas => ({
            canvas,
            context: canvas.getContext('2d'),
            draw: live[canvas.dataset.live],
            delay: parseInt(canvas.closest('.tile').style.getPropertyValue('--order')) * 0.06 + 0.5,
            state: {},
        }))

        // Start the reveal on the next frame so the transition runs
        requestAnimationFrame(() =>
        {
            requestAnimationFrame(() =>
            {
                this.bentoElement.classList.add('is-in')
                this.countUp()
                this.walkSteps()
            })
        })

        this.game.achievements?.setProgress(this.type === 'projects' ? 'projects' : 'lab', entry.id)
    }

    /**
     * Numbers count up to their value as their tile appears
     */
    countUp()
    {
        for(const element of this.bentoElement.querySelectorAll('.js-count'))
        {
            const value = element.dataset.value
            const match = value.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/)

            // Leave ranges and comparisons ("0.687 → 0.470", "1 of 3") alone
            if(!match || /[0-9]/.test(match[3]))
                continue

            const [ , prefix, digits, suffix ] = match
            const target = parseFloat(digits.replace(/,/g, ''))
            const decimals = (digits.split('.')[1] || '').length
            const grouped = digits.includes(',')
            const delay = parseInt(element.closest('.tile').style.getPropertyValue('--order')) * 60 + 250
            const duration = 1100

            const format = (number) =>
            {
                const fixed = number.toFixed(decimals)
                return prefix + (grouped ? Number(fixed).toLocaleString('en-US') : fixed) + suffix
            }

            element.textContent = format(0)

            this.later(delay, () =>
            {
                const start = performance.now()
                const frame = (now) =>
                {
                    if(!element.isConnected)
                        return

                    const progress = Math.min(1, (now - start) / duration)
                    const eased = 1 - Math.pow(1 - progress, 4)
                    element.textContent = progress < 1 ? format(target * eased) : value

                    if(progress < 1)
                        requestAnimationFrame(frame)
                }
                requestAnimationFrame(frame)
            })
        }
    }

    /**
     * The "how it works" tile highlights one step after another, on a loop
     */
    walkSteps()
    {
        for(const tile of this.bentoElement.querySelectorAll('.js-steps'))
        {
            const steps = [ ...tile.querySelectorAll('.js-step') ]
            const stepDuration = 1900
            let index = - 1

            const advance = () =>
            {
                if(!tile.isConnected)
                    return

                index = (index + 1) % steps.length
                steps.forEach((step, stepIndex) =>
                {
                    step.classList.toggle('is-active', stepIndex === index)
                    step.classList.toggle('is-done', stepIndex < index)
                })

                this.later(stepDuration, advance)
            }

            tile.style.setProperty('--step-duration', `${stepDuration}ms`)
            this.later(1300, advance)
        }
    }

    drawLive()
    {
        const now = performance.now()

        for(const tile of this.liveTiles)
        {
            const { canvas, context } = tile
            const ratio = Math.min(2, devicePixelRatio || 1)
            const width = Math.round(canvas.clientWidth * ratio)
            const height = Math.round(canvas.clientHeight * ratio)

            if(!width || !height || !tile.draw)
                continue

            if(canvas.width !== width || canvas.height !== height)
            {
                canvas.width = width
                canvas.height = height
            }

            const time = (now - this.openedAt) / 1000 - tile.delay

            context.clearRect(0, 0, width, height)
            if(time > 0)
                tile.draw(context, width, height, time, tile.state)
        }
    }
}
