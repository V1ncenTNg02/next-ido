import { Card } from './model'
import { SBCard } from '../../storyblok/models'

export const mapCard = (data: SBCard): Card => {
  return {
    imageSrc: data.image.filename,
    imageAlt: data.image.alt,
    iconSrc: data.icon.filename,
    iconAlt: data.icon.alt,
    title: data.card_title,
    description: data.card_description,
    tag: data.tag,
    textAlignment: data.text_alignment,
    buttons: data.buttons,
    linkLayout: data.link_layout,
    isBorder: data.is_border
  }
}
