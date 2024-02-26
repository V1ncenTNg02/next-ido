import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'

import { checkRefCode } from './referrals'
import config, { FIRST_LEVEL_SCORE, SECOND_LEVEL_SCORE } from '../configs'
import { updateReferCodeUsage } from '../models/referralCode'
import { addNewUser, findUserByEtherAddress, findUserById, getUsersByScore, updateUsersById } from '../models/users'

export const signupByReferralCode = async (code: string) => {
  try {
    const { isCodeExisting, isCodeUsed } = await checkRefCode(code)
    if (!isCodeExisting || isCodeUsed) return null
    const token = jwt.sign(
      {
        referralCode: code
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )
    return token
  } catch (error: any) {
    console.error('signupByReferralCode error', error.message)
    return null
  }
}

export const validateRefToken = async (token: string) => {
  try {
    const decode = jwt.verify(token, config.jwtSecret)
    if (!decode) return false
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { referralCode } = decode
    const { isCodeExisting, isCodeUsed } = await checkRefCode(referralCode)
    if (!isCodeExisting || isCodeUsed) return false
    return true
  } catch (error: any) {
    console.error('validateRefToken error', error.message)
    return false
  }
}

export const decodeRefToken = async (token: string) => {
  try {
    const decode = jwt.verify(token, config.jwtSecret)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { referralCode } = decode
    const { isCodeExisting, isCodeUsed, refCodeWithCreator } = await checkRefCode(referralCode)
    if (!isCodeExisting || isCodeUsed) return null
    return { referralCode, refCodeWithCreator }
  } catch (error: any) {
    console.error('decodeRefToken error', error.message)
    return null
  }
}

export const checkAddressExistence = async (etherAddress: string) => {
  try {
    const existence = await findUserByEtherAddress(etherAddress)
    return !!existence
  } catch (error: any) {
    console.error('checkAddressExistence error', error.message)
    return true
  }
}

export const signin = async (etherAddress: string) => {
  try {
    const user = await findUserByEtherAddress(etherAddress)
    if (!user) return null
    const userToken = jwt.sign(
      {
        user
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    )
    return { userInfo: user, userToken }
  } catch (error: any) {
    console.error('user signin error', error.message)
    return null
  }
}

export const signup = async (addUserInput: Prisma.UserCreateInput, refToken: string) => {
  try {
    const decoded = await decodeRefToken(refToken)
    if (!decoded) return null
    const { referralCode, refCodeWithCreator } = decoded
    if (!referralCode || !refCodeWithCreator) return null
    const user = await addNewUser(addUserInput)
    await updateReferCodeUsage(user.id, referralCode)
    const userToken = jwt.sign(
      {
        user
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    )
    const userData = { userInfo: user, userToken }
    const userUpdates = [{ id: refCodeWithCreator.creatorId, updateData: { score: refCodeWithCreator.creator.score + FIRST_LEVEL_SCORE } }]
    const grandRef = refCodeWithCreator.creator.ReferredBy
    if (grandRef[0]) {
      userUpdates.push({ id: grandRef[0].creatorId, updateData: { score: grandRef[0].creator.score + SECOND_LEVEL_SCORE } })
    }
    await updateUsersById(userUpdates)
    return userData
  } catch (error: any) {
    console.error('user signup error', error.message)
    return null
  }
}

export const fetchUserInfo = async (token: string) => {
  try {
    const decode = jwt.verify(token, config.jwtSecret)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = decode
    if (!user) return null
    const targetUser = await findUserById(user.id)
    if (!targetUser) return null
    if (targetUser.etherAddress !== user.etherAddress) return null
    return targetUser
  } catch (error: any) {
    console.error('fetchUserInfo error', error.message)
    return null
  }
}

export const fetchRankingInfo = async () => {
  try {
    return await getUsersByScore()
  } catch (error: any) {
    console.error('fetchRankingInfo error', error.message)
    return []
  }
}
