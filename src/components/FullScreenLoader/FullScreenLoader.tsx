import { useRouter } from 'next/router'
import NextTopLoader from 'nextjs-toploader'
import React, { useEffect, useState } from 'react'

import styles from './FullScreenLoader.module.css'

import { Logo } from '../Logo/Logo'

const FullScreenLoader: React.FC = () => {
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setShowLoading(true)
    })

    router.events.on('routeChangeComplete', () => {
      setShowLoading(false)
    })

    return () => {
      router.events.off('routeChangeStart', () => {
        setShowLoading(false)
      })

      router.events.off('routeChangeComplete', () => {
        setShowLoading(false)
      })
    }
  }, [router.events])

  return (
    <div className='z-50'>
      {showLoading && <NextTopLoader color='#AADBFF' showSpinner={false} />}
      {showLoading && (
        <div className={styles.loadingContainer}>
          <div className='animate-bounce '>
            <Logo />
          </div>
        </div>
      )}
    </div>
  )
}

export default FullScreenLoader
