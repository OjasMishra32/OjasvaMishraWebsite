// Builds static/machines/panda.glb: the Franka Emika Panda arm that stands on
// the route (World/Machines.js animates it).
//
// The model is the official robot description as published in MuJoCo
// Menagerie (Apache 2.0; derived from Franka Emika's franka_ros). This reads
// its MJCF for the link tree and joint frames, loads the visual meshes,
// simplifies them and writes one compressed file with a node per link.
//
// Usage: node scripts/build-panda.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Document, NodeIO } from '@gltf-transform/core'
import { KHRDracoMeshCompression } from '@gltf-transform/extensions'
import { weld, simplify, draco, prune, normals } from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'
import draco3d from 'draco3dgltf'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = 'https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/main/franka_emika_panda'
const cache = path.join(root, 'scripts/shots/tmp/panda')
const output = path.join(root, 'static/machines/panda.glb')

const fetchTo = async (relative) =>
{
    const file = path.join(cache, relative)
    if(fs.existsSync(file))
        return file

    fs.mkdirSync(path.dirname(file), { recursive: true })
    const response = await fetch(`${source}/${relative}`)
    if(!response.ok)
        throw new Error(`${relative}: ${response.status}`)
    fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()))
    return file
}

/**
 * 1. The link tree, from the MJCF
 */
const xml = fs.readFileSync(await fetchTo('panda.xml'), 'utf8')
const attributes = (text) => Object.fromEntries([ ...text.matchAll(/([\w:]+)="([^"]*)"/g) ].map(match => [ match[1], match[2] ]))
const numbers = (text) => text.trim().split(/\s+/).map(Number)

const colors = {}
for(const match of xml.matchAll(/<material\b([^>]*)\/>/g))
{
    const { name, rgba } = attributes(match[1])
    if(name && rgba)
        colors[name] = numbers(rgba)
}

const body = xml.slice(xml.indexOf('<worldbody'), xml.indexOf('</worldbody>'))
const links = []
const stack = []

for(const match of body.matchAll(/<(\/?)(body|geom|joint)\b([^>]*?)(\/?)>/g))
{
    const [ , closing, tag, text ] = match
    const values = attributes(text)

    if(tag === 'body' && !closing)
    {
        const link = {
            name: values.name,
            parent: stack[stack.length - 1] ?? null,
            position: values.pos ? numbers(values.pos) : [ 0, 0, 0 ],
            quaternion: values.quat ? numbers(values.quat) : [ 1, 0, 0, 0 ], // w x y z
            joint: null,
            geoms: [],
        }
        links.push(link)
        stack.push(link)
    }
    else if(tag === 'body')
        stack.pop()
    else if(tag === 'joint')
        stack[stack.length - 1].joint = values.name
    else if(tag === 'geom' && values.class === 'visual')
        stack[stack.length - 1].geoms.push({ mesh: values.mesh, material: values.material })
}

/**
 * 2. Meshes: one primitive per material per link
 */
const readObj = (file) =>
{
    const positions = []
    const normals = []
    const corners = []

    for(const line of fs.readFileSync(file, 'utf8').split('\n'))
    {
        if(line.startsWith('v '))
            positions.push(numbers(line.slice(2)))
        else if(line.startsWith('vn '))
            normals.push(numbers(line.slice(3)))
        else if(line.startsWith('f '))
        {
            const face = line.slice(2).trim().split(/\s+/).map(corner => corner.split('/').map(Number))
            for(let i = 1; i < face.length - 1; i++)
                corners.push(face[0], face[i], face[i + 1])
        }
    }

    return { positions, normals, corners }
}

const document = new Document()
const buffer = document.createBuffer()
const scene = document.createScene('panda')
const materials = {}

const material = (name) => materials[name] ??= document.createMaterial(name).setBaseColorFactor(colors[name]).setRoughnessFactor(0.6).setMetallicFactor(0)

// MuJoCo is Z-up, the world is Y-up
const base = document.createNode('panda').setRotation([ - Math.SQRT1_2, 0, 0, Math.SQRT1_2 ])
scene.addChild(base)

const nodes = new Map()
let sourceTriangles = 0

for(const link of links)
{
    const [ w, x, y, z ] = link.quaternion
    const length = Math.hypot(w, x, y, z)
    const node = document.createNode(link.name)
        .setTranslation(link.position)
        .setRotation([ x / length, y / length, z / length, w / length ])
        .setExtras({ joint: link.joint })

    const byMaterial = new Map()
    for(const geom of link.geoms)
    {
        if(!byMaterial.has(geom.material))
            byMaterial.set(geom.material, { positions: [], normals: [], indices: [], lookup: new Map() })

        const target = byMaterial.get(geom.material)
        const obj = readObj(await fetchTo(`assets/${geom.mesh}.obj`))
        sourceTriangles += obj.corners.length / 3

        for(const [ v, , vn ] of obj.corners)
        {
            const key = `${geom.mesh}:${v}:${vn}`
            let index = target.lookup.get(key)
            if(index === undefined)
            {
                index = target.positions.length / 3
                target.positions.push(...obj.positions[v - 1])
                target.normals.push(...obj.normals[vn - 1])
                target.lookup.set(key, index)
            }
            target.indices.push(index)
        }
    }

    if(byMaterial.size)
    {
        const mesh = document.createMesh(link.name)
        for(const [ name, data ] of byMaterial)
        {
            mesh.addPrimitive(document.createPrimitive()
                .setMaterial(material(name))
                .setAttribute('POSITION', document.createAccessor().setType('VEC3').setArray(new Float32Array(data.positions)).setBuffer(buffer))
                .setAttribute('NORMAL', document.createAccessor().setType('VEC3').setArray(new Float32Array(data.normals)).setBuffer(buffer))
                .setIndices(document.createAccessor().setType('SCALAR').setArray(new Uint32Array(data.indices)).setBuffer(buffer)))
        }
        node.setMesh(mesh)
    }

    nodes.set(link, node)
    ;(link.parent ? nodes.get(link.parent) : base).addChild(node)
}

/**
 * 3. Simplify and compress
 */
await MeshoptSimplifier.ready
await document.transform(
    // Normals are dropped for welding (the source is flat-shaded, one normal
    // per corner) and recomputed smooth afterwards
    (doc) => { for(const mesh of doc.getRoot().listMeshes()) for(const primitive of mesh.listPrimitives()) primitive.setAttribute('NORMAL', null) },
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.2, error: 0.012, lockBorder: false }),
    normals({ overwrite: true }),
    prune(),
    draco({ quantizePosition: 14, quantizeNormal: 10 })
)

let triangles = 0
for(const mesh of document.getRoot().listMeshes())
    for(const primitive of mesh.listPrimitives())
        triangles += primitive.getIndices().getCount() / 3

fs.mkdirSync(path.dirname(output), { recursive: true })
const io = new NodeIO()
    .registerExtensions([ KHRDracoMeshCompression ])
    .registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule(), 'draco3d.decoder': await draco3d.createDecoderModule() })
await io.write(output, document)

console.log(`${links.length} links, ${sourceTriangles} triangles in, ${triangles} out, ${(fs.statSync(output).size / 1024).toFixed(0)} KB`)
console.log(links.map(link => `${link.name}${link.joint ? ` (${link.joint})` : ''}`).join(' > '))
