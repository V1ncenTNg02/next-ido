import BN from 'bignumber.js'
import cx from 'classnames'
import { t } from 'i18next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { FaExternalLinkSquareAlt } from 'react-icons/fa'
import { useNetwork } from 'wagmi'

import styles from './Investments.module.css'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { Header } from '../Typography/Typography'
import { useSignature } from '../../context/Signature/hooks'
import { formatTokenAmount, getChainName, mapPoolStatus, numberFormat } from '../../helpers'
import { useEvents } from '../../hooks'
import { Contract } from '../../models/types'

interface Props {
  contracts: Contract[]
}

const Investments: React.FC<Props> = ({ contracts }) => {
  const { chain } = useNetwork()
  const netId = chain?.id ?? 5
  const { allSwappedData, allUserClaimedData, error, isLoading, loaded, setLoaded } = useEvents(netId)
  const { user } = useSignature()
  const router = useRouter()

  const qualifiedData = allSwappedData.filter(item => item.sender === user?.etherAddress.toLowerCase())

  const results: any[] = qualifiedData
    .map(qData => {
      const matchingContract = contracts.find(c => c.poolIndex.toString() === qData.index && c.contract === qData.type)

      if (matchingContract) {
        return {
          ...qData,
          projectName: matchingContract.slug,
          projectLogo: matchingContract.projectIcon,
          auctionType: matchingContract.contract,
          poolInfo: matchingContract.poolInfo,
          netId: matchingContract.netId
        }
      }

      return null
    })
    .filter(item => item !== null) // Filter out null items

  const resultsMerged = results.reduce((acc, item) => {
    const key = `${item.index}-${item.type}`
    if (acc[key]) {
      acc[key].amount0 = new BN(acc[key].amount0).plus(new BN(item.amount0)).toFixed()
      acc[key].amount1 = new BN(acc[key].amount1).plus(new BN(item.amount1)).toFixed()
    } else {
      acc[key] = { ...item }
    }
    return acc
  }, {})

  const finalResults: any[] = Object.values(resultsMerged)

  const tableData = useMemo(() => {
    return finalResults
      .map(item => {
        if (!user) return null
        const poolUserClaimedData = allUserClaimedData?.filter(
          ucd => ucd.index === item.index && ucd.sender === user.etherAddress.toLowerCase() && ucd.type === item.type
        )
        const totalCurrentUserClaimed = poolUserClaimedData?.reduce((accumulator, currentValue) => accumulator.plus(new BN(currentValue.amount0)), new BN(0))
        return { ...item, currentClaimed: totalCurrentUserClaimed?.toFixed() }
      })
      .filter(item => item !== null)
  }, [user, allUserClaimedData, finalResults])

  useEffect(() => {
    setLoaded(false)
  }, [netId])

  if (isLoading && !error && !loaded) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner className={styles.loading} />
      </div>
    )
  }

  if (error && !loaded) {
    return (
      <div className={styles.tableOuterContainer}>
        <div className={cx(styles.tableOuterContainer)}>
          <Header className={styles.noInvestement}>{error === 'We do not support this chain' ? t('network-not-supported') : t('network-error')}</Header>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableOuterContainer}>
      {finalResults?.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className='w-full overflow-x-scroll'>
            <thead className={styles.tableHead}>
              <tr>
                <th scope='col' className='p-6'>
                  Project
                </th>
                <th scope='col' className='p-6'>
                  Chain
                </th>
                <th scope='col' className='p-6'>
                  Auction Type
                </th>
                <th scope='col' className='p-6'>
                  Invested
                </th>
                <th scope='col' className='p-6'>
                  Total Received
                </th>
                <th scope='col' className='p-6'>
                  Claimed
                </th>
                <th scope='col' className='p-6'>
                  Pool Status
                </th>
                <th scope='col' className='p-6'>
                  Claim Link
                </th>
              </tr>
              <tr className={styles.divider}></tr>
            </thead>

            <tbody className={styles.tableBody}>
              {tableData?.map((item, index) => (
                <tr key={index}>
                  <td className={styles.projectNameContainer}>
                    <Image src={item.projectLogo} alt={item.projectName} width={40} height={40} />
                    {item.projectName}
                  </td>
                  <td>{getChainName(item.netId)}</td>
                  <td>{item.auctionType}</td>
                  <td>
                    {`${
                      isNaN(Number(numberFormat(formatTokenAmount(item.amount1, item.poolInfo.token1.decimals), '0,0.00')))
                        ? '0.00'
                        : numberFormat(formatTokenAmount(item.amount1, item.poolInfo.token1.decimals), '0,0.00')
                    } ${item.poolInfo.token1.symbol}`}
                  </td>
                  <td>{`${numberFormat(formatTokenAmount(item.amount0, item.poolInfo.token0.decimals), '0,0.00')} ${item.poolInfo.token0.symbol}`}</td>
                  <td>
                    {item.auctionType === 'FIX'
                      ? `${numberFormat(formatTokenAmount(item.amount0, item.poolInfo.token0.decimals), '0,0.00')} ${item.poolInfo.token0.symbol}`
                      : `${numberFormat(formatTokenAmount(item.currentClaimed, item.poolInfo.token0.decimals), '0,0.00')} ${item.poolInfo.token0.symbol}`}
                  </td>
                  <td> {mapPoolStatus(item.poolInfo)}</td>
                  <td>
                    <button onClick={() => router.push(`/projects/${item.projectName.toLowerCase()}`)}>
                      <FaExternalLinkSquareAlt className={styles.linkIcon} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={cx(styles.tableOuterContainer, [])}>
          <Header className={styles.noInvestement}>{t('no-investment')}</Header>
        </div>
      )}
    </div>
  )
}

export default Investments
