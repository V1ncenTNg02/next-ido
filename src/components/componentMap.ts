import Accordion from './Accordion/Accordion'
import AccordionItem from './Accordion/AccordionItem/AccordionItem'
import { mapAccordionItem } from './Accordion/AccordionItem/data'
import { mapAccordion } from './Accordion/data'
import BlockSection from './BlockSection/BlockSection'
import { mapBlockSection } from './BlockSection/data'
import { mapLinkButton } from './Button/data'
import LinkButton from './Button/LinkButton'
import ButtonGroupContainer from './ButtonGroupContainer/ButtonGroupContainer'
import { mapButtonGroupContainer } from './ButtonGroupContainer/data'
import Card from './Card/Card'
import { mapCard } from './Card/data'
import CardFullWidth from './CardFullWidth/CardFullWidth'
import { mapCardFullWidth } from './CardFullWidth/data'
import CardGroupContainer from './CardGroupContainer/CardGroupContainer'
import { mapCardGroupContainer } from './CardGroupContainer/data'
import { Carousel } from './Carousel/Carousel'
import { mapCarousel } from './Carousel/data'
import ColumnContainer from './ColumnContainer/ColumnContainer'
import { mapColumnContainer } from './ColumnContainer/data'
import ColumnSection from './ColumnSection/ColumnSection'
import { mapColumnSection } from './ColumnSection/data'
import { mapHeroPanel } from './HeroPanel/data'
import HeroPanel from './HeroPanel/HeroPanel'
import { mapMarqueeImage } from './Marquee/data'
import MarqueeImage from './Marquee/MarqueeImage'
import { mapTeamMember } from './TeamMember/data'
import TeamMember from './TeamMember/TeamMember'
import { mapTestimonial } from './Testimonial/data'
import Testimonial from './Testimonial/Testimonial'
import { mapTextRender } from './TextRender/data'
import TextRender from './TextRender/TextRender'
import { mapTypeformButton } from './TypeformButton/data'
import TypeformButton from './TypeformButton/TypeformButton'
import { ComponentType } from '../storyblok/models'
import { mapHome } from '../templates/Home/data'
import Home from '../templates/Home/Home'
import { mapProjectProfile } from '../templates/ProjectProfile/data'
import ProjectProfile from '../templates/ProjectProfile/ProjectProfile'
import { mapStandard } from '../templates/Standard/data'
import Standard from '../templates/Standard/Standard'

type ComponentMapping<ComponentDataType = any, ComponentPropsType = any> = [React.ComponentType<ComponentDataType>, ((data: any) => ComponentPropsType)?]

type ComponentMap = {
  [key in ComponentType]: ComponentMapping
}

export const componentMap: ComponentMap = {
  // Templates
  home: [Home, mapHome],
  standard: [Standard, mapStandard],
  project_profile: [ProjectProfile, mapProjectProfile],

  //components
  hero_panel: [HeroPanel, mapHeroPanel],
  hero_panel_video: [HeroPanel, mapHeroPanel],
  column_container: [ColumnContainer, mapColumnContainer],
  column_section: [ColumnSection, mapColumnSection],
  text_render: [TextRender, mapTextRender],
  link_button: [LinkButton, mapLinkButton],
  button_group_container: [ButtonGroupContainer, mapButtonGroupContainer],
  card_full_width: [CardFullWidth, mapCardFullWidth],
  card: [Card, mapCard],
  card_group_container: [CardGroupContainer, mapCardGroupContainer],
  marquee: [MarqueeImage, mapMarqueeImage],
  accordion_item: [AccordionItem, mapAccordionItem],
  accordion: [Accordion, mapAccordion],
  testimonial: [Testimonial, mapTestimonial],
  team_member: [TeamMember, mapTeamMember],
  typeform_button: [TypeformButton, mapTypeformButton],
  carousel: [Carousel, mapCarousel],
  block_section: [BlockSection, mapBlockSection]
}
