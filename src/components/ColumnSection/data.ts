import { ColumnSection } from './model'
import { SBColumnSection } from '../../storyblok/models'

export const mapColumnSection = (data: SBColumnSection): ColumnSection => ({
  section: data.section
})
