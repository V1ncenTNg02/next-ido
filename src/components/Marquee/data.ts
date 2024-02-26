import { MarqueeImageType } from './model'
import { SBMarqueeImages } from '../../storyblok/models'

export const mapMarqueeImage = (data: SBMarqueeImages): MarqueeImageType => ({
  _uid: data._uid,
  title: data.title,
  images: data.images
})
