import { useWeb3Modal } from '@web3modal/wagmi/react'
import axios from 'axios'
import { t } from 'i18next'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { recoverMessageAddress } from 'viem'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import RefCodeInput from '../../components/Input/RefCodeInput/RefCodeInput'
import Layout from '../../components/Layout/Layout'
import ProgressionMap from '../../components/ProgressionMap/ProgressionMap'
import config from '../../configs'
import { GlobalData } from '../../context/GlobalData/model'
import { getGlobalData } from '../../context/GlobalData/remote'
import { useSignature } from '../../context/Signature/hooks'
import { useCustomToast } from '../../context/Toast/hooks'
import { sanitizeProps } from '../../helpers'

interface Props {
  preview: boolean
  globalData: GlobalData
}

const Signup: React.FC<Props> = ({ preview }) => {
  const session = useSession()
  const router = useRouter()
  const [refValidationPass, setRefValidationPass] = useState(false)
  const { recoveredAddress, setRecoveredAddress, signatureCheckPass, user, setUser } = useSignature()
  const { data: signMessageData, signMessage, variables } = useSignMessage()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { showErrorToast } = useCustomToast()
  const { open } = useWeb3Modal()

  useEffect(() => {
    if (user && localStorage.getItem('userToken')) router.push('/user')
  }, [router, user])

  useEffect(() => {
    if (!address || recoveredAddress) return
    const message = 'Sign in to the Next Ido early access waitlist'
    signMessage({ message })
  }, [address, recoveredAddress, signMessage])

  useEffect(() => {
    const autoCheckRefToken = async () => {
      const refToken = sessionStorage.getItem('referralToken')
      if (refToken) {
        const res = await axios.post(`${config.userApiPrefix}?action=validateRefToken`, { token: refToken })
        const { validated } = res.data
        if (validated) {
          setRefValidationPass(true)
          return
        }
        sessionStorage.removeItem('referralToken')
      }
    }
    autoCheckRefToken()
  }, [])

  useEffect(() => {
    const handleSignature = async () => {
      if (variables?.message && signMessageData) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData
        })
        setRecoveredAddress(recoveredAddress)
      }
    }
    handleSignature()
  }, [setRecoveredAddress, signMessageData, variables?.message])

  useEffect(() => {
    const signup = async () => {
      if (!session.data) return
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if (!session.data.user?.username) return
      if (localStorage.getItem('userToken')) return

      if (signatureCheckPass) {
        const resExistence = await axios.post(`${config.userApiPrefix}?action=addressExistence`, { address: recoveredAddress })
        const { existence } = resExistence.data
        if (existence) {
          router.push('/user')
          return
        }

        const refToken = sessionStorage.getItem('referralToken')

        const resUserData = await axios.post(`${config.userApiPrefix}?action=signup`, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          twitter: session.data?.user?.username,
          twitterAvatar: session.data?.user.image,
          etherAddress: recoveredAddress,
          refToken
        })
        const { userData } = resUserData.data
        const { userInfo, userToken } = userData
        localStorage.setItem('userToken', userToken)
        setUser(userInfo)
      }
    }
    signup()
  }, [signatureCheckPass, session.data, router])

  const handleTwitterAuth = async () => {
    const refToken = sessionStorage.getItem('referralToken')
    const res = await axios.post(`${config.userApiPrefix}?action=validateRefToken`, { token: refToken })
    const { validated } = res.data
    if (validated) {
      await signIn('twitter')
    } else {
      sessionStorage.removeItem('referralToken')
      sessionStorage.removeItem('referralCode')
      setRefValidationPass(false)
    }
  }

  const handleMetaMaskAuth = async () => {
    try {
      if (isConnected) {
        disconnect()
      }
      open({ view: 'Connect' })
    } catch (error: any) {
      showErrorToast(t('toast-handleConnectWallet-error'))
      console.error('handleMetaMaskAuth error', error.message)
    }
  }

  return (
    <Layout preview={preview} showFooter={false}>
      <Head>
        <title>Next IDO | Sign Up</title>
      </Head>
      {refValidationPass ? (
        <main className='bg-cube bg-grey-100 bg-no-repeat bg-cover bg-center min-h-[95vh] text-primary'>
          <div className='max-w-1440 mx-auto'>
            <ProgressionMap
              handleTwitterAuth={handleTwitterAuth}
              handleMetaMaskAuth={handleMetaMaskAuth}
              recoveredAddress={recoveredAddress}
              isConnected={isConnected}
            />
          </div>
        </main>
      ) : (
        <RefCodeInput setRefValidationPass={setRefValidationPass} />
      )}
    </Layout>
  )
}

export default Signup

export const getStaticProps: GetStaticProps = async context => {
  return {
    props: sanitizeProps({
      globalData: await getGlobalData(context.locale),
      preview: !!context.preview
    }),
    revalidate: config.revalidateISRTime
  }
}
