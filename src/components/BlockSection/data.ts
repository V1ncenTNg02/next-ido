import { BlockSection } from './model'
import { SBBlockSection } from '../../storyblok/models'

export const mapBlockSection = (data: SBBlockSection): BlockSection => ({
  id: data._uid,
  theme: data.theme,
  blocks: data.blocks
})
