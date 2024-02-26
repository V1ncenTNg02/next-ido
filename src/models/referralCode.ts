import { Prisma } from '@prisma/client'

import prisma from './client'
export const addReferralCodes = async (referralCodeInputs: Prisma.ReferralCodeCreateManyInput[]) => {
  const referralCodes = await prisma.referralCode.createMany({
    data: referralCodeInputs
  })
  return referralCodes
}

export const getRefCode = async (refCode: string) => {
  const targetRefCodeWithCreator = await prisma.referralCode.findFirst({
    where: { refCode },
    include: { creator: { include: { ReferredBy: { include: { creator: true } } } } }
  })
  return targetRefCodeWithCreator
}

export const updateReferCodeUsage = async (referredUserId: number, refCode: string) => {
  const target = await prisma.referralCode.update({ where: { refCode }, data: { isUsed: true, referredUserId } })
  return target
}
