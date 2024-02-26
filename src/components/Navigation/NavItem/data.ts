import { NavItem } from './model'
import { removePagesPath } from '../../../helpers'
import { SBNavItem } from '../../../storyblok/models'

export const mapNavItem = (data: SBNavItem): NavItem => ({
  id: data._uid,
  url: removePagesPath(data.link.cached_url),
  title: data.title,
  type: data.type
})

export const isDropDown = ({ type }: NavItem): boolean => type === 'dropdown'

export const isSingleItem = ({ type }: NavItem): boolean => type === 'single'

export const isButton = ({ type }: NavItem): boolean => type === 'button'
