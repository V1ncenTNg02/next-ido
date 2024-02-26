import { Project } from '../../context/ProjectData/model'
import { ComponentType, SBHeroPanel, SBHeroPanelVideo, WebsiteComponent } from '../../storyblok/models'

export interface ProjectProfile {
  heroPanel: WebsiteComponent<SBHeroPanel | SBHeroPanelVideo>[]
  body?: WebsiteComponent<ComponentType>[]
  projectDataSlug: string
}

export type ProjectDetails = ProjectProfile &
  Project & {
    id: string
    slug: string
    fullSlug: string
  }
