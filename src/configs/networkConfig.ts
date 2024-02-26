export type HexData = `0x${string}`

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ''

interface NetworkConfig {
  [id: string]: {
    fixedSwapContract: HexData
    dutchAuctionContract: HexData
    englishAuctionContract: HexData
    chainName: string
    rpcUrl: string
    currencyName: string
    fromBlock: number
    image: string
    explorerUrl: {
      tx: string
      address: string
      block: string
    }
  }
}

export const networkConfig: NetworkConfig = {
  netId5: {
    fixedSwapContract: '0x529Ce70901556546EF412E98dF42a15b614d09A0',
    dutchAuctionContract: '0x4e0226D2480aaEdd90b38e4dDcc0C3aFcAAa6D0D',
    englishAuctionContract: '0x275E6a8028ADf0cBc55F847D30c8956BC86628DF',
    rpcUrl: `https://eth-goerli.g.alchemy.com/v2/${alchemyKey}`,
    chainName: 'goerli',
    currencyName: 'gETH',
    fromBlock: 10309103,
    explorerUrl: {
      tx: 'https://goerli.etherscan.io/tx/',
      address: 'https://goerli.etherscan.io/address/',
      block: 'https://goerli.etherscan.io/block/'
    },
    image: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628'
  },
  netId11155111: {
    fixedSwapContract: '0xffb28fb4812f058dec7ea858ab78675438b0e06b',
    dutchAuctionContract: '0x6A8F4b55801Db09908d82fDAe95d9c3717620a23',
    englishAuctionContract: '0xd0096521EF2626B474257587bD501A76e496005B',
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
    chainName: 'sepolia',
    currencyName: 'sETH',
    fromBlock: 5090002,
    explorerUrl: {
      tx: 'https://sepolia.etherscan.io/tx/',
      address: 'https://sepolia.etherscan.io/address/',
      block: 'https://sepolia.etherscan.io/block/'
    },
    image: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628'
  }
}
