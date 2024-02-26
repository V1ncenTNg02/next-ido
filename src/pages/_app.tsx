import { apiPlugin, storyblokInit } from '@storyblok/react'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import i18next from 'i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { configureChains, WagmiConfig } from 'wagmi'
import { goerli, sepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import '../styles/globals.css'
import 'node_modules/flag-icons/css/flag-icons.min.css'
import 'react-toastify/dist/ReactToastify.css'

import FullScreenLoader from '../components/FullScreenLoader/FullScreenLoader'
import config from '../configs'
import GlobalDataProvider from '../context/GlobalData/GlobalDataProvider'
import NavigationProvider from '../context/Navigation/NavigationProvider'
import { RefreshContextProvider } from '../context/Refresh/context'
import SignatureProvider from '../context/Signature/SignatureProvider'
import ToastProvider from '../context/Toast/ToastProvider'
import locale_en from '../../public/locales/en.json'
import locale_zh from '../../public/locales/zh.json'

storyblokInit({
  accessToken: config.storyblokApiKey,
  use: [apiPlugin]
})

const { chains } = configureChains([goerli, sepolia], [alchemyProvider({ apiKey: config.alchmeyKey }), publicProvider()])

const wagmiConfig = defaultWagmiConfig({ chains, projectId: config.walletConnectId })

createWeb3Modal({
  wagmiConfig,
  projectId: '5bda301a0567899bc88afff89e1d5414',
  chains
})

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)
  const { globalData, session } = pageProps
  const router = useRouter()

  const lang = router.locale || 'en'

  i18next.init({
    lng: lang,
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: { translation: locale_en },
      zh: { translation: locale_zh }
    },
    interpolation: {
      escapeValue: false
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Head>
        <meta name='description' content='Next IDO' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <WagmiConfig config={wagmiConfig}>
        <SessionProvider session={session} refetchInterval={0}>
          <RefreshContextProvider>
            <GlobalDataProvider globalData={globalData}>
              <NavigationProvider>
                <SignatureProvider>
                  <ToastProvider>
                    <I18nextProvider i18n={i18next} defaultNS='translation'>
                      <FullScreenLoader />
                      <Component {...pageProps} />
                    </I18nextProvider>
                  </ToastProvider>
                </SignatureProvider>
              </NavigationProvider>
            </GlobalDataProvider>
          </RefreshContextProvider>
        </SessionProvider>
      </WagmiConfig>
    </>
  )
}
