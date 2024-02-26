import { NextApiRequest, NextApiResponse } from 'next'

import { addNewProject, getAllProjects, updateProjectStatus } from '../../services/project'

export default async function contractHandler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method === 'POST') {
      const { projectData } = request.body
      const project = await addNewProject(projectData)
      if (project) {
        return response.status(201).json({ project })
      } else {
        return response.status(401).json({ message: 'project is not added' })
      }
    }
    if (request.method === 'PUT') {
      const { projectId } = request.body
      const project = await updateProjectStatus(projectId)
      if (project) {
        return response.status(201).json({ project })
      } else {
        return response.status(401).json({ message: 'project is not added' })
      }
    }
    if (request.method === 'GET') {
      const project = await getAllProjects()
      if (project) {
        return response.status(200).json({ project })
      } else {
        return response.status(401).json({ message: 'project is not added' })
      }
    }
  } catch (error) {
    return response.status(500).json({ error: 'Server Error' })
  }
}
