import * as THREE from 'three/webgpu'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import { Kit } from '../Kit.js'
import { person } from '../../../data/profile.js'

/**
 * The contact plaza: a ring of sculptures, one per way to reach me, around a
 * row of letters you can drive through.
 */
export class SocialArea extends Area
{
    // Sculptures in the model that have a link here. Everything else that
    // came with the model (other networks, a statue of its author) is removed.
    static KEEP = [ 'mail', 'github', 'linkedin' ]

    static prepare(model)
    {
        SocialArea.pedestals = new Map()

        for(const child of [...model.children])
        {
            const name = child.name.replace(/PhysicalDynamic.*$/i, '').toLowerCase()
            const isSculpture = /PhysicalDynamic/i.test(child.name)

            if(isSculpture && SocialArea.KEEP.includes(name))
            {
                SocialArea.pedestals.set(name, child.position.clone().add(model.position))
                continue
            }

            const isReference = /^ref(Center|Zone)/i.test(child.name)
            if(!isReference)
                child.removeFromParent()
        }

        return model
    }

    constructor(model)
    {
        super(SocialArea.prepare(model))

        this.center = this.references.items.get('center')[0].position.clone()
        this.center.y = 0

        this.setLinks()
        this.setLetters()
        this.setAchievement()
    }

    createPoint(position, label, align, url)
    {
        return this.game.interactivePoints.create(
            position,
            label,
            align,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                window.open(url, '_blank')
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setLinks()
    {
        const links = [
            { pedestal: 'mail', label: 'Email me', url: `mailto:${person.email}` },
            { pedestal: 'github', label: 'GitHub', url: person.links.github },
            { pedestal: 'linkedin', label: 'LinkedIn', url: person.links.linkedin },
        ]

        for(const link of links)
        {
            const pedestal = SocialArea.pedestals.get(link.pedestal)

            if(!pedestal)
                continue

            // Stand the marker between the sculpture and the middle of the plaza
            const toCenter = this.center.clone().sub(pedestal)
            toCenter.y = 0
            toCenter.normalize()

            const position = pedestal.clone().addScaledVector(toCenter, 2)
            position.y = 1

            const align = pedestal.x < this.center.x ? InteractivePoints.ALIGN_LEFT : InteractivePoints.ALIGN_RIGHT
            this.createPoint(position, link.label, align, link.url)
        }

        // The résumé doesn't have a sculpture: its marker stands by the letters
        const resumePosition = this.center.clone()
        resumePosition.x += 3.2
        resumePosition.y = 1
        resumePosition.z += 2.2
        this.createPoint(resumePosition, 'Résumé', InteractivePoints.ALIGN_RIGHT, person.resume)
    }

    setLetters()
    {
        this.letters = Kit.physicalLetters({
            text: 'SAY HI',
            center: this.center,
            rotationY: Math.PI * 0.14,
            size: 1.7,
            depth: 0.5,
            colorName: '#f2f5ff',
            mass: 0.2,
            onCollision: (force, position) =>
            {
                this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
            }
        })
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'social')
        })
    }
}
