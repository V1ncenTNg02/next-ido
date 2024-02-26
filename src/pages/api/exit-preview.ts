import { NextApiRequest, NextApiResponse } from 'next'

export default async function exit(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.clearPreviewData()
  } catch (err) {
    console.error(err)
  }
  res.redirect(req.headers.referer ?? '/')
}
