import { Card } from '../Card/model'

export interface CardGroupContainer {
  uid?: string
  title?: string
  cards: Card[]
}
