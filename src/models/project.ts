import { Prisma } from '@prisma/client'

import prisma from './client'

export const addNewProject = async (projectInput: Prisma.ProjectCreateInput) => {
  const project = await prisma.project.create({
    data: {
      contract: projectInput.contract,
      poolIndex: projectInput.poolIndex,
      SBKey: projectInput.SBKey,
      poolInfo: projectInput.poolInfo,
      poolName: projectInput.poolName,
      netId: projectInput.netId,
      slug: projectInput.slug,
      projectIcon: projectInput.projectIcon
    }
  })
  return project
}

export const updateProjectStatus = async (projectId: number) => {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      isSuccess: true
    }
  })
  return updatedProject
}

export const getAllProjects = async (slug?: string) => {
  const projects = await prisma.project.findMany({ where: { isSuccess: true, slug } })
  return projects
}
