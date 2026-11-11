import * as THREE from 'three/webgpu'
import { Cycles } from './Cycles.js'

// The world is always the rover's map of it: dark, with light coming off the
// grid. The cycle only shifts its mood, from cold blue through violet to deep night.
const presets = {
    day:   { revealColor: new THREE.Color('#39b7ff'), revealIntensity: 10, electricField: 0, temperature: 5, lightColor: new THREE.Color('#e8eeff'), lightIntensity: 1.35, shadowColor: new THREE.Color('#39457a'), fogColorA: new THREE.Color('#0a0f22'), fogColorB: new THREE.Color('#141a3a'), fogNearRatio: 0.315, fogFarRatio: 1.25 },
    dusk:  { revealColor: new THREE.Color('#a47bff'), revealIntensity: 7, electricField: 0.25, temperature: 0, lightColor: new THREE.Color('#f0dcff'), lightIntensity: 1.3, shadowColor: new THREE.Color('#4a3a86'), fogColorA: new THREE.Color('#120b2a'), fogColorB: new THREE.Color('#2a1245'), fogNearRatio: 0.1, fogFarRatio: 1.25 },
    night: { revealColor: new THREE.Color('#39b7ff'), revealIntensity: 10, electricField: 1, temperature: -7.5, lightColor: new THREE.Color('#b9c6ff'), lightIntensity: 1.15, shadowColor: new THREE.Color('#232a5c'), fogColorA: new THREE.Color('#05070f'), fogColorB: new THREE.Color('#0c0a22'), fogNearRatio: -0.4, fogFarRatio: 1.1 },
    dawn:  { revealColor: new THREE.Color('#2ee6a8'), revealIntensity: 7, electricField: 0.25, temperature: 0, lightColor: new THREE.Color('#d8f4ff'), lightIntensity: 1.3, shadowColor: new THREE.Color('#2f5a7a'), fogColorA: new THREE.Color('#071420'), fogColorB: new THREE.Color('#0f2a3a'), fogNearRatio: 0.2, fogFarRatio: 1.25 },
}

export class DayCycles extends Cycles
{
    constructor()
    {
        const forcedProgress = import.meta.env.VITE_DAY_CYCLE_PROGRESS ? parseFloat(import.meta.env.VITE_DAY_CYCLE_PROGRESS) : null
        super('🕜 Day Cycles', 4 * 60, forcedProgress, false)
    }

    get presets()
    {
        return presets
    }

    getKeyframesDescriptions()
    {
        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(this, 'duration', { min: 1, max: 60 * 10, step: 1 })

            for(const presetKey in presets)
            {
                const preset = presets[presetKey]
                const presetsDebugPanel = this.debugPanel.addFolder({
                    title: presetKey,
                    expanded: true,
                })

                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.revealColor, 'revealColor')
                presetsDebugPanel.addBinding(preset, 'revealIntensity', { min: 0, max: 20, step: 0.001 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.lightColor, 'lightColor')
                presetsDebugPanel.addBinding(preset, 'lightIntensity', { min: 0, max: 20 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.shadowColor, 'shadowColor')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorA, 'fogColorA')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorB, 'fogColorB')
                presetsDebugPanel.addBinding(preset, 'fogNearRatio', { label: 'near', min: -2, max: 2, step: 0.001 })
                presetsDebugPanel.addBinding(preset, 'fogFarRatio', { label: 'far', min: -2, max: 2, step: 0.001 })
            }
        }

        return [
            [
                { properties: presets.day, stop: 0.0 }, // day
                { properties: presets.day, stop: 0.15 }, // day
                { properties: presets.dusk, stop: 0.25 }, // Dusk
                { properties: presets.night, stop: 0.35 }, // Night
                { properties: presets.night, stop: 0.6 }, // Night
                { properties: presets.dawn, stop: 0.8 }, // Dawn
                { properties: presets.day, stop: 0.9 }, // day
            ]
        ]
    }

    getIntervalDescriptions()
    {
        return [
            { name: 'night', start: 0.25, end: 0.7 },
            { name: 'deepNight', start: 0.35, end: 0.6 },
        ]
    }
}