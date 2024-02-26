import { Button } from '../Button/model'
import { SBLayoutType, SBTypeformType } from '../../storyblok/models'

export interface TypeformButton {
  button: Button
  typeformType?: SBTypeformType
  layout?: SBLayoutType
}
