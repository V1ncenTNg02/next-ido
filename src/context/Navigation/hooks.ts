import { useContext } from 'react'

import { NavigationContext } from './NavigationProvider'

export const useNavigation = () => useContext(NavigationContext)
