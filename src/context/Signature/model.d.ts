import { User } from '@prisma/client'
import React from 'react'

export interface Signature {
  recoveredAddress: string | null
  setRecoveredAddress: React.Dispatch<React.SetStateAction<string | null>>
  signatureCheckPass: boolean
  setSignatureCheckPass: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
  showLoading: boolean
}
