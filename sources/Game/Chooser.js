import { Game } from './Game.js'
import { person } from '../data/profile.js'

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>'

/**
 * The first screen: the visitor picks the 3D world or the 2D page.
 *
 * The world is the larger choice, with four shots of it fading into one
 * another (the start, the role plaques, a project board, the contact stop),
 * because it is the one worth the visit. The page is there for anyone in a hurry. Both stay
 * one button away afterwards ("About me" in the world, "Explore the 3D
 * world" on the page).
 *
 * Skipped by the hash switches that already say where to go (#world, #about…).
 */
export class Chooser
{
    constructor()
    {
        this.game = Game.getInstance()
        this.active = !location.hash.match(/skip|world|about|profile|resume/i)
        this.choice = null

        if(!this.active)
            return

        this.element = document.createElement('div')
        this.element.className = 'chooser'
        this.element.innerHTML = /* html */`
            <div class="chooser-inner">
                <header class="chooser-head">
                    <img class="chooser-photo" src="profile/me-square.webp" alt="${person.name}" width="72" height="72">
                    <div>
                        <h1>${person.name}</h1>
                        <p>I work on robot control and AI agents.</p>
                    </div>
                </header>
                <div class="chooser-options">
                    <button class="chooser-card is-world js-choose" data-choice="world" type="button">
                        <span class="chooser-shot" style="background-image:url(ui/previews/world-1.webp)">${[ 1, 2, 3, 4 ].map(index => `<img src="ui/previews/world-${index}.webp" alt="" draggable="false" style="--n:${index - 1}">`).join('')}</span>
                        <span class="chooser-body">
                            <span class="chooser-text">
                                <b>Explore the 3D world</b>
                                <span>Drive a rover through six stops: my experience, projects, research and how to reach me.</span>
                            </span>
                            <span class="chooser-go">Start driving${ARROW}</span>
                        </span>
                    </button>
                    <button class="chooser-card is-page js-choose" data-choice="page" type="button">
                        <span class="chooser-body">
                            <span class="chooser-text">
                                <b>Read the 2D page</b>
                                <span>The same things on one scrolling page.</span>
                            </span>
                            <span class="chooser-go"><span>Open<span class="chooser-wide"> the page</span></span>${ARROW}</span>
                        </span>
                    </button>
                </div>
            </div>
        `
        this.game.domElement.append(this.element)
        document.documentElement.classList.add('is-choosing')

        // Nothing typed or pressed here reaches the world underneath
        for(const type of [ 'mousedown', 'touchstart', 'keydown' ])
            this.element.addEventListener(type, (event) => { event.stopPropagation() })

        for(const button of this.element.querySelectorAll('.js-choose'))
        {
            button.addEventListener('click', () =>
            {
                this.choose(button.dataset.choice)
            })
        }
    }

    choose(choice)
    {
        if(this.choice)
            return

        this.choice = choice
        document.documentElement.classList.remove('is-choosing')
        this.element.classList.add('is-leaving')
        setTimeout(() => { this.element.remove() }, 700)

        if(choice === 'world')
            this.game.enterWorld()
        else
            this.game.profile.open()
    }
}
