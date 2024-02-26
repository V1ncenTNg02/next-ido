import { Button } from './model'
import { removePagesPath } from '../../helpers'
import { SBButton } from '../../storyblok/models'

export const mapLinkButton = (data: SBButton): Button => ({
  id: data._uid,
  title: data.title,
  url: removePagesPath(data.link.cached_url),
  buttonStyle: data.button_style,
  buttonWidth: data.width
})
