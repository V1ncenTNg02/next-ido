import { SBColumnSection, SBTheme } from '../../storyblok/models'

export interface ColumnContainer {
  title?: string
  subheading?: string
  text?: string
  column: WebsiteComponent<SBColumnSection>[]
  theme?: Partial<SBTheme>
}
