import { ColumnContainer } from './model'
import { SBColumnContainer } from '../../storyblok/models'

export const mapColumnContainer = (data: SBColumnContainer): ColumnContainer => ({
  title: data.title,
  subheading: data.subheading,
  text: data.text,
  column: data.column,
  theme: data.theme
})
