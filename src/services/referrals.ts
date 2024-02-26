import { Charset, charset, generate } from 'referral-codes'

import { addReferralCodes, getRefCode, updateReferCodeUsage } from '../models/referralCode'
import { findCreatedReferralCodesById } from '../models/users'

export const getCreatedReferralCodesById = async (userId: number) => {
  try {
    const createdReferralCodes = await findCreatedReferralCodesById(userId)
    return createdReferralCodes
  } catch (error: any) {
    console.error('getCreatedReferralCodesById error', error.message)
    return null
  }
}

export const generateReferralCodes = async (userId: number) => {
  try {
    const createdReferralCodes = await findCreatedReferralCodesById(userId)
    if (createdReferralCodes && createdReferralCodes?.length >= 10) {
      return null
    }

    const generatedCodes = generate({
      length: 8,
      count: 10,
      charset: charset(Charset.ALPHANUMERIC)
    })

    const codes = generatedCodes.map(code => {
      return {
        refCode: code,
        creatorId: userId
      }
    })

    await addReferralCodes(codes)
    return codes
  } catch (error: any) {
    console.error('generateReferralCodes error', error.message)
    return null
  }
}

export const checkRefCode = async (code: string) => {
  let isCodeExisting = false
  let isCodeUsed = false
  let refCodeWithCreator = null
  try {
    refCodeWithCreator = await getRefCode(code)
    if (refCodeWithCreator) {
      isCodeExisting = true
      isCodeUsed = refCodeWithCreator.isUsed
    }
  } catch (error: any) {
    console.error('checkRefCode error', error.message)
  }
  return { isCodeExisting, isCodeUsed, refCodeWithCreator }
}

export const updateReferCodeUsageByUserId = async (id: number, code: string) => {
  try {
    const updatedRefCode = await updateReferCodeUsage(id, code)
    return updatedRefCode
  } catch (error: any) {
    console.error('updateReferCodeUsageByUserId error', error.message)
    return null
  }
}
