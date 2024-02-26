import { TypeformButton } from './model'
import { mapLinkButton } from '../Button/data'
import { SBButton, SBTypeformButton } from '../../storyblok/models'

export const mapTypeformButton = (data: SBTypeformButton): TypeformButton => {
  const button = data.button[0] as SBButton
  return {
    typeformType: data.typeform_type,
    button: mapLinkButton(button),
    layout: data.layout
  }
}
