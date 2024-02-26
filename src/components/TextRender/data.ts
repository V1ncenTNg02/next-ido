import { TextRender } from './model'
import { SBTextRender } from '../../storyblok/models'

export const mapTextRender = (data: SBTextRender): TextRender => ({
  type: data.type,
  content: data.content,
  layout: data.layout,
  theme: data.theme
})
