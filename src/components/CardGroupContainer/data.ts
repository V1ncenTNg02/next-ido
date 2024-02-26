import { CardGroupContainer } from './model'
import { mapCard } from '../Card/data'
import { SBCardGroupContainer } from '../../storyblok/models'

export const mapCardGroupContainer = (data: SBCardGroupContainer): CardGroupContainer => ({
  uid: data._uid,
  title: data.title,
  cards: data.columns.map(mapCard)
})
