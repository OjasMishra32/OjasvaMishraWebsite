import { Game } from './Game.js'
import { person, projects, research, experience, emblems } from '../data/profile.js'
import { Cursor } from './About/Cursor.js'
import { Reactions } from './About/Reactions.js'
import { Keyboard } from './About/Keyboard.js'

const ARROW = '<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>'
const ICONS = {
    github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.500 12C23.500 5.650 18.350.500 12 .500Z"/></svg>',
    linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.570c0-1.330-.020-3.040-1.850-3.040-1.850 0-2.140 1.450-2.140 2.940v5.670H9.350V9h3.410v1.560h.050c.480-.900 1.640-1.850 3.370-1.850 3.600 0 4.270 2.370 4.270 5.460v6.280ZM5.340 7.430a2.060 2.060 0 1 1 0-4.130 2.060 2.060 0 0 1 0 4.130ZM7.120 20.450H3.560V9h3.560v11.450ZM22.220 0H1.770C.790 0 0 .770 0 1.730v20.540C0 23.230.790 24 1.770 24h20.450c.980 0 1.780-.770 1.780-1.730V1.730C24 .770 23.200 0 22.220 0Z"/></svg>',
    mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.970 5.700a1.940 1.940 0 0 1-2.060 0L2 7"/></svg>',
    world: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>',
    file: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
}

/**
 * The About page: everything in the world on one ordinary page, for someone
 * who has two minutes. It covers the screen (the world is paused behind it)
 * and is filled from data/profile.js. Projects and papers open their
 * presentation (Keynote.js) from here.
 */
export class Profile
{
    constructor()
    {
        this.game = Game.getInstance()

        this.modal = this.game.modals.items.get('profile')
        this.element = this.modal.element
        this.navElement = this.element.querySelector('.js-profile-nav')
        this.scrollerElement = this.element.querySelector('.js-profile-scroller')
        this.bodyElement = this.element.querySelector('.js-profile-body')
        this.pendingSection = 'top'

        this.sections = [
            { id: 'experience', label: 'Experience' },
            { id: 'research', label: 'Research' },
            { id: 'projects', label: 'Projects' },
            { id: 'contact', label: 'Contact' },
        ]

        this.render()
        this.setTriggers()
        this.setNavigation()
        this.setReveal()
        this.setChips()
        this.setEntries()
        this.setInputs()

        // From the previous site: the jelly cursor and right-click reactions
        this.cursor = new Cursor(this.element)
        this.reactions = new Reactions(this.element)
        this.keyboard = new Keyboard(this.bodyElement.querySelector('.about-hero'))

        this.modal.events.on('open', () =>
        {
            // Replay the entrance each time the page opens
            for(const element of this.revealElements)
                element.classList.remove('is-in')

            requestAnimationFrame(() =>
            {
                // Measured now: the page has no layout while it is hidden
                const section = this.bodyElement.querySelector(`.about-section[data-section="${this.pendingSection}"]`)
                this.scrollerElement.scrollTop = section && this.pendingSection !== 'top' ? Math.max(0, section.offsetTop - 70) : 0
                this.pendingSection = 'top'
                this.observeReveal()
                this.updateNavigation()
            })
        })

        // The page is opaque: no point drawing the world under it
        this.modal.events.on('opened', () =>
        {
            this.game.ticker.paused = true
            this.cursor.start()
            this.reactions.start()
            this.keyboard.start()
            this.scrollerElement.focus({ preventScroll: true })
        })

        this.modal.events.on('close', () =>
        {
            this.game.ticker.paused = false
            this.cursor.stop()
            this.reactions.stop()
            this.keyboard.stop()
        })
    }

    static escape(text)
    {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
    }

    /**
     * Mix a hex colour toward black (the sides of a chip)
     */
    static shade(hex, amount)
    {
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
        if(!match)
            return hex

        const channels = [ 1, 2, 3 ].map(index => Math.max(0, Math.min(255, Math.round(parseInt(match[index], 16) * amount))))
        return `rgb(${channels.join(',')})`
    }

    /**
     * A logo as a small extruded tile. It rests at an angle, floats while it
     * is on screen and leans toward the pointer.
     *
     * The thickness is a stack of flat slices: no filters, and nothing to
     * line up when the size changes.
     */
    chip(key, size = '')
    {
        const emblem = emblems[key]
        if(!emblem)
            return ''

        const index = this.chipCount++
        const slices = 7
        let html = ''

        for(let i = 0; i < slices; i++)
        {
            const t = i / (slices - 1)
            html += `<span class="chip-slice" style="background:${Profile.shade(emblem.bg, 0.28 + t * 0.42)}; --t:${t.toFixed(3)}"></span>`
        }

        const face = emblem.file
            ? `<img src="profile/emblems/${emblem.file}" alt="" loading="lazy" draggable="false">`
            : `<span class="chip-text">${Profile.escape(emblem.text)}</span>`

        return `<span class="chip js-chip ${size}" style="--chip-bg:${emblem.bg}; --n:${index % 7}" aria-hidden="true"><span class="chip-shadow"></span><span class="chip-float"><span class="chip-tilt">${html}<span class="chip-face">${face}<span class="chip-sheen"></span></span></span></span></span>`
    }

    render()
    {
        const e = Profile.escape
        const dash = (text) => e(text)
        this.chipCount = 0

        // Header
        this.navElement.innerHTML = `
            <button class="js-profile-nav-item nav-name" data-section="top">${e(person.name)}</button>
            <div class="nav-items">
                ${this.sections.map(section => `<button class="js-profile-nav-item nav-item" data-section="${section.id}">${e(section.label)}</button>`).join('')}
            </div>
        `

        // Hero
        const hero = `
            <section class="about-section about-hero" data-section="top" data-chip-track>
                <div class="hero-copy">
                    <p class="hero-hi blur-in js-reveal" style="--d:0">Hi, I am</p>
                    <h1 class="blur-in js-reveal" style="--d:1">${e(person.first)}<br>${e(person.last)}</h1>
                    <p class="hero-line blur-in js-reveal" style="--d:2">${e(person.line)}</p>
                    <ul class="credentials blur-in js-reveal" style="--d:3">
                        ${person.now.map(item => `<li><span class="credential-label">${e(item.label)}</span><span class="slash">/</span>${item.url ? `<a class="credential-detail" href="${e(item.url)}" target="_blank" rel="noreferrer">${e(item.detail)}</a>` : `<span class="credential-detail">${e(item.detail)}</span>`}</li>`).join('')}
                    </ul>
                    <div class="hero-buttons">
                        <span class="box-reveal js-reveal" style="--d:4"><a class="btn is-solid" href="${person.resume}" target="_blank" rel="noreferrer">${ICONS.file}Résumé</a></span>
                        <span class="box-reveal js-reveal" style="--d:5"><button class="btn js-profile-nav-item" data-section="contact">${ICONS.mail}Get in touch</button></span>
                        <span class="box-reveal js-reveal" style="--d:6"><button class="btn js-profile-world">${ICONS.world}Explore the 3D world</button></span>
                    </div>
                    <div class="hero-socials blur-in js-reveal" style="--d:6">
                        <a class="icon-button" href="${e(person.links.github)}" target="_blank" rel="noreferrer" aria-label="GitHub">${ICONS.github}</a>
                        <a class="icon-button" href="${e(person.links.linkedin)}" target="_blank" rel="noreferrer" aria-label="LinkedIn">${ICONS.linkedin}</a>
                        <a class="icon-button" href="mailto:${e(person.email)}" aria-label="Email">${ICONS.mail}</a>
                    </div>
                </div>
                <div class="hero-keyboard js-hero-keyboard">
                    <div class="keyboard-caption js-keyboard-caption"><b></b><span></span></div>
                </div>
                <div class="hero-chips">
                    ${person.now.map((item, index) => `<span class="hero-chip swing-in js-reveal" style="--d:${index + 3}">${this.chip(item.emblem, 'is-hero')}</span>`).join('')}
                </div>
            </section>
        `

        const header = (title, description) => `
            <header class="section-header">
                <div class="box-reveal js-reveal"><h2>${e(title)}</h2></div>
                <p class="fade-up js-reveal" style="--i:2">${e(description)}</p>
            </header>
        `

        // Experience
        const experienceHtml = `
            <section class="about-section" data-section="experience">
                ${header('Experience', 'Jobs, research and the teams I\'ve led.')}
                <div class="timeline">
                    ${experience.map(role => `
                        <article class="card role fade-up js-reveal" data-chip-track>
                            <div class="role-logo">${this.chip(role.company)}</div>
                            <div class="role-main">
                                <div class="role-top">
                                    <div>
                                        <h3>${e(role.title)}</h3>
                                        <div class="role-company">${role.url ? `<a href="${e(role.url)}" target="_blank" rel="noreferrer">${e(role.company)}${ARROW}</a>` : e(role.company)}</div>
                                        <p class="mono-note">${e(role.blurb)}</p>
                                    </div>
                                    <span class="badge ${role.period.includes('present') ? 'is-current' : ''}">${dash(role.period)}</span>
                                </div>
                                ${role.metrics?.length ? `<dl class="role-metrics">${role.metrics.map(([ value, label ]) => `<div><dt>${e(value)}</dt><dd>${e(label)}</dd></div>`).join('')}</dl>` : ''}
                                <ul class="role-points">${role.points.map(point => `<li>${e(point)}</li>`).join('')}</ul>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `

        // Research
        const researchHtml = `
            <section class="about-section" data-section="research">
                ${header('Research', 'Three papers on robot joints that hit their motor\'s torque limit, and the work around them.')}
                <ol class="papers">
                    ${research.map((entry, index) => `
                        <li class="card paper fade-up js-reveal" style="--i:${index % 3}">
                            <div class="paper-top"><span class="venue-pill">${e(entry.venue)}</span><span class="venue-status">${e(entry.status)}</span><span class="paper-year">${e(entry.year)}</span></div>
                            <h3>${e(entry.fullTitle)}</h3>
                            <p class="paper-authors">${e(entry.authors).replace('Ojasva Mishra', '<strong>Ojasva Mishra</strong>')}</p>
                            <p class="paper-abstract">${e(entry.summary)}</p>
                            <div class="paper-links">
                                <button class="text-link js-entry" data-type="research" data-id="${e(entry.id)}">See how it works${ARROW}</button>
                                ${(entry.links || []).map(link => `<a class="text-link" href="${e(link.url)}" target="_blank" rel="noreferrer">${e(link.label)}${ARROW}</a>`).join('')}
                            </div>
                        </li>
                    `).join('')}
                </ol>
            </section>
        `

        // Projects: the first two large, the rest in a grid
        const featured = projects.slice(0, 2)
        const others = projects.slice(2)

        const projectsHtml = `
            <section class="about-section" data-section="projects">
                ${header('Projects', 'Products, hackathon builds and research.')}
                <div class="featured">
                    ${featured.map(project => `
                        <button class="card featured-card fade-up js-reveal js-entry" data-type="projects" data-id="${e(project.id)}" data-chip-track>
                            <img class="project-strip" src="projects/images/${e(project.id)}-strip.webp" alt="" loading="lazy" decoding="async">
                            <div class="featured-body">
                            <div class="featured-main">
                                <p class="mono-label">${e(project.category)}</p>
                                <h3>${e(project.title)}</h3>
                                <p class="featured-tagline">${e(project.tagline)}</p>
                                <div class="featured-meta">
                                    <p class="meta-strong">${e(project.proof)}</p>
                                    <p>${e(project.role)}<span class="slash">/</span>${dash(project.period)}</p>
                                </div>
                            </div>
                            ${this.chip(project.id, 'is-large')}
                            </div>
                        </button>
                    `).join('')}
                </div>
                <div class="project-grid">
                    ${others.map((project, index) => `
                        <button class="card project fade-up js-reveal js-entry" data-type="projects" data-id="${e(project.id)}" style="--i:${index % 2}" data-chip-track>
                            <img class="project-strip" src="projects/images/${e(project.id)}-strip.webp" alt="" loading="lazy" decoding="async">
                            <div class="project-top"><span class="mono-label">${e(project.category)}</span><span>${dash(project.period)}</span></div>
                            <div class="project-main">
                                <h3>${e(project.title)}</h3>
                                <p class="project-tagline">${e(project.tagline)}</p>
                            </div>
                            <div class="project-foot">
                                <div>
                                    <p class="project-proof">${e(project.proof)}</p>
                                    <p class="project-role">${e(project.role)}${ARROW}</p>
                                </div>
                                ${this.chip(project.id)}
                            </div>
                        </button>
                    `).join('')}
                </div>
            </section>
        `

        // Contact
        const contact = `
            <section class="about-section about-contact" data-section="contact">
                ${header('Contact', 'The fastest way to reach me is email.')}
                <a class="contact-email fade-up js-reveal" href="mailto:${e(person.email)}">${e(person.email)}</a>
                <div class="contact-buttons fade-up js-reveal" style="--i:1">
                    <a class="btn is-solid" href="mailto:${e(person.email)}">${ICONS.mail}Email me</a>
                    <a class="btn" href="${e(person.links.linkedin)}" target="_blank" rel="noreferrer">${ICONS.linkedin}LinkedIn</a>
                    <a class="btn" href="${e(person.links.github)}" target="_blank" rel="noreferrer">${ICONS.github}GitHub</a>
                    <a class="btn" href="${person.resume}" target="_blank" rel="noreferrer">${ICONS.file}Résumé</a>
                </div>
            </section>
        `

        this.bodyElement.innerHTML = hero + experienceHtml + researchHtml + projectsHtml + contact
    }

    setTriggers()
    {
        for(const element of document.querySelectorAll('.js-profile-open'))
        {
            element.addEventListener('click', (event) =>
            {
                event.preventDefault()
                this.open(element.dataset.section || 'top')
            })
            element.addEventListener('keydown', (event) =>
            {
                // Space belongs to the vehicle
                if(event.code === 'Space')
                    event.preventDefault()
            })
        }
    }

    setNavigation()
    {
        this.navItems = [...this.element.querySelectorAll('.js-profile-nav-item')]
        this.sectionElements = [...this.bodyElement.querySelectorAll('.about-section')]

        for(const item of this.navItems)
        {
            item.addEventListener('click', () =>
            {
                this.scrollTo(item.dataset.section)
            })
        }

        // Highlight the section being read
        const update = this.updateNavigation = () =>
        {
            const top = this.scrollerElement.scrollTop + this.scrollerElement.clientHeight * 0.35
            let current = this.sectionElements[0]

            for(const section of this.sectionElements)
            {
                if(section.offsetTop <= top)
                    current = section
            }

            for(const item of this.navItems)
                item.classList.toggle('is-active', item.dataset.section !== 'top' && item.dataset.section === current.dataset.section)

            this.navElement.classList.toggle('is-scrolled', this.scrollerElement.scrollTop > 20)
        }

        this.scrollerElement.addEventListener('scroll', update, { passive: true })
        update()
    }

    /**
     * Things come in as they scroll into view
     */
    setReveal()
    {
        this.revealElements = [...this.bodyElement.querySelectorAll('.js-reveal')]

        this.revealObserver = new IntersectionObserver((entries) =>
        {
            for(const entry of entries)
            {
                if(entry.isIntersecting)
                {
                    entry.target.classList.add('is-in')
                    this.revealObserver.unobserve(entry.target)
                }
            }
        }, { root: this.scrollerElement, rootMargin: '0px 0px -60px 0px' })
    }

    observeReveal()
    {
        for(const element of this.revealElements)
            this.revealObserver.observe(element)
    }

    /**
     * Logo chips lean toward the pointer while it is over their card, and
     * only float while they are on screen
     */
    setChips()
    {
        const reset = (track) =>
        {
            for(const chip of track.querySelectorAll('.js-chip'))
            {
                chip.style.removeProperty('--px')
                chip.style.removeProperty('--py')
            }
        }

        let active = null

        this.bodyElement.addEventListener('pointermove', (event) =>
        {
            if(event.pointerType === 'touch')
                return

            const track = event.target.closest('[data-chip-track]')

            if(track !== active)
            {
                if(active)
                    reset(active)
                active = track
            }

            if(!track)
                return

            const bounding = track.getBoundingClientRect()
            const x = (event.clientX - bounding.left) / bounding.width - 0.5
            const y = (event.clientY - bounding.top) / bounding.height - 0.5

            for(const chip of track.querySelectorAll('.js-chip'))
            {
                chip.style.setProperty('--px', x.toFixed(3))
                chip.style.setProperty('--py', y.toFixed(3))
            }
        })

        this.bodyElement.addEventListener('pointerleave', () =>
        {
            if(active)
                reset(active)
            active = null
        })

        const observer = new IntersectionObserver((entries) =>
        {
            for(const entry of entries)
                entry.target.classList.toggle('is-floating', entry.isIntersecting)
        }, { root: this.scrollerElement, rootMargin: '120px' })

        for(const chip of this.bodyElement.querySelectorAll('.js-chip'))
            observer.observe(chip)
    }

    setEntries()
    {
        for(const element of this.bodyElement.querySelectorAll('.js-profile-world'))
        {
            element.addEventListener('click', () =>
            {
                this.game.modals.close()
            })
        }

        for(const element of this.bodyElement.querySelectorAll('.js-entry'))
        {
            element.addEventListener('click', () =>
            {
                this.game.keynote.open(element.dataset.type, element.dataset.id)
            })
        }
    }

    setInputs()
    {
        this.game.inputs.addActions([
            { name: 'profile', categories: [ 'modal', 'menu', 'wandering' ], keys: [ 'Keyboard.i', 'Keyboard.KeyI' ] },
        ])

        this.game.inputs.events.on('profile', (action) =>
        {
            if(!action.active)
                return

            if(this.modal.isOpen)
                this.game.modals.close()
            else
                this.open()
        })
    }

    scrollTo(sectionName, smooth = true)
    {
        const element = this.bodyElement.querySelector(`.about-section[data-section="${sectionName}"]`)
        if(!element)
            return

        const top = sectionName === 'top' ? 0 : Math.max(0, element.offsetTop - 70)
        this.scrollerElement.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
    }

    open(section = 'top')
    {
        if(this.modal.isOpen)
        {
            this.scrollTo(section)
            return
        }

        this.pendingSection = section
        this.game.modals.open('profile')
    }

    /**
     * Drive the visitor to the board that shows this entry and open it there
     */
    showInWorld(areaName, index)
    {
        // (on a phone the world may not be built yet)
        const area = this.game.world?.areas?.[areaName]
        this.game.modals.close()

        if(!area)
            return

        // Already browsing that board
        if(area.state === area.constructor.STATE_OPEN || area.state === area.constructor.STATE_OPENING)
        {
            area.changeProject(index)
            return
        }

        this.game.player.respawn(areaName, () =>
        {
            this.game.view.focusPoint.isTracking = true

            this.game.ticker.wait(2, () =>
            {
                area.changeProject(index, area.constructor.DIRECTION_NEXT, true, true)
                area.open()
            })
        })
    }
}
