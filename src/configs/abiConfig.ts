import { abis } from './abis'
interface AbiConfig {
  fixedSwapABI: any
  dutchAuctionABI: any
  englishAuctionABI: any
}

export const abiConfig: AbiConfig = {
  fixedSwapABI: abis.fixedSwap,
  dutchAuctionABI: abis.dutchAuction,
  englishAuctionABI: abis.englishAuction
}
