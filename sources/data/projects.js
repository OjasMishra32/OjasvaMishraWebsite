import { projects } from './profile.js'

// Shape expected by ProjectsArea
export default projects.map((project) => ({
    id: project.id,
    title: project.title,
    titleSmall: project.titleSmall,
    url: project.url,
    urlLabel: project.urlLabel || (project.url ? project.url.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '') : 'open the details'),
    attributes: project.attributes || {},
    award: project.award || null,
    images: project.images,
}))
