import { SBButtonGroupContainer, SBLayoutType, WebsiteComponent } from '../../storyblok/models'
export interface HeroPanel {
  src?: string
  alt?: string
  logoSrc?: string
  logoAlt?: string
  heading?: string
  subheading?: string | string[]
  layout?: SBLayoutType
  buttonGroup?: WebsiteComponent<SBButtonGroupContainer>[]
  darkenGradient?: boolean
}
