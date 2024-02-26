import axios from 'axios'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import styles from './RefCodeInput.module.css'

import { StyledButton } from '../../StyledButton/StyledButton'
import { HeaderBold } from '../../Typography/Typography'
import config from '../../../configs'
import { useCustomToast } from '../../../context/Toast/hooks'

type RefCodeInputProps = {
  setRefValidationPass: (refValidationPass: boolean) => void
}

const RefCodeInput: React.FC<RefCodeInputProps> = ({ setRefValidationPass }) => {
  const [inputValues, setInputValues] = useState(Array(8).fill(''))
  const [focusIndex, setFocusIndex] = useState<number>(0)
  const [isCodeValid, setIsCodeValid] = useState(false)
  const inputRefs = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const { showErrorToast } = useCustomToast()
  const router = useRouter()

  useEffect(() => {
    if (router.isReady && router.query.refCode) {
      const refCode = router.query.refCode as string
      if (router.query.refCode.length > 8) {
        const array = refCode.slice(0, 8).split('')
        setInputValues(array)
      } else {
        const array = refCode.split('')
        setInputValues(array)
      }
      setFocusIndex(refCode.length - 1)
    }
  }, [router.isReady, router.query.refCode])

  const handleSubmitRefCode = async (code: string) => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${config.referralApiPrefix}?action=codeUsage&&code=${code}`)
      const { isCodeExisting, isCodeUsed } = data
      if (!isCodeExisting) showErrorToast(t('toast-code-not-exist'))
      if (isCodeUsed) showErrorToast(t('toast-code-used'))
      if (isCodeExisting && !isCodeUsed) {
        sessionStorage.setItem('referralCode', code)
        const res = await axios.post(`${config.userApiPrefix}?action=inputReferralCode`, { code })
        const { token } = res.data
        if (token) {
          sessionStorage.setItem('referralToken', token)
          setRefValidationPass(true)
        }
      }
    } catch (error) {
      sessionStorage.removeItem('referralCode')
      console.error('submit ref code error', error)
      showErrorToast(t('toast-code-error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const code = inputValues.join('')
    handleSubmitRefCode(code)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasteValue = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '')
    const trimmedPasteValue = pasteValue.slice(-inputValues.length)
    const newInputValues = Array(inputValues.length).fill('')
    trimmedPasteValue.split('').forEach((char, index) => {
      index < inputValues.length ? (newInputValues[index] = char) : null
    })

    setInputValues(newInputValues)
    const lastFilledInputIndex = newInputValues.findIndex((val, index) => val === '' && index > 0)
    setFocusIndex(lastFilledInputIndex >= 0 ? lastFilledInputIndex : inputValues.length - 1)
  }

  const handleInputChange = (index: number, value: any) => {
    const newInputValues = [...inputValues]
    newInputValues[index] = value
    !value ? setFocusIndex(index - 1) : setFocusIndex(index + 1)
    setInputValues(newInputValues)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        {
          e.preventDefault()
          setFocusIndex(index - 1)
          const newInputValues = [...inputValues]
          newInputValues[index] = ''
          setInputValues(newInputValues)
        }
        break
      case 'ArrowLeft':
        if (index > 0) setFocusIndex(index - 1)
        break
      case 'ArrowRight':
        if (index < inputValues.length - 1) setFocusIndex(index + 1)
        break
      case 'Enter': {
        const code = inputValues.join('')
        handleSubmitRefCode(code)
        break
      }
    }
  }

  useEffect(() => {
    inputRefs.current?.focus()
  }, [focusIndex])

  useEffect(() => {
    const referralCode = inputValues.join('')
    const isValid = /^[A-Za-z0-9]{8}$/.test(referralCode)
    setIsCodeValid(isValid)
  }, [inputValues])

  return (
    <div className={styles.backgroundLayer}>
      <div className={styles.bodyContent}>
        <div className={styles.imageWrapper}></div>
        <div className=' lg:col-span-2  overflow-hidden'>
          <div className='mt-28'>
            <HeaderBold className={styles.headerText}>{t('signup-enter-code')}</HeaderBold>
            <form onSubmit={e => handleSubmit(e)} className={styles.form}>
              <div className={styles.inputGroups}>
                {inputValues.map((value, index) => (
                  <input
                    key={index}
                    type='text'
                    value={value}
                    onPaste={handlePaste}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onClick={() => setFocusIndex(index)}
                    onChange={e => handleInputChange(index, e.target.value)}
                    maxLength={1}
                    className={styles.input}
                    ref={index === focusIndex ? inputRefs : null}
                  />
                ))}
              </div>
              {isCodeValid ? (
                <StyledButton type='submit' size='large' colorTheme='theme-1' loading={loading} className={styles.button}>
                  {t('signup-enter-code')}
                </StyledButton>
              ) : (
                <StyledButton disable size='large' colorTheme='theme-1' className={styles.button}>
                  {t('signup-redeem-code')}
                </StyledButton>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefCodeInput
