import { Prisma } from '@prisma/client'

import * as Model from '../models/project'

export const addNewProject = async (projectInput: Prisma.ProjectCreateInput) => {
  try {
    const newProject = await Model.addNewProject(projectInput)
    return newProject
  } catch (error: any) {
    console.error('createNewProject error', error.message)
    return null
  }
}

export const updateProjectStatus = async (projectId: number) => {
  try {
    const updatedProject = await Model.updateProjectStatus(projectId)
    return updatedProject
  } catch (error: any) {
    console.error('updateProjectStatus error', error.message)
    return null
  }
}

export const getAllProjects = async (slug?: string) => {
  try {
    const projectsData = await Model.getAllProjects(slug)
    return projectsData
  } catch (error: any) {
    console.error('getAllProjects error', error.message)
    return []
  }
}
