import { Prisma, User } from '@prisma/client'

import prisma from './client'

export const addNewUser = async (userInput: Prisma.UserCreateInput) => {
  const user = await prisma.user.create({
    data: {
      twitter: userInput.twitter,
      etherAddress: userInput.etherAddress,
      twitterAvatar: userInput.twitterAvatar
    }
  })
  return user
}

export const findUserById = async (id: number) => {
  const user = await prisma.user.findFirst({ where: { id } })
  return user
}

export const findCreatedReferralCodesById = async (id: number) => {
  const user = await prisma.user.findFirst({ where: { id }, include: { CreatedReferralCodes: { include: { referredUser: true } } } })
  if (!user) {
    return null
  }
  return user.CreatedReferralCodes
}

export const findUserByEtherAddress = async (etherAddress: string) => {
  const user = await prisma.user.findFirst({ where: { etherAddress } })
  if (!user) {
    return null
  }
  return user
}

export const updateUserById = async (id: number, updateData: Partial<User>) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData
  })
  return updatedUser
}
export const updateUsersById = async (updates: Array<{ id: number, updateData: Partial<User> }>) => {
  const updatePromises = updates.map(update => {
    return prisma.user.update({
      where: { id: update.id },
      data: update.updateData
    });
  });
  return await prisma.$transaction(updatePromises);
}

export const getUsersByScore = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      score: 'desc'
    },
    take: 50
  })
  return users
}
