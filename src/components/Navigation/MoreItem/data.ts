import { MoreItem } from './model'
import { removePagesPath } from '../../../helpers'
import { SBMoreItem } from '../../../storyblok/models'

export const mapMoreItem = (data: SBMoreItem): MoreItem => ({
  id: data._uid,
  title: data.title,
  link: removePagesPath(data.link.cached_url),
  src: data.icon.filename,
  alt: data.icon.alt,
  description: data.description
})
