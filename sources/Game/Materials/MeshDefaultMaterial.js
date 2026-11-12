import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import { Fn, color, float, frontFacing, If, max, mix, normalWorld, positionWorld, vec2, vec3, vec4 } from 'three/tsl'

export class MeshDefaultMaterial extends THREE.MeshLambertNodeMaterial
{
    static revealDiscardNodeBuilder = (game, outputColor) =>
    {
        return Fn(([ outputColor ]) =>
        {
            const distanceToCenter = positionWorld.xz.sub(game.reveal.position2Uniform).length()
            distanceToCenter.greaterThan(game.reveal.distance).discard()

            const revealMix = distanceToCenter.step(game.reveal.distance.sub(game.reveal.thickness))
            // const revealMix = game.reveal.distance.sub(distanceToCenter).oneMinus().max(0).pow(4)
            const revealColor = game.reveal.color.mul(game.reveal.intensity)
            return mix(outputColor.rgb, revealColor, revealMix)
        })(outputColor)
    }
    
    constructor(parameters = {})
    {
        super()

        this.game = Game.getInstance()

        this.depthWrite = parameters.depthWrite ?? true
        this.depthTest = parameters.depthTest ?? true
        this.side = parameters.side ?? THREE.FrontSide
        this.wireframe = parameters.wireframe ?? false
        this.transparent = parameters.transparent ?? false
        this.shadowSide = parameters.shadowSide ?? THREE.FrontSide

        this.hasCoreShadows = parameters.hasCoreShadows ?? true
        this.hasDropShadows = parameters.hasDropShadows ?? true
        this.hasLightBounce = parameters.hasLightBounce ?? true
        this.hasFog = parameters.hasFog ?? true
        this.hasWater = parameters.hasWater ?? true
        this.hasReveal = parameters.hasReveal ?? true
        this.hasGrid = parameters.hasGrid ?? false
        this.hasPulse = parameters.hasPulse ?? this.hasGrid

        this._colorNode = parameters.colorNode ?? color(0xffffff)
        this._normalNode = parameters.normalNode ?? normalWorld
        this._alphaNode = parameters.alphaNode ?? float(1)
        this._shadowNode = parameters.shadowNode ?? float(0)
        this.alphaTest = parameters.alphaTest ?? 0.1

        this.normalNode = this._normalNode // Get rid of warning
        
        /**
         * Shadow catcher
         * Catch shadow as a float and remove it from initial pipeline
         */
        const catchedShadow = float(1).toVar()

        if(this.hasDropShadows)
        {
            this.receivedShadowNode = Fn(([ shadow ]) => 
            {
                catchedShadow.mulAssign(shadow.r)
                return float(1)
            })
        }

        /**
         * Output node
         */
        this.outputNode = Fn(() =>
        {
            const baseColor = this._colorNode.toVar()
            const outputColor = this._colorNode.toVar()
            // outputColor.assign(vec3(0))
            // outputColor.assign(vec3(0.8))

            // Normal orientation
            const reorientedNormal = this._normalNode.toVar()
            if(this.side === THREE.DoubleSide || this.side === THREE.BackSide)
            {
                If(frontFacing.not(), () => { reorientedNormal.mulAssign(-1) })
            }

            // Light bounce
            if(this.hasLightBounce)
            {
                const bounceOrientation = reorientedNormal.dot(vec3(0, - 1, 0)).smoothstep(this.game.lighting.lightBounceEdgeLow, this.game.lighting.lightBounceEdgeHigh)
                const bounceDistance = this.game.lighting.lightBounceDistance.sub(max(0, positionWorld.y)).div(this.game.lighting.lightBounceDistance).max(0).pow(2)
                const terrainData = this.game.terrain.terrainNode(positionWorld.xz)
                const bounceColor = this.game.terrain.colorNode(terrainData)
                outputColor.assign(mix(outputColor, bounceColor, bounceOrientation.mul(bounceDistance).mul(this.game.lighting.lightBounceMultiplier)))
            }

            // Water
            if(this.hasWater)
            {
                const nearWaterSurface = positionWorld.y.sub(this.game.water.surfaceElevationUniform).abs().greaterThan(this.game.water.surfaceThicknessUniform)
                outputColor.assign(nearWaterSurface.select(outputColor, color('#ffffff')))
                baseColor.assign(nearWaterSurface.select(baseColor, color('#ffffff')))
            }

            // Light
            outputColor.mulAssign(this.game.lighting.colorUniform.mul(this.game.lighting.intensityUniform))

            // Core shadow
            let coreShadowMix = float(0)
            if(this.hasCoreShadows)
                coreShadowMix = reorientedNormal.dot(this.game.lighting.directionUniform).smoothstep(this.game.lighting.coreShadowEdgeHigh, this.game.lighting.coreShadowEdgeLow)
            
            // Cast shadow
            let dropShadowMix = float(0)
            if(this.hasDropShadows)
                dropShadowMix = catchedShadow.oneMinus()

            // Combined shadows
            if(this.hasCoreShadows || this.hasDropShadows)
            {
                const combinedShadowMix = max(coreShadowMix, dropShadowMix, this._shadowNode).clamp(0, 1)
                
                const shadowColor = baseColor.rgb.mul(this.game.lighting.shadowColor).rgb
                outputColor.assign(mix(outputColor, shadowColor, combinedShadowMix))
            }
            
            // Measurement grid and lidar pulse (see Scan.js)
            if(this.hasGrid || this.hasPulse)
            {
                const scan = this.game.scan
                let lines = float(0)

                if(this.hasGrid)
                {
                    // One line per metre on each axis, skipped on faces that look down that axis
                    const toLine = positionWorld.fract().sub(0.5).abs()
                    const edge = float(0.5).sub(scan.lineWidth)
                    const facing = reorientedNormal.abs()
                    const lineX = toLine.x.smoothstep(edge, 0.5).mul(facing.x.oneMinus())
                    const lineY = toLine.y.smoothstep(edge, 0.5).mul(facing.y.oneMinus())
                    const lineZ = toLine.z.smoothstep(edge, 0.5).mul(facing.z.oneMinus())
                    lines = max(lineX, max(lineY, lineZ))
                }

                const toPulse = positionWorld.xz.sub(scan.center).length().sub(scan.radius).abs()
                const pulse = toPulse.smoothstep(0, scan.width).oneMinus().mul(scan.strength)

                outputColor.addAssign(scan.color.mul(
                    float(lines).mul(scan.gridIntensity).add(pulse.mul(float(lines).mul(4).add(0.4)))
                ))
            }

            // Fog
            if(this.hasFog)
                outputColor.assign(this.game.fog.strength.mix(outputColor, this.game.fog.color))

            // Alpha test discard
            this._alphaNode.lessThan(this.alphaTest).discard()

            // Reveal
            if(this.hasReveal)
                outputColor.assign(MeshDefaultMaterial.revealDiscardNodeBuilder(this.game, outputColor))

            // Testing only: #cold=n changes every shader a little, so browsers compile them afresh
            const cold = Number(location.hash.match(/cold=(\d+)/)?.[1] ?? 0)
            if(cold)
                outputColor.addAssign(float(cold * 0.0000001))

            // Output
            return vec4(outputColor, this._alphaNode)
        })()
    }
}