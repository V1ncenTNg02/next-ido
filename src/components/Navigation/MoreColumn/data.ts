import { MoreColumn } from './model'
import { mapMoreItem } from '../MoreItem/data'
import { SBMoreColumn } from '../../../storyblok/models'

export const mapMoreColumn = (data: SBMoreColumn): MoreColumn => ({
  id: data._uid,
  colTitle: data.col_title,
  moreItems: data.more_items.map(mapMoreItem),
  inverted: data.inverted
})
