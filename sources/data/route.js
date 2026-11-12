/**
 * The guided route.
 *
 * The world is a slice of the island: everything outside `disc` is cut away.
 * Inside it, the rover is kept on one path that passes each stop in order,
 * so a visitor can't get lost and sees everything once.
 *
 * Coordinates are world x and z, in metres.
 */
export const disc = { x: 31, z: 9, radius: 39 }

// The map panel shows the square around the disc (scripts/build-map.mjs draws it)
export const mapHalf = disc.radius + 2

// In visiting order. `respawn` is the name of the place the rover is put down.
export const stops = [
    { id: 'start', label: 'Start', respawn: 'landing', x: 39.5, z: 37.8, accent: '#ffffff' },
    { id: 'experience', label: 'Experience', respawn: 'experience', x: 48.5, z: 33.6, accent: '#2ee6a8', beacon: false },
    { id: 'projects', label: 'Projects', respawn: 'projects', x: 35.8, z: 17.6, accent: '#39b7ff' },
    { id: 'research', label: 'Research', respawn: 'lab', x: 17.9, z: 18.8, accent: '#a47bff' },
    { id: 'timeline', label: 'Timeline', respawn: 'career', x: 26.3, z: 9.6, accent: '#ffd27a' },
    { id: 'contact', label: 'Contact', respawn: 'social', x: 25.7, z: - 14.5, accent: '#ff9f0a' },
]

// Places the rover can be put down that the island's own list doesn't have
export const extraRespawns = [
    { name: 'experience', x: 45.6, z: 34.6, rotation: 0.6 },
]

/**
 * Experience comes first: the most recent roles stand as plaques along the
 * stretch from the start to the bridge. [ x, z, index of the role in
 * `experience` (data/profile.js) ]. Placed in the open ground between the
 * props that were already there.
 */
export const plaques = [
    [ 49.3, 35.9, 0 ],
    [ 52.6, 33.2, 1 ],
    [ 55.6, 30.2, 2 ],
    [ 41.6, 33.2, 4 ],
]

/**
 * The moving set pieces (World/Machines.js)
 */
export const machines = {
    // Beside the stretch from Projects to Research, clear of the trees
    arm: { x: 29.3, z: 22.6 },
    // A loop over the middle of the route
    drone: { x: 31, z: 12, radiusX: 12, radiusZ: 15, height: 6.5 },
    // At the end of the route, past the contact plaza's letters
    terminal: { x: 32.2, z: - 21.2 },
}

// The path: [ x, z, half-width of the corridor there ]
export const path = [
    [ 39.5, 40.5, 8.5 ],
    [ 39.5, 37.8, 9 ],
    [ 46.5, 34, 7.5 ],
    [ 51.8, 29.5, 7 ],
    [ 51.5, 26.5, 5 ],
    [ 47, 23, 4.2 ],
    [ 41, 20.8, 4.2 ],
    [ 35.8, 17.6, 10.5 ],
    [ 27.5, 19.2, 7 ],
    [ 17.9, 18.8, 10.5 ],
    [ 21.5, 13.5, 7.5 ],
    [ 26.3, 9.6, 8.5 ],
    [ 26.2, - 3, 7.5 ],
    [ 25.7, - 14.5, 9.5 ],
    [ 25.5, - 22.5, 11 ],
]

/**
 * Closest point of the path to a position, the corridor's half-width there
 * and how far along the path it is
 */
export const nearest = (x, z) =>
{
    let best = null
    let travelled = 0

    for(let i = 0; i < path.length - 1; i++)
    {
        const [ ax, az, ar ] = path[i]
        const [ bx, bz, br ] = path[i + 1]
        const dx = bx - ax
        const dz = bz - az
        const lengthSquared = dx * dx + dz * dz
        const length = Math.sqrt(lengthSquared)
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / lengthSquared))
        const px = ax + dx * t
        const pz = az + dz * t
        const distance = Math.hypot(x - px, z - pz)
        const radius = ar + (br - ar) * t

        // Compare by how far outside (or inside) the corridor the point is
        const outside = distance - radius
        if(!best || outside < best.outside)
            best = { x: px, z: pz, distance, radius, outside, along: travelled + length * t }

        travelled += length
    }

    return best
}

export const pathLength = path.reduce((total, point, index) => index ? total + Math.hypot(point[0] - path[index - 1][0], point[1] - path[index - 1][1]) : 0, 0)

export const inDisc = (x, z, margin = 0) => Math.hypot(x - disc.x, z - disc.z) < disc.radius + margin
