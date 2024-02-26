import { SBButton, SBLayoutType, WebsiteComponent } from '../../storyblok/models'

export interface Card {
  imageSrc: string
  imageAlt?: string
  iconSrc?: string
  iconAlt?: string
  title: string
  description: string
  textAlignment?: SBLayoutType
  tag?: string[]
  buttons: WebsiteComponent<SBButton>[]
  linkLayout: SBLayoutType
  isBorder: boolean
}
