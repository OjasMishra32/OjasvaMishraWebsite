import { person } from './profile.js'

// One entry per pedestal in the contact plaza. `name` has to match a
// "<name>PhysicalDynamic" object in the areas model (case-insensitive).
export default [
    { name: 'Mail', url: `mailto:${person.email}`, align: 'right' },
    { name: 'GitHub', url: person.links.github, align: 'right' },
    { name: 'LinkedIn', url: person.links.linkedin, align: 'left' },
]
