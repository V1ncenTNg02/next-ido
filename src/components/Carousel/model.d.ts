import { SBCarouselContainer, WebsiteComponent } from '../../storyblok/models'

export interface Carousel {
  _uid: string
  heading?: string
  contents: WebsiteComponent<SBCarouselContainer>[]
}
