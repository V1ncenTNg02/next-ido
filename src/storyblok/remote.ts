import { getStoryblokApi } from '@storyblok/react'

import { SBLinkInfo, SBProject, SBSettings } from './models'
import { Story } from './models'
import config from '../configs'

const payloadError = (entity: string) => `'Failed to fetch ${entity} from Storyblok: Something went wrong with the request payload'`

export const getStoryBySlug = async <T>(slug: string, locale?: string, preview?: boolean): Promise<Story<T> | null> => {
  const storyblokApi = getStoryblokApi()

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: preview ? 'draft' : 'published',
      cv: Date.now(),
      language: locale
    })
    return data.story ?? null
  } catch (err: any) {
    console.error('getStoryBySlug error', err.message)
    return null
  }
}

export const getPageBySlug = async <T>(slug: string | string[], locale?: string, preview?: boolean): Promise<Story<T> | null> => {
  const slugStr = typeof slug === 'string' ? slug : slug.join('/')
  const pagesSlug = slugStr.includes(config.pagesBasePath) ? slugStr : `${config.pagesBasePath}/${slugStr}`
  return getStoryBySlug(pagesSlug.replace(/\/\//g, '/'), locale, preview)
}

export const getSettings = async (locale?: string): Promise<Story<SBSettings>> => {
  const settings = await getStoryBySlug<SBSettings>(config.settingsSlug, locale, undefined)
  if (!settings) {
    throw new Error(payloadError('settings'))
  }
  return settings
}

export const getLinks = async (slug: string = config.pagesBasePath): Promise<SBLinkInfo[]> => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get('cdn/links', { starts_with: slug })
  if (!data || !data.links) throw new Error(payloadError('links'))
  return Object.values(data.links) as SBLinkInfo[]
}

export const getStoriesInFolder = async <T>(slug: string, perPage: number, locale?: string): Promise<Story<T>[]> => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get('cdn/stories', {
    starts_with: slug,
    language: locale,
    per_page: perPage
  })
  return data.stories
}

export const getAllProjectsData = async (locale?: string): Promise<Story<SBProject>[]> =>
  getStoriesInFolder<SBProject>(config.dataSlug + '/projects', 100, locale)
