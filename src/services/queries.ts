export const GET_SWAPPEDS = `
 query getSwappedForAll($first: Int, $fromBlock: Int) {
    swappeds(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id,
      index,
      sender,
      amount0,
      amount1
    },
    bids(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id,
      index,
      sender,
      amount0,
      amount1
    },
    bounceEnglishAuctionSwappeds(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id,
      index,
      sender,
      amount0,
      amount1
    }
  }
`

export const GET_USERCLAIMEDS = `
  query getUserClaimedForAll($first: Int, $index:Int, $sender:String,$fromBlock: Int){
    userClaimeds(first: $first) {
      index
     amount0
      sender
    },
    bounceDutchAuctionUserClaimeds(first: $first) {
      index
     filledAmount0
      sender
    },
    bounceEnglishAuctionUserClaimeds(first: $first) {
      index
     amount0
      sender
    }
  }
`
