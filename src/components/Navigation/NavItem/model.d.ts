import { SBNavItemType } from '../../../storyblok/models'

export interface NavItem {
  id: string
  url: string
  title: string
  type: SBNavItemType
}
