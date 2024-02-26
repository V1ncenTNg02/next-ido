import { SBLinkInfo } from './models'
import { getLinks } from './remote'
import { removePagesPath } from '../helpers'

interface DynamicPathParams {
  params: {
    id: string
  }
}

const filterByPage =
  (slug: string) =>
  (link: SBLinkInfo): boolean =>
    !link.is_folder && link.slug !== `${slug}/`

export const getDynamicPageIds = async (slug: string): Promise<DynamicPathParams[]> =>
  (await getLinks(slug)).filter(filterByPage(slug)).map(link => ({ params: { id: removePagesPath(link.slug) } }))
