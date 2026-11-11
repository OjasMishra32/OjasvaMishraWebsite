/**
 * Tiles that are drawn live instead of shown as an image.
 *
 * Each one is a function (context, width, height, time, state) called every
 * frame while its presentation is open. `time` is in seconds since the tile
 * appeared and `state` is an object the function can keep things in.
 */

const TAU = Math.PI * 2
const WHITE = '#f5f5f7'
const DIM = 'rgba(235, 235, 245, 0.38)'
const BLUE = '#0a84ff'
const ORANGE = '#ff9f0a'

const ease = (t) => t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3)

// Small deterministic random, so every visitor sees the same cloud
const seeded = (seed) => () =>
{
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
}

export const live = {

    /**
     * Deja View: cameras appear around a room, then the room fills in as a
     * cloud of soft points, the way a Gaussian splat trains.
     */
    splat(context, width, height, time, state)
    {
        if(!state.points)
        {
            const random = seeded(7)
            const points = []
            const add = (x, y, z, shade) => points.push({ x, y, z, shade, delay: random(), jitter: random() })

            // Floor and two walls of a room
            for(let i = 0; i < 520; i++) add(random() * 4 - 2, 0, random() * 4 - 2, 0.5 + random() * 0.2)
            for(let i = 0; i < 300; i++) add(- 2, random() * 1.6, random() * 4 - 2, 0.75 + random() * 0.2)
            for(let i = 0; i < 300; i++) add(random() * 4 - 2, random() * 1.6, - 2, 0.7 + random() * 0.2)

            // A ping pong table, its net and legs
            for(let i = 0; i < 360; i++) add(random() * 1.9 - 0.95, 0.55, random() * 1.05 - 0.5, - 1)
            for(let i = 0; i < 60; i++) add(0, 0.55 + random() * 0.14, random() * 1.05 - 0.5, 1)
            for(const [ lx, lz ] of [ [ - 0.8, - 0.4 ], [ 0.8, - 0.4 ], [ - 0.8, 0.4 ], [ 0.8, 0.4 ] ])
                for(let i = 0; i < 16; i++) add(lx, random() * 0.55, lz, 0.3)

            state.points = points

            // Cameras on an arc around the room, like a phone walked around it
            state.cameras = []
            for(let i = 0; i < 26; i++)
            {
                const angle = - 0.4 + i / 25 * 3.6
                state.cameras.push({ x: Math.cos(angle) * 3.1, y: 1.15 + Math.sin(i * 1.7) * 0.25, z: Math.sin(angle) * 3.1 })
            }
        }

        const loop = time % 14
        const spin = 0.55 + time * 0.16
        const scale = Math.min(width, height) * 0.27
        const centerX = width * 0.5
        const centerY = height * 0.44

        const project = (x, y, z) =>
        {
            const rx = x * Math.cos(spin) - z * Math.sin(spin)
            const rz = x * Math.sin(spin) + z * Math.cos(spin)
            const depth = 7.5 + rz
            const perspective = 7.5 / depth
            return [ centerX + rx * scale * perspective, centerY - (y - 0.5) * scale * perspective + rz * scale * 0.2 * perspective, perspective, rz ]
        }

        // Cameras: little frusta that pop in one after another
        const cameraProgress = ease(loop / 3)
        context.lineWidth = Math.max(1, width * 0.0022)

        state.cameras.forEach((camera, index) =>
        {
            const appear = ease((cameraProgress * state.cameras.length - index) / 2)
            if(appear <= 0)
                return

            const [ x, y, perspective ] = project(camera.x, camera.y, camera.z)
            const [ tx, ty ] = project(camera.x * 0.78, camera.y - 0.12, camera.z * 0.78)
            const size = width * 0.011 * perspective

            context.globalAlpha = appear * (loop > 10 ? 0.35 : 0.9)
            context.strokeStyle = BLUE
            context.beginPath()
            context.moveTo(x, y)
            context.lineTo(tx, ty)
            context.stroke()
            context.fillStyle = BLUE
            context.fillRect(x - size, y - size * 0.7, size * 2, size * 1.4)
        })

        // Points: each one starts scattered and settles as "training" runs
        const training = ease((loop - 2.2) / 5)
        const sorted = state.sorted || (state.sorted = [ ...state.points ])

        for(const point of sorted)
        {
            const settle = ease((training - point.delay * 0.55) / 0.45)
            if(settle <= 0)
                continue

            const scatter = (1 - settle) * 1.6
            const [ x, y, perspective ] = project(
                point.x + Math.sin(point.jitter * 90) * scatter,
                point.y + Math.cos(point.jitter * 50) * scatter,
                point.z + Math.sin(point.jitter * 30) * scatter
            )

            const radius = width * (0.0052 + point.jitter * 0.004) * perspective
            context.globalAlpha = settle * 0.78

            if(point.shade < 0)
                context.fillStyle = '#3f8cff'
            else
            {
                const value = Math.round(120 + point.shade * 125)
                context.fillStyle = `rgb(${value}, ${value}, ${Math.min(255, value + 8)})`
            }

            context.beginPath()
            context.arc(x, y, radius, 0, TAU)
            context.fill()
        }

        context.globalAlpha = 1

        // Readouts
        const steps = Math.round(training * 30000 / 500) * 500
        context.font = `600 ${Math.round(width * 0.046)}px system-ui, -apple-system, sans-serif`
        context.fillStyle = WHITE
        context.textBaseline = 'top'
        context.fillText(loop < 2.2 ? `${Math.round(cameraProgress * 163)} cameras` : `${steps.toLocaleString('en-US')} steps`, width * 0.07, height * 0.8)
        context.font = `500 ${Math.round(width * 0.034)}px system-ui, -apple-system, sans-serif`
        context.fillStyle = DIM
        context.fillText(loop < 2.2 ? 'solving poses' : training < 1 ? 'training the splat' : 'ready to walk into', width * 0.07, height * 0.8 + width * 0.056)
    },

    /**
     * Courtside: a ball in flight. Its path is fit from the first frames and
     * the landing point is called before the ball gets there.
     */
    trajectory(context, width, height, time)
    {
        const loop = time % 5.2
        const progress = Math.min(1, loop / 2.6)
        const left = width * 0.07
        const right = width * 0.93
        const ground = height * 0.74
        const lineX = left + (right - left) * 0.78 // The baseline: beyond it, the ball is out

        const path = (t) =>
        {
            const x = left + (right - left) * (0.02 + t * 0.9)
            const y = ground - Math.sin(Math.min(1, t) * Math.PI * 0.94) * height * 0.5 - (1 - t) * height * 0.06
            return [ x, y ]
        }

        // Court
        context.lineWidth = Math.max(1.5, width * 0.004)
        context.strokeStyle = 'rgba(235, 235, 245, 0.28)'
        context.beginPath()
        context.moveTo(left, ground)
        context.lineTo(right, ground)
        context.stroke()

        context.strokeStyle = WHITE
        context.beginPath()
        context.moveTo(lineX, ground - height * 0.035)
        context.lineTo(lineX, ground + height * 0.035)
        context.stroke()

        context.font = `500 ${Math.round(width * 0.026)}px system-ui, -apple-system, sans-serif`
        context.fillStyle = DIM
        context.textAlign = 'center'
        context.textBaseline = 'top'
        context.fillText('baseline', lineX, ground + height * 0.055)

        // Predicted flight: appears once enough of the path has been seen
        const fitAt = 0.42
        const fitted = ease((progress - fitAt) / 0.08)

        if(fitted > 0)
        {
            context.setLineDash([ width * 0.012, width * 0.012 ])
            context.strokeStyle = ORANGE
            context.globalAlpha = fitted
            context.beginPath()
            for(let t = fitAt; t <= 1.001; t += 0.02)
            {
                const [ x, y ] = path(t)
                if(t === fitAt) context.moveTo(x, y)
                else context.lineTo(x, y)
            }
            context.stroke()
            context.setLineDash([])

            // Landing point, called early
            const [ landX, landY ] = path(1)
            context.beginPath()
            context.arc(landX, landY, width * 0.013 * (1 + (1 - fitted) * 2), 0, TAU)
            context.stroke()

            context.font = `700 ${Math.round(width * 0.04)}px system-ui, -apple-system, sans-serif`
            context.fillStyle = ORANGE
            context.textAlign = 'right'
            context.textBaseline = 'bottom'
            context.fillText('OUT', landX + width * 0.03, landY - height * 0.3)
            context.font = `500 ${Math.round(width * 0.026)}px system-ui, -apple-system, sans-serif`
            context.fillText('called 162 ms before it lands', landX + width * 0.03, landY - height * 0.2)
            context.globalAlpha = 1
        }

        // Observed flight so far, as tracked frames
        context.fillStyle = WHITE
        for(let t = 0; t <= progress; t += 0.035)
        {
            const [ x, y ] = path(t)
            context.globalAlpha = 0.25 + 0.5 * (t / Math.max(progress, 0.001))
            context.beginPath()
            context.arc(x, y, width * 0.0045, 0, TAU)
            context.fill()
        }

        // The ball
        const [ ballX, ballY ] = path(progress)
        context.globalAlpha = 1
        context.fillStyle = '#d7f24a'
        context.beginPath()
        context.arc(ballX, ballY, width * 0.014, 0, TAU)
        context.fill()

        context.textAlign = 'left'
    },

    /**
     * The PID paper: a real simulation of its baseline joint, run live.
     * First-order plant, discrete PI control, torque clamped. One controller
     * lets its integrator wind up against the limit, the other doesn't.
     */
    saturation(context, width, height, time, state)
    {
        const duration = 7
        const dt = 0.01
        const tau = 1
        const gain = 2
        const limit = 10
        const target = 8

        if(!state.traces)
        {
            const simulate = (antiWindup) =>
            {
                const kp = 2.2
                const ki = 5
                const kb = 6 // back-calculation gain
                let y = 0
                let integral = 0
                const trace = []

                for(let k = 0; k < duration / dt; k++)
                {
                    const reference = k * dt < 0.5 ? 0 : target
                    const error = reference - y
                    const unclamped = kp * error + integral
                    const u = Math.max(- limit, Math.min(limit, unclamped))

                    integral += ki * error * dt
                    if(antiWindup)
                        integral += kb * (u - unclamped) * dt

                    y += dt * (- y + gain * u) / tau
                    trace.push({ y, saturated: u !== unclamped })
                }

                return trace
            }

            state.traces = { naive: simulate(false), guarded: simulate(true) }
            state.peak = Math.max(...state.traces.naive.map(sample => sample.y))
        }

        const loop = time % (duration + 2.5)
        const samples = state.traces.naive.length
        const visible = Math.min(samples, Math.floor(loop / dt))
        const left = width * 0.05
        const right = width * 0.96
        const top = height * 0.3
        const bottom = height * 0.84
        const toX = (k) => left + (right - left) * k / samples
        const toY = (y) => bottom - (bottom - top) * y / (state.peak * 1.05)
        const fontSize = Math.round(width * 0.021)

        // Legend
        context.textBaseline = 'middle'
        context.textAlign = 'left'
        context.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`
        const legend = [ [ ORANGE, 'Plain PI: the integrator winds up at the limit' ], [ BLUE, 'With anti-windup' ] ]
        legend.forEach(([ fillStyle, label ], index) =>
        {
            const y = height * (0.09 + index * 0.085)
            context.fillStyle = fillStyle
            context.beginPath()
            context.arc(left + fontSize * 0.4, y, fontSize * 0.32, 0, TAU)
            context.fill()
            context.fillStyle = WHITE
            context.fillText(label, left + fontSize * 1.2, y)
        })

        // Target
        context.lineWidth = Math.max(1, width * 0.002)
        context.strokeStyle = 'rgba(235, 235, 245, 0.32)'
        context.setLineDash([ width * 0.008, width * 0.008 ])
        context.beginPath()
        context.moveTo(left, toY(target))
        context.lineTo(right, toY(target))
        context.stroke()
        context.setLineDash([])

        context.font = `500 ${Math.round(fontSize * 0.92)}px system-ui, -apple-system, sans-serif`
        context.fillStyle = DIM
        context.textAlign = 'right'
        context.fillText('target', right, toY(target) + fontSize * 0.95)
        context.textAlign = 'left'

        const draw = (trace, strokeStyle, barY) =>
        {
            // A bar under the plot wherever the torque is pinned at its limit
            context.fillStyle = strokeStyle
            context.globalAlpha = 0.85
            for(let k = 0; k < visible; k++)
                if(trace[k].saturated)
                    context.fillRect(toX(k), barY, Math.max(1, toX(1) - toX(0) + 0.5), height * 0.022)

            context.globalAlpha = 1
            context.strokeStyle = strokeStyle
            context.lineWidth = Math.max(2, width * 0.0048)
            context.lineJoin = 'round'
            context.lineCap = 'round'
            context.beginPath()
            for(let k = 0; k < visible; k++)
            {
                if(k === 0) context.moveTo(toX(k), toY(trace[k].y))
                else context.lineTo(toX(k), toY(trace[k].y))
            }
            context.stroke()
        }

        draw(state.traces.naive, ORANGE, height * 0.89)
        draw(state.traces.guarded, BLUE, height * 0.925)

        context.fillStyle = DIM
        context.textAlign = 'right'
        context.fillText('torque at its limit', right, height * 0.91)
        context.textAlign = 'left'
    },
}
