import { Events } from './Events.js'
import { Game } from './Game.js'

export class Quality
{
    constructor()
    {
        this.game = Game.getInstance()

        this.events = new Events()

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

        // Safari, and every browser on iPhone and iPad, compiles shaders one
        // at a time and slowly (about 0.7 s for each lit, shadowed material).
        // There the world runs without shadow maps and at the lighter
        // post-processing level, which removes most of that work.
        this.isWebKit = /AppleWebKit/i.test(navigator.userAgent) && !/Chrome|Chromium|Edg\//i.test(navigator.userAgent)
        this.light = this.isWebKit || isMobile || /lite/i.test(location.hash)

        this.level = this.light ? 1 : 0 // 0 = highest quality

        // Debug
        if(this.game.debug.active)
        {
            const debugPanel = this.game.debug.panel.addFolder({
                title: '⚙️ Quality',
                expanded: false,
            })

            this.game.debug.addButtons(
                debugPanel,
                {
                    low: () =>
                    {
                        this.changeLevel(1)
                    },
                    high: () =>
                    {
                        this.changeLevel(0)
                    },
                },
                'change'
            )
        }
    }

    changeLevel(level = 0)
    {
        // Same
        if(level === this.level)
            return
            
        this.level = level
        this.events.trigger('change', [ this.level ])
    }
}