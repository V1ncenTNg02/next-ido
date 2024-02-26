import { ComponentType } from './components'

export type WebsiteComponent<TContent = { [index: string]: any }> = {
  _uid: string
  component: ComponentType
  _editable: string
} & TContent

interface AlternateLink {
  id: number
  name: string
  slug: string
  full_slug: string
  is_folder: boolean
  parent_id: number
}

export interface Story<T> {
  name: string
  created_at: string
  published_at: string | null
  alternates: AlternateLink[]
  id: number
  uuid: string
  content: WebsiteComponent<T>
  slug: string
  full_slug: string
  default_full_slug: string | null
  sort_by_date: any
  position: number
  tag_list: string[]
  is_startpage: boolean
  parent_id: number
  meta_data: any
  group_id: string
  first_published_at: string | null
  release_id: string | null
  lang: 'default' | string
  path: null
  translated_slugs: TranslatedSlug[] | null
}

export interface SBLinkInfo {
  id: number
  slug: string
  name: string
  is_folder: boolean
  parent_id: number
  published: boolean
  position: number
  uuid: string
  is_startpage: boolean
}

interface TranslatedSlug {
  path: string
  name: string
  lang: string
}
