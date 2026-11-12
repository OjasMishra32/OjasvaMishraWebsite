import { Events } from './Events.js'

export class Viewport
{
    constructor(domElement)
    {
        this.domElement = domElement

        this.events = new Events()

        // Upper bound on the render resolution. Rendering.js lowers it on
        // machines that can't keep up.
        this.pixelRatioMax = 2

        // Total pixels the renderer is asked to fill, whatever the screen
        this.pixelBudget = 2.6e6

        this.measure()
        this.setResize()
    }

    measure()
    {
        const bounding = this.domElement.getBoundingClientRect()

        this.width = bounding.width
        this.height = bounding.height
        this.ratio = this.width / this.height

        this.pixelRatioPure = window.devicePixelRatio
        const budgetRatio = Math.sqrt(this.pixelBudget / Math.max(1, this.width * this.height))
        this.pixelRatio = Math.min(this.pixelRatioPure, this.pixelRatioMax, Math.max(1, budgetRatio))
    }

    setPixelRatioMax(value)
    {
        this.pixelRatioMax = value
        this.measure()
        this.pixelRatio = Math.min(this.pixelRatio, value)
        this.events.trigger('change')
    }

    setResize()
    {
        const throttleDuration = 400
        let throttleTimeout = null
        addEventListener('resize', () =>
        {
            this.measure()
            this.events.trigger('change')

            if(throttleTimeout)
            {
                clearTimeout(throttleTimeout)
            }

            throttleTimeout = setTimeout(() =>
            {
                throttleTimeout = null
                this.events.trigger('throttleChange')
            }, throttleDuration)
        })
    }
}