import config from '../configs'

export const removePagesPath = (path: string): string => (path ?? '').replace(`${config.pagesBasePath}/`, '')

export const removeDataPath = (path: string): string => (path ?? '').replace(`${config.dataSlug}/`, '')

export const removeLocalePath = (path: string): string => (path ?? '').replace(/en\/|zh\//g, '')

export const isUrlExternal = (url: string) => (url ?? '').includes('http')
