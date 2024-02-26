import { Accordion } from './model'
import { SBAccordion } from '../../storyblok/models'

export const mapAccordion = (data: SBAccordion): Accordion => ({
  _uid: data._uid,
  title: data.title,
  desc: data.desc,
  accordionItems: data.accordionItems
})
