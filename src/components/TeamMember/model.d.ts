export type SocialMedia = {
  type: SBSocialMediaType
  url: string
}[]
export interface TeamMember {
  _uid: string
  avatarSrc: string
  avatarAlt: string
  name: string
  title: string
  description?: string
  socialMedia: SocialMedia
  withMarginBottom: boolean
}
