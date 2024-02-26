import { useContext } from 'react'

import { ProjectDataContext } from './context'

export const useProjectData = () => useContext(ProjectDataContext)
