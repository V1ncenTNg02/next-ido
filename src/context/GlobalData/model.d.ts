import { FooterColumn } from '../../components/Footer/FooterColumn/model'
import { MoreColumn } from '../../components/Navigation/MoreColumn/model'
import { NavItem } from '../../components/Navigation/NavItem/model'

export interface Settings {
  navItems: NavItem[]
  moreColumns: MoreColumn[]
  socialLinksTitle: string
  socialLinks: {
    [key: string]: string
  }
  footerColumns: FooterColumn[]
  footerFeatures: {
    newsletterText: string
    subscriptionText: string
    subscriptionButtonText: string
  }
  copyright: string
  legalLinks: NavItem[]
  userDropdown: NavItem[]
}
export interface GlobalData {
  settings: Settings
}
