import { Standard } from './model'
import { SBStandard } from '../../storyblok/models'

export const mapStandard = (data: SBStandard): Standard => ({
  heroPanel: data.hero_panel ?? [],
  body: data.body ?? []
})
