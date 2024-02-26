import { useContext } from 'react'

import { SettingsContext } from './GlobalDataProvider'

export const useSettings = () => useContext(SettingsContext)
