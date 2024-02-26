import { SBAccordionItem, WebsiteComponent } from '../../storyblok/models'

export interface Accordion {
  _uid: string
  title: string
  desc: string
  accordionItems: WebsiteComponent<SBAccordionItem>[]
}
