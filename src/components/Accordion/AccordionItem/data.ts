import { AccordionItem } from './model'
import { SBAccordionItem } from '../../../storyblok/models'

export const mapAccordionItem = (data: SBAccordionItem): AccordionItem => ({
  _uid: data._uid,
  title: data.title,
  markdown: data.markdown
})
