import { Game } from './Game.js'

/**
 * Compiles every material before the world is revealed, so nothing freezes
 * later when it first comes into view.
 *
 * It draws one real frame, through the same passes the world is drawn with,
 * with everything visible and nothing culled. Drawing into some other target
 * (a cube map, say) would compile a second set of pipelines that the world
 * never uses, which doubles the wait in Safari.
 */
export class PreRenderer
{
    static render()
    {
        const game = Game.getInstance()

        const hidden = []
        const culled = []

        game.scene.traverse((child) =>
        {
            if(child.visible === false && typeof child.userData.preventPreRender === 'undefined')
            {
                child.visible = true
                hidden.push(child)
            }

            if(child.frustumCulled)
            {
                child.frustumCulled = false
                culled.push(child)
            }
        })

        try
        {
            game.rendering.postProcessing.render()
        }
        finally
        {
            for(const child of hidden)
                child.visible = false

            for(const child of culled)
                child.frustumCulled = true
        }
    }
}
