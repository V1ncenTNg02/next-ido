import { Carousel } from './model'
import { SBCarousel } from '../../storyblok/models'

export const mapCarousel = (data: SBCarousel): Carousel => ({
  _uid: data._uid,
  heading: data.heading,
  contents: data.contents
})
