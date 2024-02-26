import { useContext } from 'react'

import { SignatureContext } from './SignatureProvider'

export const useSignature = () => useContext(SignatureContext)
