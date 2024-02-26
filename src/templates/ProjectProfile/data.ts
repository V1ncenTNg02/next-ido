import { ProjectProfile } from './model'
import { SBProjectProfile } from '../../storyblok/models'

export const mapProjectProfile = (data: SBProjectProfile): ProjectProfile => ({
  heroPanel: data.hero_panel,
  body: data.body,
  projectDataSlug: data.project_data.cached_url
})
