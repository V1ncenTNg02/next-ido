import { MoreItem } from '../MoreItem/model'

export interface MoreColumn {
  id: string
  colTitle: string
  moreItems: MoreItem[]
  inverted: boolean
}
