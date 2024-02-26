import { SBAsset, SBLink } from './system'

export interface SBProject {
  project_logo: SBAsset
  project_name: string
  project_summary: string
  whitelist_addresses: string
  tokenomics?: string
  website: SBLink
  twitter: SBLink
  youtube?: SBLink
  telegram?: SBLink
  discord?: SBLink
  instagram?: SBLink
  project_team?: string
  project_info_details: string
}
