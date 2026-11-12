import gsap from 'gsap'
import { skills } from '../../data/skills.js'

const SCENE = 'about/skills-keyboard.spline'
const REST = { scale: 0.2, x: 0, y: - 40, z: 0 }
const REST_COMPACT = { scale: 0.125, x: 0, y: 45, z: 0 }

/**
 * The skills keyboard from the previous site: a 3D keyboard whose keycaps
 * are the tools I use. It turns slowly, and hovering or pressing a key shows
 * what the tool is to me.
 *
 * The scene is a Spline file. Its runtime is large, so it is only fetched
 * when the About page is opened on a wide screen with a mouse, and the scene
 * only draws while the hero is on screen.
 */
export class Keyboard
{
    constructor(heroElement)
    {
        this.heroElement = heroElement
        this.element = heroElement.querySelector('.js-hero-keyboard')
        this.captionElement = this.element?.querySelector('.js-keyboard-caption')
        this.enabled = !!this.element && !matchMedia('(prefers-reduced-motion: reduce)').matches

        // Phones and narrow windows: the keyboard sits under the buttons, smaller, and answers to taps
        this.compact = !matchMedia('(min-width: 981px) and (hover: hover) and (pointer: fine)').matches

        this.app = null
        this.loading = false
        this.open = false
        this.visible = true
        this.selected = null
        this.byName = new Map(skills.map(skill => [ skill.name, skill ]))
    }

    start()
    {
        if(!this.enabled)
            return

        this.open = true

        if(this.app)
        {
            this.resume()
            return
        }

        if(!this.loading)
            this.load()
    }

    stop()
    {
        this.open = false

        // A phone is about to build the 3D world: hand the graphics memory back
        if(this.compact)
            this.destroy()
        else
            this.pause()
    }

    destroy()
    {
        if(!this.app)
            return

        this.spin?.kill()
        this.spin = null
        this.observer?.disconnect()
        this.app.dispose()
        this.app = null
        this.element.querySelector('canvas')?.remove()
        this.heroElement.classList.remove('has-keyboard')
        this.captionElement.classList.remove('is-visible')
        this.selected = null
    }

    pause()
    {
        if(!this.app)
            return

        this.spin?.pause()
        this.app.stop()
    }

    resume()
    {
        if(!this.app || !this.open || !this.visible)
            return

        this.app.play()
        this.spin?.play()
    }

    async load()
    {
        this.loading = true

        try
        {
            const { Application } = await import('@splinetool/runtime')

            const canvas = document.createElement('canvas')
            this.element.prepend(canvas)

            const app = new Application(canvas)
            await app.load(SCENE)

            // Closed while it was loading
            if(this.compact && !this.open)
            {
                app.dispose()
                canvas.remove()
                this.loading = false
                return
            }

            this.app = app

            this.setScene()
            this.heroElement.classList.add('has-keyboard')

            // The scene remembers where its canvas was on screen and only looks
            // again when the window scrolls. This page scrolls inside itself, so
            // tell it, or hovering goes to the wrong keys once the page has moved.
            if(!this.scrollBound)
            {
                this.scrollBound = true
                const root = this.heroElement.closest('.modal') ?? document
                root.addEventListener('scroll', () => { this.app?._onScroll?.() }, { capture: true, passive: true })
            }

            // On a phone the canvas must not swallow the finger that scrolls the
            // page. Touches pass through it, and a tap is handed to the scene as
            // a pointer resting on that spot, which is what its keys respond to.
            if(this.compact)
            {
                canvas.style.pointerEvents = 'none'

                if(!this.tapBound)
                {
                    this.tapBound = true
                    this.element.addEventListener('click', (event) =>
                    {
                        const target = this.element.querySelector('canvas')
                        if(!target)
                            return

                        this.app?._onScroll?.()

                        const init = { clientX: event.clientX, clientY: event.clientY, bubbles: true, cancelable: true, view: window }
                        target.dispatchEvent(new PointerEvent('pointermove', { ...init, pointerType: 'mouse', pointerId: 1 }))
                        target.dispatchEvent(new MouseEvent('mousemove', init))
                    })
                }
            }

            // Only draw while the hero is on screen
            this.observer = new IntersectionObserver(([ entry ]) =>
            {
                this.visible = entry.isIntersecting

                if(this.visible)
                    this.resume()
                else
                    this.pause()
            })
            this.observer.observe(this.element)

            if(!this.open)
                this.pause()
        }
        catch(error)
        {
            // The logo chips stay in its place
            console.warn('Keyboard scene failed to load', error)
            this.enabled = false
        }

        this.loading = false
    }

    setScene()
    {
        const app = this.app
        const rest = this.compact ? REST_COMPACT : REST
        const keyboard = app.findObjectByName('keyboard')
        const objects = app.getAllObjects()

        // The scene carries its own caption text and a phone layout: not used here
        for(const name of [ 'text-desktop-dark', 'text-desktop', 'text-mobile-dark', 'text-mobile', 'bongo-cat' ])
        {
            const object = app.findObjectByName(name)
            if(object)
                object.visible = false
        }

        for(const object of objects)
        {
            if(object.name === 'keycap-mobile')
                object.visible = false
        }

        if(keyboard)
        {
            keyboard.position.x = rest.x
            keyboard.position.y = rest.y
            keyboard.position.z = rest.z

            // Pops in, then the keycaps drop onto it
            gsap.fromTo(
                keyboard.scale,
                { x: 0.01, y: 0.01, z: 0.01 },
                { x: rest.scale, y: rest.scale, z: rest.scale, duration: 1.5, ease: 'elastic.out(1, 0.6)' }
            )

            objects.filter(object => object.name === 'keycap').forEach((keycap, index) =>
            {
                keycap.visible = false
                gsap.delayedCall(0.9 + index * 0.07, () =>
                {
                    keycap.visible = true
                    gsap.fromTo(keycap.position, { y: 200 }, { y: 50, duration: 0.5, delay: 0.1, ease: 'bounce.out' })
                })
            })

            objects.filter(object => object.name === 'keycap-desktop').forEach((keycap, index) =>
            {
                keycap.visible = false
                gsap.delayedCall(0.9 + index * 0.07, () => { keycap.visible = true })
            })

            // A slow turn, there and back
            this.spin = gsap.to(keyboard.rotation, {
                y: Math.PI * 2 + keyboard.rotation.y,
                duration: 10,
                repeat: - 1,
                yoyo: true,
                yoyoEase: true,
                ease: 'back.inOut',
                delay: 2.5,
            })
        }

        // Hovering or pressing a key names the tool
        const show = (skill) =>
        {
            if(this.selected === skill)
                return

            this.selected = skill
            this.captionElement.classList.toggle('is-visible', !!skill)

            if(skill)
            {
                this.captionElement.querySelector('b').textContent = skill.label
                this.captionElement.querySelector('span').textContent = skill.description
            }
        }

        app.addEventListener('mouseHover', (event) =>
        {
            const skill = this.byName.get(event.target.name)

            if(skill)
                show(skill)
            else if(event.target.name === 'body' || event.target.name === 'platform')
                show(null)
        })

        app.addEventListener('keyDown', (event) =>
        {
            const skill = this.byName.get(event.target.name)
            if(skill)
                show(skill)
        })

        app.addEventListener('keyUp', () => { if(!this.compact) show(null) })
    }
}
