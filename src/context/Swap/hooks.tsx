import { useContext } from 'react'

import { SwapContext } from './SwapProvider'

export const useSwap = () => useContext(SwapContext)
