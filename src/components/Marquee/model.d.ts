import { SBAsset, WebsiteComponent } from '../../storyblok/models'

export interface MarqueeImageType {
  _uid: string
  title: string
  images: WebsiteComponent<SBAsset>[]
}
