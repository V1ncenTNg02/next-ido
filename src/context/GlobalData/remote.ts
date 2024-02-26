import { mapSettings } from './data'
import { GlobalData } from './model'
import { MoreItem } from '../../components/Navigation/MoreItem/model'
import config from '../../configs'
import { mergeProjectData } from '../../pages/api/projects'
import { SBProjectProfile } from '../../storyblok/models'
import { getAllProjectsData, getSettings, getStoriesInFolder } from '../../storyblok/remote'

export const getGlobalData = async (locale?: string): Promise<GlobalData> => {
  try {
    const settings = mapSettings(await getSettings(locale))
    const projectData = await getAllProjectsData(locale)
    const projectStories = await getStoriesInFolder<SBProjectProfile>(config.projectSlug, 100)
    const mergedProjectData = mergeProjectData(projectData, projectStories)
    const moreColumns = settings.moreColumns.map(data => {
      const moreItems: MoreItem[] = []
      data.moreItems.map(item => {
        if (item.link.includes('projects')) {
          const slug = item.link.split('/').pop()
          const projectData = mergedProjectData.find(project => project.slug === slug)
          const moreItemData = {
            ...item,
            title: projectData?.projectName ?? '',
            src: projectData?.projectLogo.filename ?? '',
            alt: projectData?.projectLogo.alt ?? ''
          }
          moreItems.push(moreItemData)
        } else {
          moreItems.push(item)
        }
      })
      return {
        ...data,
        moreItems
      }
    })

    return {
      settings: {
        navItems: settings.navItems,
        moreColumns,
        socialLinks: settings.socialLinks,
        footerColumns: settings.footerColumns,
        socialLinksTitle: settings.socialLinksTitle,
        legalLinks: settings.legalLinks,
        footerFeatures: settings.footerFeatures,
        copyright: settings.copyright,
        userDropdown: settings.userDropdown,
      }
    }
  } catch (err) {
    if (err instanceof Error) err.message = `Failed to fetch global data ${err.message ?? ''}`
    throw err
  }
}
