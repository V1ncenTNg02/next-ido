import { NextApiRequest, NextApiResponse } from 'next'

import { getSupportedChains } from '../../helpers'
import { getAllSwappeds, getUserClaimeds } from '../../services/graph'

export default async function eventsHandlder(request: NextApiRequest, response: NextApiResponse) {
  const { netId } = request.query
  if (!netId) return response.status(404).send('NetId is required')
  const supportedChainIds = getSupportedChains()
  const isNetIdValid = supportedChainIds.includes(netId as string)
  if (!isNetIdValid) return response.status(404).send({ error: 'NetId is invalid' })

  try {
    const userClaimeds = await getUserClaimeds(Number(netId))
    const swappeds = await getAllSwappeds(Number(netId))
    return response.status(200).json({ swappeds, userClaimeds })
  } catch (error) {
    return response.status(500).json({ error: 'Server error' })
  }
}
