import { User } from '@prisma/client'
import axios from 'axios'
import { t } from 'i18next'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { FaCopy } from 'react-icons/fa'

import styles from './User.module.css'

import Layout from '../../components/Layout/Layout'
import { StyledButton } from '../../components/StyledButton/StyledButton'
import { Heading1Bold } from '../../components/Typography/Typography'
import UserProfile from '../../components/User/UserProfile'
import config from '../../configs'
import GlobalDataProvider from '../../context/GlobalData/GlobalDataProvider'
import { GlobalData } from '../../context/GlobalData/model'
import { getGlobalData } from '../../context/GlobalData/remote'
import { useSignature } from '../../context/Signature/hooks'
import { useCustomToast } from '../../context/Toast/hooks'
import { getRefCodePair } from '../../helpers'
import { sanitizeProps } from '../../helpers/next-props'
import { ReferralCodeWithUser } from '../../models/types'
import { fetchRankingInfo } from '../../services/users'

interface Props {
  preview: boolean
  globalData: GlobalData
  orderedUserInfo: User[]
}

const Signin: React.FC<Props> = ({ globalData, preview, orderedUserInfo }) => {
  const [codes, setCodes] = useState<ReferralCodeWithUser[]>([])

  const { user, error, setError } = useSignature()
  const [usedCode, setUsedCode] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const { showErrorToast } = useCustomToast()

  useEffect(() => {
    if (!codes) return
    let totalUsedCodes = 0
    codes.map(code => {
      if (code.isUsed && usedCode <= codes.length) totalUsedCodes += 1
    })
    setUsedCode(totalUsedCodes)
  }, [codes, usedCode])

  useEffect(() => {
    if (!error) return
    showErrorToast(error)
    setError(null)
  }, [error, setError, showErrorToast])

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        if (!user) return
        const resCodes = await axios.get(`${config.referralApiPrefix}?action=codes&userId=${user.id}`)
        setCodes(resCodes.data)
      } catch (e) {
        console.error('fetch code error')
        showErrorToast(t('toast-fetch-code-error'))
      }
    }
    fetchCodes()
  }, [user, showErrorToast])

  const generateCode = async () => {
    try {
      setLoading(true)
      if (!user) return
      const { status, data } = await axios.post(config.referralApiPrefix, { userId: user.id })
      if (data && status === 201) setCodes(data)
    } catch (e) {
      console.error('generate code error', e)
      showErrorToast(t('toast-generate-code-error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout preview={preview} showFooter={false}>
      <Head>
        <title>Next IDO | User</title>
      </Head>
      <GlobalDataProvider globalData={globalData}>
        {!user ? (
          <div className={styles.signInContainer}>
            <Heading1Bold className='text-primary'>{t('connect-your-wallet-hint')}</Heading1Bold>
          </div>
        ) : (
          <div className={styles.background}>
            <UserProfile orderedUserInfo={orderedUserInfo} />
            {codes.length !== 0 ? (
              <DisplayCodes codes={codes} />
            ) : (
              <div className={styles.buttonWrapper}>
                <StyledButton onClick={() => generateCode()} colorTheme='theme-1' size='medium' loading={loading}>
                  {t('user-generate-code')}
                </StyledButton>
              </div>
            )}
          </div>
        )}
      </GlobalDataProvider>
    </Layout>
  )
}

export default Signin

export const getStaticProps: GetStaticProps = async context => {
  const orderedUserInfo = await fetchRankingInfo()

  return {
    props: sanitizeProps({
      globalData: await getGlobalData(context.locale),
      preview: !!context.preview,
      orderedUserInfo
    }),
    revalidate: config.revalidateISRTime
  }
}

const DisplayCodes: React.FC<{ codes: ReferralCodeWithUser[] }> = ({ codes }) => {
  const toast = useCustomToast()
  const codePairs = getRefCodePair(codes)

  const handleCopyCode = async (e: any, code: string) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/signup?refCode=${code}`)
      toast.showSuccessToast('Copy Success')
    } catch (e) {
      console.error('copy error', e)
    }
  }

  return (
    <table className={styles.codesTable}>
      <thead>
        <tr>
          <td className='p-6'>
            <span className={styles.tableHeaderFont}>CODE ADDRESS</span>
          </td>
          <td className='p-6 border-l-2 border-primary'>
            <span className={styles.tableHeaderFont}>CODE ADDRESS</span>
          </td>
        </tr>
      </thead>

      <tbody>
        {codePairs.map((codePair, index) => (
          <tr className={styles.tableHeaderFont} key={index}>
            {codePair.map((code, codeIndex) =>
              !code.isUsed ? (
                <td className={codeIndex === 0 ? styles.tableContentFontWithBorder : styles.tableContentFont} key={code.refCode}>
                  <div className={styles.tableColumnWrapper}>
                    {code.refCode} <FaCopy onClick={e => handleCopyCode(e, code.refCode)} />
                  </div>
                </td>
              ) : (
                <td className={codeIndex === 0 ? styles.tableContentFontWithBorder : styles.tableContentFont} key={code.refCode}>
                  {`${code.referredUser?.etherAddress.substring(0, 6)}...${code.referredUser?.etherAddress.slice(-4)}`}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
