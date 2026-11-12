import gsap from 'gsap'

const DIAMETER = 50
const WRAP_PADDING = 8 // breathing room when hugging a target
const WRAP_RADIUS = 12 // corner radius while wrapped
const WRAP_EASE = 0.2 // how fast the cursor snaps to and from a target
const TARGET_PULL = 0.35 // fraction of the pointer offset the target travels
const TARGET_EASE = 0.25
const TARGET_MAX_PULL = 12 // px, so wide targets nudge instead of sliding far
const CURSOR_PARALLAX = 0.12 // extra lead of the cursor toward the pointer
const CURSOR_MAX_LEAD = 10

const TARGETS = '.btn, .icon-button, .nav-item, .nav-name, .sheet-close, .text-link, .badge'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const lerp = (a, b, t) => a + (b - a) * t

/**
 * The About page's cursor: a jelly ring that trails the pointer on a spring
 * and stretches with its speed. Over a button it morphs to hug the button,
 * and the button leans toward the pointer.
 *
 * Only on devices with a mouse, and only while the page is open.
 */
export class Cursor
{
    constructor(container)
    {
        this.container = container
        this.enabled = matchMedia('(hover: hover) and (pointer: fine)').matches
        this.running = false

        if(!this.enabled)
            return

        this.jellyElement = document.createElement('div')
        this.jellyElement.className = 'about-cursor-jelly'
        this.dotElement = document.createElement('div')
        this.dotElement.className = 'about-cursor-dot'
        container.append(this.jellyElement, this.dotElement)

        gsap.set(this.jellyElement, { xPercent: - 50, yPercent: - 50 })
        gsap.set(this.dotElement, { xPercent: - 50, yPercent: - 50 })

        const quick = (element, property, unit) => gsap.quickSetter(element, property, unit)
        this.set = {
            x: quick(this.jellyElement, 'x', 'px'),
            y: quick(this.jellyElement, 'y', 'px'),
            rotate: quick(this.jellyElement, 'rotate', 'deg'),
            scaleX: quick(this.jellyElement, 'scaleX'),
            scaleY: quick(this.jellyElement, 'scaleY'),
            width: quick(this.jellyElement, 'width', 'px'),
            height: quick(this.jellyElement, 'height', 'px'),
            radius: quick(this.jellyElement, 'borderRadius', 'px'),
            opacity: quick(this.jellyElement, 'opacity'),
            dotX: quick(this.dotElement, 'x', 'px'),
            dotY: quick(this.dotElement, 'y', 'px'),
            dotOpacity: quick(this.dotElement, 'opacity'),
        }

        this.position = { x: 0, y: 0 } // spring
        this.velocity = { x: 0, y: 0 }
        this.pointer = { x: 0, y: 0 } // raw
        this.jelly = { x: 0, y: 0, width: DIAMETER, height: DIAMETER, radius: DIAMETER / 2, scaleX: 1, scaleY: 1 }
        this.active = { element: null, base: null, offsetX: 0, offsetY: 0 }
        this.moved = false

        this.render = this.render.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onOver = this.onOver.bind(this)
        this.onLeave = this.onLeave.bind(this)
        this.onScroll = this.onScroll.bind(this)
    }

    start()
    {
        if(!this.enabled || this.running)
            return

        this.running = true
        this.moved = false
        this.set.opacity(0)
        this.set.dotOpacity(0)

        window.addEventListener('mousemove', this.onMove)
        this.container.addEventListener('pointerover', this.onOver)
        document.addEventListener('mouseleave', this.onLeave)
        window.addEventListener('blur', this.onLeave)
        this.container.addEventListener('scroll', this.onScroll, { passive: true, capture: true })
        gsap.ticker.add(this.render)
    }

    stop()
    {
        if(!this.running)
            return

        this.running = false
        this.release()
        this.container.classList.remove('has-cursor')
        this.set.opacity(0)
        this.set.dotOpacity(0)

        window.removeEventListener('mousemove', this.onMove)
        this.container.removeEventListener('pointerover', this.onOver)
        document.removeEventListener('mouseleave', this.onLeave)
        window.removeEventListener('blur', this.onLeave)
        this.container.removeEventListener('scroll', this.onScroll, { capture: true })
        gsap.ticker.remove(this.render)
    }

    onMove(event)
    {
        this.pointer.x = event.clientX
        this.pointer.y = event.clientY

        if(!this.moved)
        {
            this.moved = true
            this.position.x = event.clientX
            this.position.y = event.clientY
            this.container.classList.add('has-cursor')
        }

        gsap.to(this.position, {
            x: event.clientX,
            y: event.clientY,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            overwrite: true,
            onUpdate: () =>
            {
                this.velocity.x = (event.clientX - this.position.x) * 1.2
                this.velocity.y = (event.clientY - this.position.y) * 1.2
            },
        })
    }

    measure(element)
    {
        const bounding = element.getBoundingClientRect()
        return {
            left: bounding.left,
            top: bounding.top,
            width: bounding.width,
            height: bounding.height,
            centerX: bounding.left + bounding.width / 2,
            centerY: bounding.top + bounding.height / 2,
        }
    }

    acquire(element)
    {
        gsap.killTweensOf(element)
        this.active.element = element
        this.active.base = this.measure(element)
        this.active.offsetX = 0
        this.active.offsetY = 0
        this.jelly.x = this.position.x // the morph starts from where the cursor is
        this.jelly.y = this.position.y
        element.style.willChange = 'transform'
    }

    release()
    {
        const element = this.active.element

        if(element)
        {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.35)',
                clearProps: 'transform',
                onComplete: () => { element.style.willChange = '' },
            })
        }

        this.active.element = null
        this.active.base = null
        this.active.offsetX = 0
        this.active.offsetY = 0
    }

    onOver(event)
    {
        const target = event.target.closest?.(TARGETS) ?? null

        if(target === this.active.element)
            return

        if(this.active.element)
            this.release()

        if(target)
            this.acquire(target)
    }

    onLeave()
    {
        if(this.active.element)
            this.release()
    }

    // Keep the resting bounds right while the page scrolls under the pointer
    onScroll()
    {
        const { element, base } = this.active
        if(!element || !base)
            return

        const bounding = element.getBoundingClientRect()
        base.left = bounding.left - this.active.offsetX
        base.top = bounding.top - this.active.offsetY
        base.width = bounding.width
        base.height = bounding.height
        base.centerX = base.left + bounding.width / 2
        base.centerY = base.top + bounding.height / 2
    }

    render()
    {
        if(!this.moved)
            return

        const { set, pointer, active, jelly, position, velocity } = this

        set.dotX(pointer.x)
        set.dotY(pointer.y)

        if(active.element && active.base)
        {
            const base = active.base

            // The button leans toward the pointer
            const pullX = clamp((pointer.x - base.centerX) * TARGET_PULL, - TARGET_MAX_PULL, TARGET_MAX_PULL)
            const pullY = clamp((pointer.y - base.centerY) * TARGET_PULL, - TARGET_MAX_PULL, TARGET_MAX_PULL)
            active.offsetX = lerp(active.offsetX, pullX, TARGET_EASE)
            active.offsetY = lerp(active.offsetY, pullY, TARGET_EASE)
            gsap.set(active.element, { x: active.offsetX, y: active.offsetY })

            // The cursor hugs it
            const leadX = clamp((pointer.x - base.centerX) * CURSOR_PARALLAX, - CURSOR_MAX_LEAD, CURSOR_MAX_LEAD)
            const leadY = clamp((pointer.y - base.centerY) * CURSOR_PARALLAX, - CURSOR_MAX_LEAD, CURSOR_MAX_LEAD)
            jelly.x = lerp(jelly.x, base.centerX + active.offsetX + leadX, WRAP_EASE)
            jelly.y = lerp(jelly.y, base.centerY + active.offsetY + leadY, WRAP_EASE)
            jelly.width = lerp(jelly.width, base.width + WRAP_PADDING * 2, WRAP_EASE)
            jelly.height = lerp(jelly.height, base.height + WRAP_PADDING * 2, WRAP_EASE)
            jelly.radius = lerp(jelly.radius, WRAP_RADIUS, WRAP_EASE)
            jelly.scaleX = lerp(jelly.scaleX, 1, 0.3)
            jelly.scaleY = lerp(jelly.scaleY, 1, 0.3)

            set.x(jelly.x)
            set.y(jelly.y)
            set.width(jelly.width)
            set.height(jelly.height)
            set.radius(jelly.radius)
            set.scaleX(jelly.scaleX)
            set.scaleY(jelly.scaleY)
            set.rotate(0)
            set.opacity(1)
            set.dotOpacity(0) // one cursor at a time
        }
        else
        {
            // Free: springy position, squeezed along its direction of travel
            const speed = Math.hypot(velocity.x, velocity.y)
            const stretch = Math.min(speed / 735, 0.35)
            const angle = Math.atan2(velocity.y, velocity.x) * 180 / Math.PI

            jelly.x = position.x
            jelly.y = position.y
            jelly.width = lerp(jelly.width, DIAMETER + stretch * 300, 0.4)
            jelly.height = lerp(jelly.height, DIAMETER, 0.4)
            jelly.radius = lerp(jelly.radius, DIAMETER / 2, 0.4)
            jelly.scaleX = 1 + stretch
            jelly.scaleY = 1 - stretch * 2

            set.x(position.x)
            set.y(position.y)
            set.width(jelly.width)
            set.height(jelly.height)
            set.radius(jelly.radius)
            set.rotate(angle)
            set.scaleX(jelly.scaleX)
            set.scaleY(jelly.scaleY)
            set.opacity(1)
            set.dotOpacity(1)
        }
    }
}
