export interface Toast {
  showErrorToast: (message: string, options?: ToastOptions) => void
  showPendingToast: (hash?: string, message?: string) => void
  updatePendingToast: (hash?: string, message?: string) => void
  showSuccessToast: (hash?: string, message?: string) => void
  closeToast: () => void
}
