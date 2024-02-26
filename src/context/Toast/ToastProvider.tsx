import React, { createContext, useRef } from 'react'
import { toast, ToastContainer, ToastOptions } from 'react-toastify'
import { useNetwork } from 'wagmi'

import * as Model from './model'
import CustomToast from '../../components/Toast/CustomToast'

export const ToastContext = createContext<Model.Toast>({
  showErrorToast: () => {},
  showPendingToast: () => {},
  updatePendingToast: () => {},
  showSuccessToast: () => {},
  closeToast: () => {}
})

interface Props {
  children: React.ReactNode
}

const ToastProvider: React.FC<Props> = ({ children }) => {
  const toastId = useRef<number | string>(0)
  const { chain } = useNetwork()
  const netId = chain?.id ?? 5

  const showErrorToast = (message: string, options?: ToastOptions) => {
    toast.error(message, { ...options, position: 'bottom-right' })
  }

  const showPendingToast = (hash?: string, message?: string) => {
    toastId.current = toast.loading(<CustomToast netId={netId} hash={hash} message={message ?? 'Transaction Pending'} />, {
      closeButton: true,
      position: 'bottom-right'
    })
  }

  const updatePendingToast = (hash?: string, message?: string) => {
    toast.update(toastId.current, {
      render: <CustomToast netId={netId} hash={hash} message={message ?? 'Transaction Pending'} />,
      isLoading: true,
      closeButton: true,
      position: 'bottom-right'
    })
  }

  const showSuccessToast = (hash?: string, message?: string) => {
    toast.update(toastId.current, {
      render: <CustomToast netId={netId} hash={hash} message={message ?? 'Transaction successful'} />,
      type: 'success',
      isLoading: false,
      autoClose: 5000,
      closeButton: true,
      position: 'bottom-right'
    })
  }

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }

  return (
    <ToastContext.Provider
      value={{
        showErrorToast,
        showPendingToast,
        updatePendingToast,
        showSuccessToast,
        closeToast
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export default ToastProvider
