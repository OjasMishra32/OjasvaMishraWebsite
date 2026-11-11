import { Game } from './Game.js'
import { person, projects, research, experience, emblems } from '../data/profile.js'

/**
 * The short version: one page with everything that is in the world, for
 * someone who has two minutes. A full-screen sheet over the 3D scene, filled
 * from data/profile.js. Projects and papers open their presentation
 * (Keynote.js) from here.
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
        this.pendingScroll = 0

        this.sections = [
            { id: 'experience', label: 'Experience' },
            { id: 'projects', label: 'Projects' },
            { id: 'research', label: 'Research' },
            { id: 'contact', label: 'Contact' },
        ]

        this.render()
        this.setTriggers()
        this.setNavigation()
        this.setReveal()
        this.setEntries()
        this.setInputs()

        this.modal.events.on('open', () =>
        {
            // Replay the entrance each time the sheet opens
            for(const element of this.revealElements)
                element.classList.remove('is-in')

            requestAnimationFrame(() =>
            {
                this.scrollerElement.scrollTop = this.pendingScroll
                this.pendingScroll = 0
                this.observeReveal()
                this.updateNavigation()
            })
        })

        this.modal.events.on('opened', () =>
        {
            this.scrollerElement.focus({ preventScroll: true })
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

    emblem(key, fallbackName)
    {
        const file = emblems[key]

        if(file)
            return `<span class="emblem"><img src="profile/emblems/${file}" alt="" loading="lazy" draggable="false"></span>`

        return `<span class="emblem is-monogram">${Profile.escape(fallbackName)}</span>`
    }

    pill(link, solid = false)
    {
        const e = Profile.escape
        const external = !link.url.startsWith('mailto:')
        return `<a class="pill ${solid ? 'is-solid' : ''}" href="${e(link.url)}" ${external ? 'target="_blank" rel="noreferrer"' : ''}>${e(link.label)}${external ? '<span class="arrow" aria-hidden="true">↗</span>' : ''}</a>`
    }

    metrics(list)
    {
        if(!list || !list.length)
            return ''

        const e = Profile.escape
        return `<div class="metrics">${list.map(([ value, label ]) => `<div class="metric"><div class="metric-value">${e(value)}</div><div class="metric-label">${e(label)}</div></div>`).join('')}</div>`
    }

    render()
    {
        const e = Profile.escape

        // Top bar
        this.navElement.innerHTML = `
            <button class="js-profile-nav-item nav-name" data-section="top">${e(person.name)}</button>
            <div class="nav-items">
                ${this.sections.map(section => `<button class="js-profile-nav-item nav-item" data-section="${section.id}">${e(section.label)}</button>`).join('')}
            </div>
            <a class="nav-resume" href="${person.resume}" target="_blank" rel="noreferrer">Résumé</a>
        `

        // Hero
        const hero = `
            <section class="section hero" data-section="top">
                <div class="hero-text">
                    <p class="eyebrow js-reveal">${e(person.headline)}</p>
                    <h1 class="js-reveal" style="--i:1">${e(person.first)}<br>${e(person.last)}</h1>
                    <p class="lead js-reveal" style="--i:2">${e(person.summary[1])}</p>
                    <div class="actions js-reveal" style="--i:3">
                        ${this.pill({ label: 'Résumé', url: person.resume }, true)}
                        ${this.pill({ label: 'Email', url: `mailto:${person.email}` })}
                        ${this.pill({ label: 'GitHub', url: person.links.github })}
                        ${this.pill({ label: 'LinkedIn', url: person.links.linkedin })}
                    </div>
                </div>
                <div class="portrait js-reveal" style="--i:2"><img src="profile/me.jpg" alt="${e(person.name)}" draggable="false"></div>
            </section>
            <section class="now">
                ${person.now.map((item, index) => `
                    <${item.url ? `a href="${e(item.url)}" target="_blank" rel="noreferrer"` : 'div'} class="glass now-tile js-reveal" style="--i:${index}">
                        <div class="now-head">${this.emblem(item.emblem, item.monogram)}<span class="now-status">Now</span></div>
                        <div class="now-metric">${e(item.metric[0])}</div>
                        <div class="now-metric-label">${e(item.metric[1])}</div>
                        <div class="now-role">${e(item.label)}</div>
                        <div class="now-place">${e(item.detail)}</div>
                    </${item.url ? 'a' : 'div'}>
                `).join('')}
            </section>
        `

        // Experience
        const experienceHtml = `
            <section class="section" data-section="experience">
                <header class="section-header js-reveal">
                    <h2>Experience</h2>
                    <p>Where I've worked, newest first.</p>
                </header>
                <div class="roles">
                    ${experience.map((role, index) => `
                        <article class="glass role js-reveal" style="--i:${Math.min(index, 2)}">
                            <div class="role-head">
                                ${this.emblem(role.company, role.monogram)}
                                <div class="role-title">
                                    <h3>${e(role.title)}</h3>
                                    <div class="company">${role.url ? `<a href="${e(role.url)}" target="_blank" rel="noreferrer">${e(role.company)}</a>` : e(role.company)}</div>
                                    <div class="blurb">${e(role.blurb)}</div>
                                </div>
                                <div class="period ${role.period.includes('present') ? 'is-current' : ''}">${e(role.period)}</div>
                            </div>
                            ${this.metrics(role.metrics)}
                            <ul class="points">${role.points.map(point => `<li>${e(point)}</li>`).join('')}</ul>
                        </article>
                    `).join('')}
                </div>
            </section>
        `

        // Projects
        const projectsHtml = `
            <section class="section" data-section="projects">
                <header class="section-header js-reveal">
                    <h2>Projects</h2>
                    <p>Open one to see how it works.</p>
                </header>
                <div class="work-grid">
                    ${projects.map((project, index) => `
                        <button class="glass work js-entry js-reveal" data-type="projects" data-id="${e(project.id)}" style="--i:${index % 3}">
                            <div class="work-image"><img src="projects/images/${e(project.images[0])}" alt="" loading="lazy" draggable="false"></div>
                            <div class="work-body">
                                <div class="work-kicker">${e(project.category)}</div>
                                <h3>${e(project.title)}</h3>
                                <p>${e(project.tagline)}</p>
                                <div class="work-proof">${e(project.proof)}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </section>
        `

        // Research
        const researchHtml = `
            <section class="section" data-section="research">
                <header class="section-header js-reveal">
                    <h2>Research</h2>
                    <p>Three papers on robot joints at their torque limit, and the work around them.</p>
                </header>
                <div class="work-grid is-research">
                    ${research.map((entry, index) => `
                        <button class="glass work js-entry js-reveal" data-type="research" data-id="${e(entry.id)}" style="--i:${index % 2}">
                            <div class="work-image"><img src="lab/images/${e(entry.image)}" alt="" loading="lazy" draggable="false"></div>
                            <div class="work-body">
                                <div class="work-kicker">${e(entry.venue)}</div>
                                <h3>${e(entry.fullTitle)}</h3>
                                <p>${e(entry.summary)}</p>
                                <div class="work-proof">${e(entry.status)}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </section>
        `

        // Contact
        const contact = `
            <section class="section contact" data-section="contact">
                <header class="section-header js-reveal">
                    <h2>Contact</h2>
                </header>
                <a class="email js-reveal" href="mailto:${e(person.email)}">${e(person.email)}</a>
                <div class="actions js-reveal" style="--i:1">
                    ${this.pill({ label: 'LinkedIn', url: person.links.linkedin })}
                    ${this.pill({ label: 'GitHub', url: person.links.github })}
                    ${this.pill({ label: 'Instagram', url: person.links.instagram })}
                    ${this.pill({ label: 'Résumé', url: person.resume })}
                </div>
            </section>
        `

        this.bodyElement.innerHTML = hero + experienceHtml + projectsHtml + researchHtml + contact
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
        this.navItems = [...this.navElement.querySelectorAll('.js-profile-nav-item')]
        this.sectionElements = [...this.bodyElement.querySelectorAll('.section')]

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
     * Things rise into place as they scroll into view, and tiles get a soft
     * light under the pointer
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
        }, { root: this.scrollerElement, rootMargin: '0px 0px -6% 0px' })

        this.bodyElement.addEventListener('pointermove', (event) =>
        {
            const glass = event.target.closest('.glass')
            if(!glass)
                return

            const bounding = glass.getBoundingClientRect()
            glass.style.setProperty('--light-x', `${event.clientX - bounding.left}px`)
            glass.style.setProperty('--light-y', `${event.clientY - bounding.top}px`)
        })
    }

    observeReveal()
    {
        for(const element of this.revealElements)
            this.revealObserver.observe(element)
    }

    setEntries()
    {
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
        const element = this.bodyElement.querySelector(`.section[data-section="${sectionName}"]`)
        if(!element)
            return

        const top = sectionName === 'top' ? 0 : Math.max(0, element.offsetTop - 84)

        if(smooth)
            this.scrollerElement.scrollTo({ top, behavior: 'smooth' })
        else
            this.pendingScroll = top
    }

    open(section = 'top')
    {
        if(this.modal.isOpen)
        {
            this.scrollTo(section)
            return
        }

        this.scrollTo(section, false)
        this.game.modals.open('profile')
    }

    /**
     * Drive the visitor to the board that shows this entry and open it there
     */
    showInWorld(areaName, index)
    {
        const area = this.game.world.areas?.[areaName]
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
