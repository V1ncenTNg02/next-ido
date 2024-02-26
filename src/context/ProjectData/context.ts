import { createContext } from 'react'

import { Project } from './model'

export const ProjectDataContext = createContext<Project | undefined>(undefined)
