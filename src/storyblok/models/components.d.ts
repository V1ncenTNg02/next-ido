import { WebsiteComponent } from './api'
import { SBAsset, SBLink } from './system'

export type TemplateType = 'home' | 'standard' | 'project_profile'

export type ComponentType =
  | TemplateType
  | 'hero_panel'
  | 'hero_panel_video'
  | 'column_container'
  | 'text_render'
  | 'column_section'
  | 'link_button'
  | 'button_group_container'
  | 'card'
  | 'card_group_container'
  | 'marquee'
  | 'card_full_width'
  | 'testimonial'
  | 'accordion'
  | 'accordion_item'
  | 'carousel'
  | 'team_member'
  | 'typeform_button'
  | 'block_section'

export type SBNavItemType = 'dropdown' | 'single' | 'button'

export type SBTextRenderType =
  | 'header'
  | 'headerBold'
  | 'subHeader'
  | 'subHeaderBold'
  | 'subTitle'
  | 'subTitleBold'
  | 'body'
  | 'bodyBold'
  | 'subBody'
  | 'subBodyBold'

export type SBLayoutType = 'left' | 'center' | 'right'

export type SBButtonTheme = 'theme1' | 'theme2' | 'theme3'

export type SBSocialMediaType = 'linkedin' | 'twitter' | 'youtube' | 'facebook' | 'email' | 'website' | 'telegram' | 'instagram' | 'discord'

export type SBTypeformType = 'popup' | 'forward'

export type SBTheme = 'white' | 'primary' | 'blue' | 'dark' | 'grey' | 'bluePurple' | 'bluePurpleReverse' | 'purplePink' | 'skyBlue' | 'rainbow'

export type SBSize = 'small' | 'medium' | 'large'

export interface SBBlockSection {
  _uid: string
  theme: SBTheme
  blocks: WebsiteComponent<ComponentType>[]
}

export interface SBButton {
  _uid: string
  link: SBLink
  title: string
  button_style: SBButtonType
  width: SBSize
}

export interface SBCallToAction {
  label: string
  link: SBLink
}

export interface SBHeroPanel {
  component: 'hero_panel'
  image: SBAsset
  logo?: SBAsset
  heading: string
  subheading: string
  layout: SBHeroPanelLayoutType
  button_group: WebsiteComponent<SBButtonGroupContainer>[]
  darken_gradient: boolean
}

export interface SBHeroPanelVideo {
  component: 'hero_panel_video'
  video: SBAsset
  thumbnail: SBAsset
  heading: string
  subheading: string
  layout: SBHeroPanelLayoutType
  button_group: WebsiteComponent<SBButtonGroupContainer>[]
  darken_gradient: boolean
}

export interface SBTextRender {
  _uid: string
  type: SBTextRenderType
  content: string
  layout: SBLayoutType
  theme: Partial<SBTheme>
}

export interface SBColumnContainer {
  _uid: string
  title?: string
  subheading?: string
  text?: string
  column: WebsiteComponent<SBColumnSection>[]
  theme?: Partial<SBTheme>
}

export interface SBButtonGroupContainer {
  _uid: string
  button: WebsiteComponent<SBButton>[]
  layout: SBLayoutType
}

export interface SBColumnSection {
  _uid: string
  section: WebsiteComponent<ComponentType>[]
}

export interface SBNavItem {
  _uid: string
  link: SBLink
  title: string
  type: NavItemType
}

export interface SBMoreItem {
  _uid: string
  link: SBLink
  title: string
  icon: SBAsset
  description: string
}

export interface SBMoreColumn {
  _uid: string
  col_title: string
  more_items: SBMoreItem[]
  inverted: boolean
}

export interface SBFooterColumn {
  _uid: string
  title: string
  footer_items: SBNavItem[]
}

export interface SBCardFullWidth {
  _uid: string
  title: string
  description: string
  image: SBAsset
  link: SBLink
  link_field: string
}

export interface SBCard {
  image: SBAsset
  icon: SBAsset
  has_icon: boolean
  card_title: string
  card_description: string
  tag?: string[]
  text_alignment?: SBLayoutType
  link_layout: SBLayoutType
  buttons: WebsiteComponent<SBButton>[]
  is_border: boolean
}

export interface SBCardGroupContainer {
  _uid: string
  title: string
  columns: WebsiteComponent<SBCard>[]
}

export interface SBMarqueeImages {
  _uid: string
  title: string
  images: WebsiteComponent<SBAsset>[]
}
export interface SBTestimonial {
  rating: SBTestimonialRating
  comments: string
  name: string
  role: string
  testimonial_image: SBAsset
  company_logo: SBAsset
  reversed: boolean
}
export interface SBAccordionItem {
  _uid: string
  title: string
  markdown: string
}

export interface SBAccordion {
  _uid: string
  title: string
  desc: string
  accordionItems: WebsiteComponent<SBAccordionItem>[]
  subtitle: string
  note: string
}

export interface SBCarouselContainer {
  _uid: string
  image: SBAsset
  dark_gradient: boolean
  logo: SBAsset
  description: string
  avatar: SBAsset
  avatar_description: string
}

export interface SBCarousel {
  _uid: string
  heading?: string
  contents: WebsiteComponent<SBCarouselContainer>[]
}

export interface SBTeamMember {
  _uid: string
  avatar: SBAsset
  name: string
  title: string
  description: string
  linkedin: SBLink
  twitter: SBLink
  youtube: SBLink
  facebook: SBLink
  email: SBLink
  with_margin_bottom: boolean
}

export interface SBTypeformButton {
  typeform_type: SBTypeformType
  button: WebsiteComponent<SBButton>[]
  layout: SBLayoutType
}
