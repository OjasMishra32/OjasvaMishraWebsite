import confetti from 'canvas-confetti'

const ITEMS = [
    { id: 'love', emoji: '❤️', label: 'Love', color: '#ef4444' },
    { id: 'laugh', emoji: '😂', label: 'Haha', color: '#fbbf24' },
    { id: 'wow', emoji: '😮', label: 'Wow', color: '#3b82f6' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#60a5fa' },
    { id: 'angry', emoji: '😡', label: 'Angry', color: '#f97316' },
    { id: 'fire', emoji: '🔥', label: 'Lit', color: '#f59e0b' },
]

const DEAD_ZONE = 20
const MAX_DISTANCE = 500 // pull this far for full intensity
const RADIUS = 100
const COOLDOWN = 2000 // after a strong burst
const COOLDOWN_THRESHOLD = 0.7
const INTERACTIVE = 'a, button, input, textarea, select, img, video'
const HINT_KEY = 'radial-menu-hint-seen'

/**
 * Reactions on the About page. Hold the right mouse button anywhere: six
 * emoji fan out around the pointer. Drag toward one to pick it (the further
 * you pull, the bigger the burst) and let go to fire it.
 */
export class Reactions
{
    constructor(container)
    {
        this.container = container
        this.enabled = matchMedia('(hover: hover) and (pointer: fine)').matches
        this.running = false

        if(!this.enabled)
            return

        this.open = false
        this.disabled = false
        this.origin = { x: 0, y: 0 }
        this.activeIndex = null
        this.intensity = 0
        this.cooldownUntil = 0
        this.suppressMenu = false

        // Menu
        this.element = document.createElement('div')
        this.element.className = 'reactions'
        this.element.innerHTML = /* html */`
            <div class="reactions-ring"></div>
            <div class="reactions-center"><div class="reactions-dot"></div></div>
            <div class="reactions-label"></div>
            ${ITEMS.map((item, index) =>
            {
                const angle = (index * 360 / ITEMS.length - 90) * Math.PI / 180
                return /* html */`<div class="reactions-item" style="--x:${(Math.cos(angle) * RADIUS).toFixed(1)}px; --y:${(Math.sin(angle) * RADIUS).toFixed(1)}px; --color:${item.color}"><span>${item.emoji}</span><em>${item.label}</em></div>`
            }).join('')}
        `
        container.append(this.element)

        this.ringElement = this.element.querySelector('.reactions-ring')
        this.dotElement = this.element.querySelector('.reactions-dot')
        this.labelElement = this.element.querySelector('.reactions-label')
        this.itemElements = [ ...this.element.querySelectorAll('.reactions-item') ]

        // Hint
        this.hintElement = document.createElement('div')
        this.hintElement.className = 'reactions-hint'
        this.hintElement.textContent = 'Right-click anywhere to react'
        container.append(this.hintElement)

        this.onDown = this.onDown.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onUp = this.onUp.bind(this)
        this.onContextMenu = this.onContextMenu.bind(this)
    }

    start()
    {
        if(!this.enabled || this.running)
            return

        this.running = true
        this.container.addEventListener('mousedown', this.onDown)
        document.addEventListener('mousemove', this.onMove)
        document.addEventListener('mouseup', this.onUp)
        this.container.addEventListener('contextmenu', this.onContextMenu)

        // Mention it once, after the visitor has had a look around
        let seen = false
        try { seen = !!localStorage.getItem(HINT_KEY) } catch(error) {}

        if(!seen)
        {
            this.hintTimer = setTimeout(() =>
            {
                this.hintElement.classList.add('is-visible')
                this.hintTimer = setTimeout(() => { this.dismissHint() }, 6000)
            }, 6000)
        }
    }

    stop()
    {
        if(!this.running)
            return

        this.running = false
        this.close()
        clearTimeout(this.hintTimer)
        this.hintElement.classList.remove('is-visible')

        this.container.removeEventListener('mousedown', this.onDown)
        document.removeEventListener('mousemove', this.onMove)
        document.removeEventListener('mouseup', this.onUp)
        this.container.removeEventListener('contextmenu', this.onContextMenu)
    }

    dismissHint()
    {
        clearTimeout(this.hintTimer)
        this.hintElement.classList.remove('is-visible')
        try { localStorage.setItem(HINT_KEY, '1') } catch(error) {}
    }

    onDown(event)
    {
        if(event.button !== 2 || event.target.closest(INTERACTIVE))
            return

        this.suppressMenu = true
        this.origin.x = event.clientX
        this.origin.y = event.clientY
        this.disabled = Date.now() < this.cooldownUntil
        this.activeIndex = null
        this.intensity = 0
        this.open = true

        this.element.style.left = `${event.clientX}px`
        this.element.style.top = `${event.clientY}px`
        this.element.classList.toggle('is-disabled', this.disabled)
        this.element.classList.add('is-open')
        this.dismissHint()
        this.draw()
    }

    onMove(event)
    {
        if(!this.open || this.disabled)
            return

        const dx = event.clientX - this.origin.x
        const dy = event.clientY - this.origin.y
        const distance = Math.hypot(dx, dy)

        if(distance < DEAD_ZONE)
        {
            this.activeIndex = null
            this.intensity = 0
        }
        else
        {
            this.intensity = Math.min(1, (distance - DEAD_ZONE) / (MAX_DISTANCE - DEAD_ZONE))

            // Slices start at the top and go clockwise
            const slice = 360 / ITEMS.length
            const angle = ((Math.atan2(dy, dx) * 180 / Math.PI + 90 + slice / 2) % 360 + 360) % 360
            this.activeIndex = Math.floor(angle / slice)
        }

        this.draw()
    }

    onUp(event)
    {
        if(!this.open)
            return

        if(this.activeIndex !== null && !this.disabled)
        {
            const item = ITEMS[this.activeIndex]
            this.fire(event.clientX, event.clientY, item, this.intensity)

            if(this.intensity >= COOLDOWN_THRESHOLD)
                this.cooldownUntil = Date.now() + Math.round(COOLDOWN * this.intensity)
        }

        this.close()
    }

    onContextMenu(event)
    {
        if(this.suppressMenu)
        {
            event.preventDefault()
            this.suppressMenu = false
        }
    }

    close()
    {
        this.open = false
        this.activeIndex = null
        this.intensity = 0
        this.element.classList.remove('is-open')
    }

    draw()
    {
        const t = this.intensity

        // Green through yellow to red as the pull gets longer
        const color = t < 0.5
            ? `rgb(${Math.round(t * 2 * 255)}, ${Math.round(200 + t * 110)}, 60)`
            : `rgb(255, ${Math.round(255 - (t - 0.5) * 2 * 200)}, 40)`

        const ring = 48 + t * 120
        this.ringElement.style.width = `${ring}px`
        this.ringElement.style.height = `${ring}px`
        this.ringElement.style.opacity = this.disabled ? 0 : 0.15 + t * 0.4
        this.ringElement.style.background = `radial-gradient(circle, ${color.replace('rgb', 'rgba').replace(')', ', 0.25)')} 0%, transparent 70%)`
        this.ringElement.style.borderColor = color.replace('rgb', 'rgba').replace(')', ', 0.4)')

        const dot = 8 + t * 12
        this.dotElement.style.width = `${dot}px`
        this.dotElement.style.height = `${dot}px`
        this.dotElement.style.backgroundColor = this.disabled ? '#737373' : color

        this.labelElement.textContent = t < 0.15 ? '' : t >= 0.95 ? 'MAX!' : `${Math.round(t * 10) / 10}x`
        this.labelElement.style.color = color

        this.itemElements.forEach((element, index) =>
        {
            element.classList.toggle('is-active', index === this.activeIndex && !this.disabled)
        })
    }

    fire(x, y, item, intensity)
    {
        // Emoji confetti: more bursts, more pieces and more speed with intensity
        const origin = { x: x / window.innerWidth, y: y / window.innerHeight }
        const bursts = Math.round(2 + intensity * 8)
        const pieces = Math.round(5 + intensity * 25)

        for(let i = 0; i < bursts; i++)
        {
            const scalar = 1.5 + Math.random() * (3 + intensity * 4)

            confetti({
                particleCount: pieces,
                spread: 40 + intensity * 80 + Math.random() * 20,
                origin,
                shapes: [ confetti.shapeFromText({ text: item.emoji, scalar }) ],
                scalar,
                disableForReducedMotion: true,
                zIndex: 9999,
                startVelocity: 15 + intensity * 30 + Math.random() * 10,
                gravity: 0.6 + Math.random() * 0.4,
                drift: (Math.random() - 0.5) * (0.3 + intensity * 0.7),
            })
        }

        // Shockwave
        const wave = document.createElement('div')
        wave.className = 'reactions-wave'
        wave.style.left = `${x}px`
        wave.style.top = `${y}px`
        wave.style.setProperty('--color', item.color)
        wave.style.setProperty('--s', (0.4 + intensity * 0.8).toFixed(2))
        wave.style.setProperty('--flash', (2 + intensity * 2).toFixed(2))
        wave.innerHTML = `<i></i><i></i><i></i><b>${item.emoji}</b>`
        this.container.append(wave)
        setTimeout(() => { wave.remove() }, 1600)

        // A small shake, stronger with intensity
        this.container.style.setProperty('--shake', `${(0.5 + intensity * 2).toFixed(2)}`)
        this.container.classList.remove('is-shaking')
        void this.container.offsetWidth
        this.container.classList.add('is-shaking')
        setTimeout(() => { this.container.classList.remove('is-shaking') }, 400)
    }
}
