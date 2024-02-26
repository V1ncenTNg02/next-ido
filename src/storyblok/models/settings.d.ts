import { SBFooterColumn, SBMoreColumn, SBNavItem } from './components'
import { SBLink } from './system'

export interface SBSettings {
  main_nav: SBNavItem[]
  more_columns: SBMoreColumn[]
  social_links_title: string
  twitter: SBLink
  discord: SBLink
  telegram: SBLink
  youtube: SBLink
  facebook: SBLink
  footer_columns: SBFooterColumn[]
  newsletter_text: string
  subscription_text: string
  subscription_button_text: string
  copyright: string
  legal_links: SBNavItem[]
  user_dropdown: SBNavItem[]
}
