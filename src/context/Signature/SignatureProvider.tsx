import { User } from '@prisma/client'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import { Signature } from './model'
import config from '../../configs'

export const SignatureContext = createContext<Signature>({
  recoveredAddress: null,
  setRecoveredAddress: () => {},
  signatureCheckPass: false,
  setSignatureCheckPass: () => {},
  user: null,
  setUser: () => {},
  error: null,
  setError: () => {},
  showLoading: true
})

interface Props {
  children: React.ReactNode
}

const SignatureProvider: React.FC<Props> = ({ children }) => {
  const [recoveredAddress, setRecoveredAddress] = useState<string | null>(localStorage.getItem('recoveredAddress'))
  const [signatureCheckPass, setSignatureCheckPass] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showLoading, setShowLoading] = useState(!!localStorage.getItem('userToken'))
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const resetLoginStatus = () => {
    localStorage.removeItem('recoveredAddress')
    localStorage.removeItem('userToken')
    setUser(null)
    setRecoveredAddress(null)
    setSignatureCheckPass(false)
    setShowLoading(false)
  }

  useEffect(() => {
    const autoCheckAddress = () => {
      const recoverAddress = localStorage.getItem('recoveredAddress')
      if (!recoverAddress) {
        setSignatureCheckPass(false)
        return
      }
      setRecoveredAddress(recoverAddress)
    }
    autoCheckAddress()
  }, [])

  useEffect(() => {
    const autoCheckSignature = async () => {
      if (!isConnected) {
        resetLoginStatus()
        return
      }
      if (!address || !recoveredAddress) {
        setSignatureCheckPass(false)
        return
      }
      if (address && isConnected) {
        if (recoveredAddress === address) {
          setSignatureCheckPass(true)
          if (user) {
            return
          }
          localStorage.setItem('recoveredAddress', recoveredAddress)
          const userToken = localStorage.getItem('userToken')
          if (!userToken) {
            return
          }
          try {
            if (error) return

            const resUser = await axios.post(`${config.userApiPrefix}?action=fetchUser`, { token: userToken })
            const userData = resUser.data
            if (!userData.user) {
              setError('Validation error or expired, please reconnect your wallet')
              disconnect()
              resetLoginStatus()
              localStorage.removeItem('userToken')
              return
            }
            setUser(userData.user)
          } catch (error) {
            setError('Validation error or expired, please reconnect your wallet')
            setTimeout(() => {
              disconnect()
            }, 300)
          } finally {
            setShowLoading(false)
          }
        } else {
          setShowLoading(false)
          disconnect()
        }
      }
    }
    autoCheckSignature()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoveredAddress, address, isConnected, user])
  return (
    <SignatureContext.Provider
      value={{ recoveredAddress, setRecoveredAddress, signatureCheckPass, setSignatureCheckPass, user, setUser, error, setError, showLoading }}
    >
      {children}
    </SignatureContext.Provider>
  )
}

export default SignatureProvider
