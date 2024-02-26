import { useContext } from 'react'

import { ToastContext } from './ToastProvider'

export const useCustomToast = () => useContext(ToastContext)
