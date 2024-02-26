import { Home } from './model'
import { SBHome } from '../../storyblok/models'

export const mapHome = (data: SBHome): Home => ({
  heroPanel: data.hero_panel ?? [],
  body: data.body ?? []
})
