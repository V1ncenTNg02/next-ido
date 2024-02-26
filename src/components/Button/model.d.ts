import { SBButtonTheme } from '../../storyblok/models'

export interface Button {
  id: string
  url: string
  title: string
  buttonStyle: SBButtonTheme
  buttonWidth: SBButtonSize
}
