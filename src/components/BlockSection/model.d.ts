import { ComponentType, SBTheme } from '../../storyblok/models'

export interface BlockSection {
  id: string
  theme: SBTheme
  blocks: WebsiteComponent<ComponentType>[]
}
