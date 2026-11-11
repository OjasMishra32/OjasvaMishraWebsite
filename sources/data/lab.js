import { research } from './profile.js'

// Shape expected by LabArea
export default research.map((entry) => ({
    id: entry.id,
    title: entry.title,
    url: entry.url,
    urlLabel: entry.urlLabel || (entry.url ? entry.url.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '') : 'open the details'),
    image: entry.image,
    imageMini: entry.imageMini,
}))
