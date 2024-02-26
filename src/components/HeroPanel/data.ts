import { HeroPanel } from './model'
import { SBHeroPanel, SBHeroPanelVideo, WebsiteComponent } from '../../storyblok/models'

export const mapHeroPanel = (data: WebsiteComponent<SBHeroPanel | SBHeroPanelVideo>): HeroPanel | null => {
  const shared = {
    heading: data.heading,
    subheading: data.subheading,
    layout: data.layout,
    buttonGroup: data.button_group,
    darkenGradient: data.darken_gradient
  }

  if (data.component === 'hero_panel') {
    return {
      ...shared,
      src: data.image.filename ?? undefined,
      alt: data.image.alt ?? data.image.title ?? undefined,
      logoSrc: data.logo?.filename,
      logoAlt: data.logo?.alt ?? undefined
    }
  }

  if (data.component === 'hero_panel_video') {
    return {
      ...shared,
      src: data.video?.filename,
      alt: data.video.alt ?? data.video.title ?? undefined
    }
  }

  console.log(`Hero panel component type ${(data as any)?.component} not found`)
  return null
}
