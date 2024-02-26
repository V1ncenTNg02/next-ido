import BN from 'bignumber.js'
import React, { useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'
import { useContractReads } from 'wagmi'

import styles from './SwapSection.module.css'

import AuctionCard from './AuctionCard'
import PoolInfoCard from './PoolInfoCard'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { PoolStatusType, PoolType } from '../../context/ProjectData/model'
import { getABI, getContractAddress } from '../../helpers'
import { useEvents, useSwapData, useTokenData } from '../../hooks'
import { MerkleTreeService } from '../../services/merkleTree'

interface Props {
  type: PoolType
  index: number
  name: string
  poolStatus: PoolStatusType
  whitelistAddress: string[]
}

const SwapCard: React.FC<Props> = ({ type, index, name, poolStatus, whitelistAddress }) => {
  const { chain } = useNetwork()
  const netId = chain?.id ?? 5
  const { swapOrBidData, isLoading: isFetchingSwapData } = useSwapData(netId, index, type)
  const { swapToken, isLoading: isFetchingTokenData } = useTokenData(netId, swapOrBidData?.pool?.token0, swapOrBidData?.pool?.token1)
  const { totalAmount, totalClaimed } = useEvents(netId, index, type)
  const [treeService, setTreeService] = useState<MerkleTreeService | null>(null)

  const contract = useMemo(() => {
    return {
      address: getContractAddress(type, netId),
      abi: getABI(type)
    }
  }, [type, netId])

  const { data } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: type === 'FIX' ? 'creatorClaimedP' : 'creatorClaimed',
        args: [index]
      },
      {
        ...contract,
        functionName: type === 'DUTCH' ? 'currentPrice' : 'currentAmount1',
        args: [index]
      }
    ],
    watch: true
  })

  const creatorClaimed = data && data[0] ? Boolean(data[0].result) : false
  const amountTotal0 = swapOrBidData?.pool?.amountTotal0 ?? '0'
  const amountTotal1 = swapOrBidData?.pool?.amountTotal1 ?? '1'
  const amountStartOrMin1 = swapOrBidData?.pool?.amountStartOrMin1 ?? '1'
  const amountEndOrMax1 = swapOrBidData?.pool?.amountEndOrMax1 ?? '1'
  const token0Decimal = swapToken?.token0?.decimals ?? 18
  const token1Decimal = swapToken?.token1?.decimals ?? 18

  const fixedPricePerToken1 = new BN(amountTotal0).div(new BN(10).pow(new BN(token0Decimal))).div(new BN(amountTotal1).div(new BN(10).pow(token1Decimal)))

  const currentPrice = data && data[1] && data[1].status === 'success' ? data[1].result : undefined
  const auctionPricePerToken1 = !currentPrice
    ? fixedPricePerToken1
    : type === 'ENGLISH'
    ? new BN(1)
        .div(new BN(currentPrice.toString()).div(new BN(10).pow(token1Decimal)))
        .multipliedBy(new BN(amountTotal0).div(new BN(10).pow(new BN(token0Decimal))))
    : new BN(1).div(new BN(currentPrice.toString())).multipliedBy(new BN(10).pow(token1Decimal)).decimalPlaces(0, BN.ROUND_DOWN)

  const initialPrice =
    type === 'FIX'
      ? auctionPricePerToken1
      : type === 'ENGLISH'
      ? new BN(1)
          .div(new BN(amountStartOrMin1.toString()).div(new BN(10).pow(token1Decimal)))
          .multipliedBy(new BN(amountTotal0).div(new BN(10).pow(new BN(token0Decimal))))
      : new BN(1)
          .div(new BN(amountEndOrMax1.toString()).div(new BN(10).pow(token1Decimal)))
          .multipliedBy(new BN(amountTotal0).div(new BN(10).pow(new BN(token0Decimal))))

  const isLoaded = swapOrBidData && !isFetchingSwapData && !isFetchingTokenData && swapToken

  useEffect(() => {
    if (whitelistAddress.length === 0) return
    const merkleTreeService = new MerkleTreeService(whitelistAddress)
    merkleTreeService.createTree()
    setTreeService(merkleTreeService)
  }, [whitelistAddress])

  return (
    <div className='my-4 max-w-1440 mx-auto'>
      {isLoaded ? (
        <div className={styles.twoColsWrapper}>
          {swapToken && swapOrBidData.pool && (
            <PoolInfoCard
              type={type}
              index={index}
              name={name}
              netId={netId}
              isWhiteListed={swapOrBidData.isWhitelisted}
              swapToken={swapToken}
              maxAmountPerWallet={swapOrBidData.maxAmountPerWallet}
              amountTotal0={swapOrBidData.pool.amountTotal0}
              amountTotal1={swapOrBidData.pool.amountTotal1}
              initialPrice={initialPrice}
              totalAmount={totalAmount}
              auctionPricePerToken1={auctionPricePerToken1}
              poolStatus={poolStatus}
            />
          )}
          {swapOrBidData.pool && (
            <AuctionCard
              type={type}
              index={index}
              netId={netId}
              totalAmount={totalAmount}
              swapToken={swapToken}
              creator={swapOrBidData.pool.creator}
              releaseType={swapOrBidData.releaseType}
              openAt={swapOrBidData.pool.openAt}
              closedAt={swapOrBidData.pool.closeAt}
              claimedAt={swapOrBidData.pool.claimAt}
              maxAmountPerWallet={swapOrBidData.maxAmountPerWallet}
              amountTotal0={swapOrBidData.pool.amountTotal0}
              amountTotal1={swapOrBidData.pool.amountTotal1}
              releasedDataList={swapOrBidData.releaseDataList}
              txFeeRatio={swapOrBidData.txFeeRatio}
              totalClaimed={totalClaimed}
              creatorClaimed={creatorClaimed}
              auctionPricePerToken1={auctionPricePerToken1}
              poolStatus={poolStatus}
              stakeContract={swapOrBidData.stakeContract}
              isPoolWhitelisted={swapOrBidData.isWhitelisted}
              treeService={treeService}
            />
          )}
        </div>
      ) : (
        <div className={styles.loadingContainer}>
          <LoadingSpinner className={styles.loading} />
        </div>
      )}
    </div>
  )
}

export default SwapCard
