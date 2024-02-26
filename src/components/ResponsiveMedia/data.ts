import { ResponsiveMedia } from './model'
import { SBAsset } from '../../storyblok/models'

export const mapResponsiveMedia = (data: SBAsset): ResponsiveMedia => ({
  src: data.filename,
  alt: data.alt || data.title || data.name
})
