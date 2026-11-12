import { Game } from './Game.js'
import { explainers } from '../data/explainers.js'

/**
 * On a phone held upright the project boards in the world are too small to
 * read, so while one is open this card names what is on it in plain text.
 * Tapping it opens the full presentation.
 */
export class BoardCaption
{
    constructor()
    {
        this.game = Game.getInstance()
        this.onOpen = null

        this.element = document.createElement('button')
        this.element.className = 'board-caption'
        this.element.type = 'button'
        this.element.innerHTML = /* html */`
            <span class="board-caption-text">
                <b class="js-title"></b>
                <span class="js-line"></span>
            </span>
            <span class="board-caption-go">Open<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
        `
        this.game.domElement.append(this.element)

        this.titleElement = this.element.querySelector('.js-title')
        this.lineElement = this.element.querySelector('.js-line')

        this.element.addEventListener('click', () =>
        {
            this.element.blur()
            this.onOpen?.()
        })
    }

    show(item, onOpen)
    {
        if(!item)
            return

        this.onOpen = onOpen
        this.titleElement.textContent = item.title
        this.lineElement.textContent = explainers[item.id]?.line ?? item.description ?? ''
        this.element.classList.add('is-visible')
    }

    hide()
    {
        this.onOpen = null
        this.element.classList.remove('is-visible')
    }
}
