// Captures screenshots of live project pages with headless Chrome.
// Usage: node scripts/capture.mjs [name ...]
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(here, 'shots/raw')
mkdirSync(out, { recursive: true })

const targets = {
    'twinly': 'https://twinly.tech',
    'applytwin': 'https://apply.twinly.tech',
    'drift': 'https://godrift.ai',
    'dejaview': 'https://deja-view.photo',
    'luciddreams': 'https://getluciddreams.vercel.app',
    'volition': 'https://volition-eight.vercel.app',
    'safms': 'https://safmstsa.vercel.app',
    'arxiv': 'https://arxiv.org/abs/2601.18639v3',
    'preventaai': 'https://apps.apple.com/us/app/preventaai/id6757689865',
    'quickcitepro': 'https://chromewebstore.google.com/detail/quickcitepro/fpngnpgmmpimnlaejklabjelhhoeibpd',
    'courtside': 'https://github.com/OjasMishra32/computervision_quant_strategy',
    'fuse': 'https://devpost.com/software/fuse-47s1jg',
    'kinetix': 'https://devpost.com/software/flowers-and-joy',
    'pterolabs': 'https://pterolabs.ai',
}

const only = process.argv.slice(2)
for(const [name, url] of Object.entries(targets))
{
    if(only.length && !only.includes(name)) continue
    const file = path.join(out, `${name}.png`)
    const result = spawnSync(CHROME, [
        '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
        '--window-size=1600,900', '--force-device-scale-factor=1',
        '--virtual-time-budget=' + (process.env.BUDGET || 12000), '--timeout=45000',
        `--user-data-dir=/tmp/folio-capture-profile`,
        `--screenshot=${file}`, url,
    ], { encoding: 'utf8', timeout: 90000 })
    console.log(name, existsSync(file) ? 'ok' : `failed ${result.status} ${String(result.stderr).slice(-200)}`)
}
