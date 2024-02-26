import { SBLayoutType, SBTextRenderType, SBTheme } from '../../storyblok/models'

export interface TextRender {
  type: SBTextRenderType
  content: string
  layout: SBLayoutType
  theme?: Partial<SBTheme>
}
