import { NextApiRequest, NextApiResponse } from 'next'

import config from '../../configs'

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req

  if (query.secret !== config.storyblokPreviewSecret || typeof query.slug === 'undefined') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  res.setPreviewData({})

  const cookies = res.getHeader('Set-Cookie')

  if (!Array.isArray(cookies)) {
    throw new Error(`Expected string[] for cookies, got: '${cookies}'`)
  }

  res.setHeader(
    'Set-Cookie',
    cookies.map(cookie => cookie.replace('SameSite=Lax', 'SameSite=None;Secure'))
  )

  const slug = query.slug === 'home' ? '' : (query.slug as string)

  if (slug.startsWith(config.pagesBasePath)) {
    res.redirect(`${slug.replace(config.pagesBasePath, '')}`)
  } else {
    res.redirect(`/${slug.replace(config.pagesBasePath + '/', '')}`)
  }
}
