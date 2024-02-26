import { WebsiteComponent } from './api'
import { ComponentType } from './components'
import { SBHeroPanel, SBHeroPanelVideo } from './components'
import { SBLink } from './system'

export type Template = SBHome | SBStandard | SBProjectProfile
export interface SBHome {
  hero_panel?: WebsiteComponent<SBHeroPanel | SBHeroPanelVideo>[]
  body?: WebsiteComponent<ComponentType>[]
}

export interface SBStandard {
  hero_panel?: WebsiteComponent<SBHeroPanel | SBHeroPanelVideo>[]
  body?: WebsiteComponent<ComponentType>[]
}

export interface SBProjectProfile {
  hero_panel: WebsiteComponent<SBHeroPanel | SBHeroPanelVideo>[]
  body?: WebsiteComponent<ComponentType>[]
  project_data: SBLink
}
