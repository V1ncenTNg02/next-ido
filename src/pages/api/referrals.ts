import { NextApiRequest, NextApiResponse } from 'next'

import { checkRefCode, generateReferralCodes, getCreatedReferralCodesById, updateReferCodeUsageByUserId } from '../../services/referrals'

export default async function referralHandler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method === 'POST') {
      const { userId } = request.body
      const insertedReferralCodes = await generateReferralCodes(Number(userId))
      if (insertedReferralCodes) {
        return response.status(201).json(insertedReferralCodes)
      } else {
        return response.status(400).json({ message: 'generate code error' })
      }
    } else if (request.method === 'GET') {
      const { action } = request.query
      if (action === 'codes') {
        const { userId } = request.query
        const codes = await getCreatedReferralCodesById(Number(userId))
        if (codes) {
          return response.status(200).json(codes)
        } else {
          return response.status(404).json({ message: 'referral code not found' })
        }
      }
      if (action === 'codeUsage') {
        const { code } = request.query
        const { isCodeExisting, isCodeUsed } = await checkRefCode(String(code))
        return response.status(200).json({ isCodeExisting, isCodeUsed })
      }
      return response.status(404).json({ message: 'action not found' })
    } else if (request.method === 'PUT') {
      const { refCode, userId } = request.query
      const updatedRefCode = await updateReferCodeUsageByUserId(Number(userId), refCode as string)
      if (updatedRefCode) {
        return response.status(201).json({ updatedRefCode })
      } else {
        return response.status(400).json({ message: 'update referral code error' })
      }
    } else {
      return response.status(405).json('Not allowed method')
    }
  } catch (error) {
    return response.status(500).json({ error: 'Server Error' })
  }
}
