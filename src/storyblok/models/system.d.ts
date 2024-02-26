interface SBLink {
  id: string
  url: string
  linktype: string
  fieldtype: string
  cached_url: string
}

export interface SBAsset {
  id: number
  alt: string
  name: string
  title: string
  filename: string
  copyright: string
  fieldtype: 'asset'
}
