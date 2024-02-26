import { CardFullWidth } from './model'
import { SBCardFullWidth } from '../../storyblok/models'

export const mapCardFullWidth = (data: SBCardFullWidth): CardFullWidth => {
  return {
    src: data.image.filename,
    alt: data.image.alt,
    title: data.title,
    description: data.description,
    link: data.link.cached_url,
    linkField: data.link_field
  }
}
