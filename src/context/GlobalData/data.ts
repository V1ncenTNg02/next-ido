import { Settings } from './model'
import { mapFooterColumn } from '../../components/Footer/FooterColumn/data'
import { mapMoreColumn } from '../../components/Navigation/MoreColumn/data'
import { mapNavItem } from '../../components/Navigation/NavItem/data'
import { SBSettings, Story } from '../../storyblok/models'

export const mapSettings = ({ content }: Story<SBSettings>): Settings => {
  return {
    navItems: (content.main_nav ?? []).map(mapNavItem),
    moreColumns: (content.more_columns ?? []).map(mapMoreColumn),
    socialLinksTitle: content.social_links_title,
    socialLinks: {
      twitter: content.twitter.cached_url,
      telegram: content.telegram.cached_url,
      discord: content.discord.cached_url,
      facebook: content.facebook.cached_url,
      youtube: content.youtube.cached_url
    },
    footerColumns: (content.footer_columns ?? []).map(mapFooterColumn),
    footerFeatures: {
      newsletterText: content.newsletter_text,
      subscriptionText: content.subscription_text,
      subscriptionButtonText: content.subscription_button_text
    },
    copyright: content.copyright,
    legalLinks: (content.legal_links ?? []).map(mapNavItem),
    userDropdown: (content.user_dropdown ?? []).map(mapNavItem)
  }
}
