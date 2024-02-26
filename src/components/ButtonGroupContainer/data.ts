import { ButtonGroupContainer } from './model'
import { SBButtonGroupContainer } from '../../storyblok/models'

export const mapButtonGroupContainer = (data: SBButtonGroupContainer): ButtonGroupContainer => ({
  button: data.button,
  layout: data.layout
})
