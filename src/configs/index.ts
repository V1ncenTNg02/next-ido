export interface Config {
  spaceId: string
  storyblokApiKey: string
  storyblokOAuthToken: string
  storyblokPreviewSecret: string
  pagesBasePath: string
  projectSlug: string
  revalidateISRTime: number
  settingsSlug: string
  dataSlug: string
  userApiPrefix: string
  projectsApiPrefix: string
  referralApiPrefix: string
  eventsApiPrefix: string
  contractsApiPrefix: string
  alchmeyKey: string
  twitterClientId: string
  twitterClientSecret: string
  jwtSecret: string
  walletConnectId: string
  admins: string[]
}

const config: Config = {
  spaceId: process.env.STORYBLOK_SPACE_ID ?? '',
  storyblokApiKey: process.env.STORYBLOK_API_KEY ?? '',
  storyblokOAuthToken: process.env.STORYBLOK_OAUTH_TOKEN ?? '',
  storyblokPreviewSecret: process.env.STORYBLOK_PREVIEW_SECRET ?? '',
  alchmeyKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
  twitterClientId: process.env.TWITTER_CONSUMER_KEY ?? '',
  twitterClientSecret: process.env.TWITTER_CONSUMER_SECRET ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '8',
  walletConnectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? '',
  pagesBasePath: 'pages',
  revalidateISRTime: 10,
  settingsSlug: 'settings',
  projectSlug: 'pages/projects',
  dataSlug: 'data',
  userApiPrefix: '/api/user',
  projectsApiPrefix: '/api/projects',
  referralApiPrefix: '/api/referrals',
  eventsApiPrefix: '/api/events',
  contractsApiPrefix: '/api/contracts',
  admins: ['0x777BEeF85E717Ab18e44cd054B1a1E33a4A93b83']
}

export default config

export const FIRST_LEVEL_SCORE = 10
export const SECOND_LEVEL_SCORE = 5

export * from './abiConfig'
export * from './abis'
export * from './networkConfig'
