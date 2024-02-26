import { SocialMedia, TeamMember } from './model'
import { SBTeamMember } from '../../storyblok/models'

export const mapTeamMember = (data: SBTeamMember): TeamMember => {
  const socialMedia: SocialMedia = []
  if (data.linkedin) socialMedia.push({ type: 'linkedin', url: data.linkedin.cached_url })
  if (data.twitter) socialMedia.push({ type: 'twitter', url: data.twitter.cached_url })
  if (data.youtube) socialMedia.push({ type: 'youtube', url: data.youtube.cached_url })
  if (data.facebook) socialMedia.push({ type: 'facebook', url: data.facebook.cached_url })
  if (data.email) socialMedia.push({ type: 'email', url: data.email.cached_url })

  return {
    _uid: data._uid,
    avatarSrc: data.avatar.filename,
    avatarAlt: data.avatar.alt,
    name: data.name,
    title: data.title,
    description: data.description,
    socialMedia: socialMedia,
    withMarginBottom: data.with_margin_bottom
  }
}
