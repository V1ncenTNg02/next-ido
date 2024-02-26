import { FooterColumn } from './model'
import { mapNavItem } from '../../Navigation/NavItem/data'
import { SBFooterColumn } from '../../../storyblok/models'

export const mapFooterColumn = (data: SBFooterColumn): FooterColumn => ({
  id: data._uid,
  title: data.title,
  footerItems: data.footer_items.map(mapNavItem)
})
