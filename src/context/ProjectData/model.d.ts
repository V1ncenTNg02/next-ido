import { Contract } from '../../models/types'
import { SBAsset, SBLink } from '../../storyblok/models'

export type PoolType = 'FIX' | 'ENGLISH' | 'DUTCH'

export type PoolStatusType = 'Coming Soon' | 'Live' | 'Claim Coming Soon' | 'Claim Live' | 'Closed' | 'Unknown'

type SocialLink = {
  [key: string]: SBLink | undefined
}

export interface Project {
  projectLogo: SBAsset
  projectName: string
  projectSummary: string
  socialLinks: SocialLink
  projectInfoDetails: string
  projectTeam?: string
  tokenomics?: string
  contracts?: Contract[]
  whitelistAddress: string[]
}
