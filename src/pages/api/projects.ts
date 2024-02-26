import { NextApiRequest, NextApiResponse } from 'next'

import config from '../../configs'
import { mapProject } from '../../context/ProjectData/data'
import { removeLocalePath } from '../../helpers'
import { SBProject, Story } from '../../storyblok/models'
import { SBProjectProfile } from '../../storyblok/models'
import { getAllProjectsData, getStoriesInFolder } from '../../storyblok/remote'
import { mapProjectProfile } from '../../templates/ProjectProfile/data'
import { ProjectDetails } from '../../templates/ProjectProfile/model'

export const mergeProjectData = (projectData: Story<SBProject>[], stories: Story<SBProjectProfile>[]): ProjectDetails[] =>
  stories
    .map(story => {
      const data = projectData.find(p => removeLocalePath(p.full_slug) === story.content.project_data.cached_url) ?? null
      if (!data) {
        console.error(`Missing project data for ${story.full_slug}`)
        return null
      }
      return {
        id: story.content._uid,
        slug: story.slug,
        fullSlug: story.full_slug,
        ...mapProjectProfile(story.content),
        ...mapProject(data)
      }
    })
    .filter(Boolean) as ProjectDetails[]

export default async function projectHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const path = req.query.path ? `${config.pagesBasePath}${req.query.path}` : config.projectSlug
    const projectData = await getAllProjectsData()
    const projectStories = await getStoriesInFolder<SBProjectProfile>(path, 100)
    const mergedProjectData = mergeProjectData(projectData, projectStories)

    return res.json(mergedProjectData)
  } catch (error) {
    return res.status(500).json({ error: 'Unknown server error' })
  }
}
