import React, { createContext, useState } from 'react'

interface Props {
  children: React.ReactNode
}

export type buildingStatus = null | 'prepare' | 'write' | 'wait' | 'success'

export interface Swap {
  triggerRefresh: number
  approveError: string | null
  approveStatus: buildingStatus
  swapError: string | null
  swapStatus: buildingStatus
  claimError: string | null
  claimStatus: buildingStatus
  onSetApproveError: (_error: string | null) => void
  onSetSwapError: (_error: string | null) => void
  onSetClaimError: (_error: string | null) => void
  onSetApproveStatus: (_status: buildingStatus) => void
  onSetSwapStatus: (_status: buildingStatus) => void
  onSetClaimStatus: (_status: buildingStatus) => void
  onSetTriggerRefresh: () => void
}

export const SwapContext = createContext<Swap>({
  triggerRefresh: 0,
  approveStatus: null,
  swapStatus: null,
  claimStatus: null,
  swapError: null,
  approveError: null,
  claimError: null,
  onSetApproveError: () => undefined,
  onSetApproveStatus: () => undefined,
  onSetSwapError: () => undefined,
  onSetSwapStatus: () => undefined,
  onSetClaimError: () => undefined,
  onSetClaimStatus: () => undefined,
  onSetTriggerRefresh: () => undefined
})

const SwapProvider: React.FC<Props> = ({ children }) => {
  const [approveStatus, setApproveStatus] = useState<buildingStatus>(null)
  const [swapStatus, setSwapStatus] = useState<buildingStatus>(null)
  const [claimStatus, setClaimStatus] = useState<buildingStatus>(null)
  const [approveError, setApproveError] = useState<string | null>(null)
  const [swapError, setSwapError] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0)
  const onSetApproveStatus = (status: buildingStatus) => setApproveStatus(status)
  const onSetSwapStatus = (status: buildingStatus) => setSwapStatus(status)
  const onSetClaimStatus = (status: buildingStatus) => setClaimStatus(status)
  const onSetApproveError = (error: string | null) => setApproveError(error)
  const onSetSwapError = (error: string | null) => setSwapError(error)
  const onSetClaimError = (error: string | null) => setClaimError(error)
  const onSetTriggerRefresh = () => setTriggerRefresh(x => x + 1)

  return (
    <SwapContext.Provider
      value={{
        approveStatus,
        swapStatus,
        claimStatus,
        approveError,
        swapError,
        claimError,
        triggerRefresh,
        onSetApproveStatus,
        onSetSwapStatus,
        onSetClaimStatus,
        onSetApproveError,
        onSetSwapError,
        onSetClaimError,
        onSetTriggerRefresh
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export default SwapProvider
