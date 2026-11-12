# ojasvamishra.me

My portfolio, as a small world you drive a rover around. The workshop holds my
projects, the lab holds my research, the timeline on the ground is my
experience in order, and the plaza at the end is how to reach me. Everything
is also on one page: press **About me** (or `I`).

## Run it

```bash
npm install --force
cp .env.example .env
npm run dev
```

`npm run build` writes the production site to `dist/`. Vercel builds it with
the settings in `vercel.json`.

## Where things are

| What | Where |
| --- | --- |
| Everything the site says about me | `sources/data/profile.js` |
| The presentation of each project and paper | `sources/data/cards.js` |
| The About page | `sources/Game/Profile.js`, `sources/style/about.styl` |
| Presentations and their live tiles | `sources/Game/Keynote.js`, `sources/Game/KeynoteLive.js` |
| Interface styles | `sources/style/ui.styl` |
| The rover | `sources/Game/World/Rover.js` |
| The route visitors are kept on, and the disc the world is cut to | `sources/data/route.js`, `sources/Game/Route.js` |
| The stops bar | `sources/Game/Guide.js` |
| The map panel | `sources/Game/Map.js`, `scripts/build-map.mjs` |
| Areas of the world | `sources/Game/World/Areas/` |
| Time-of-day looks | `sources/Game/Cycles/DayCycles.js` |

To change a fact, edit `profile.js`. To change what a presentation shows,
edit `cards.js` (each one is a 12 × 6 grid of tiles).

## Images

Source material lives in `scripts/shots` (`raw` for captured pages, `art` for
figures and photos from the projects themselves). After adding or changing
one:

```bash
npm run images    # presentation images, board images, lab images
npm run palette   # repaints the world's colour strip
npm run map       # redraws the map panel's picture
```

## Controls

WASD or arrows to drive, Shift to boost, Enter to interact, M for the map,
I for the short version. Add `#debug` to the URL for the debug panel.

## Licenses

Third-party notices are in `licenses/`.
