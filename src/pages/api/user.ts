import { NextApiRequest, NextApiResponse } from 'next'

import { checkAddressExistence, decodeRefToken, fetchUserInfo, signin, signup, signupByReferralCode, validateRefToken } from '../../services/users'

export default async function userHandler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method === 'POST') {
      const { action } = request.query
      if (action === 'inputReferralCode') {
        const { code } = request.body
        const token = await signupByReferralCode(code)
        if (token) {
          return response.status(201).json({ token })
        } else {
          return response.status(401).json({ message: 'Invalid token' })
        }
      }
      if (action === 'validateRefToken') {
        const { token } = request.body
        const validated = await validateRefToken(token)
        return response.status(201).json({ validated })
      }
      if (action === 'addressExistence') {
        const { address } = request.body
        const existence = await checkAddressExistence(address)
        return response.status(201).json({ existence })
      }
      if (action === 'signin') {
        const { address } = request.body
        const userData = await signin(address)
        if (userData) {
          return response.status(201).json({ userData })
        } else {
          return response.status(401).json({ message: 'User unauthorized' })
        }
      }
      if (action === 'signup') {
        const { twitter, etherAddress, twitterAvatar, refToken } = request.body
        const userData = await signup({ twitter, etherAddress, twitterAvatar }, refToken)
        if (userData) {
          return response.status(201).json({ userData })
        } else {
          return response.status(401).json({ message: 'User unauthorized' })
        }
      }
      if (action === 'decodeRefToken') {
        const { token } = request.body
        const refCode = await decodeRefToken(token)
        if (refCode) {
          return response.status(201).json({ refCode: refCode.referralCode })
        } else {
          return response.status(401).json({ message: 'Invalid token' })
        }
      }
      if (action === 'fetchUser') {
        const { token } = request.body
        const user = await fetchUserInfo(token)
        if (user) {
          return response.status(201).json({ user })
        } else {
          return response.status(401).json({ message: 'Invalid token' })
        }
      }
      return response.status(404).json({ message: 'action not found' })
    } else {
      return response.status(405).json('Not allowed method')
    }
  } catch (error) {
    return response.status(500).json({ error: 'Server Error' })
  }
}
