import { writeContract } from '@wagmi/core'
import axios from 'axios'
import BN from 'bignumber.js'
import { ethers } from 'ethers'
import { t } from 'i18next'
import moment from 'moment'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { readContracts, useContractRead, useNetwork, useWaitForTransaction, useWalletClient } from 'wagmi'

import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import styles from './createPool.module.css'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import ApproveButton from '../Web3Button/ApproveButton'
import { abis, HexData } from '../../configs'
import config from '../../configs'
import { PoolType } from '../../context/ProjectData/model'
import { useSignature } from '../../context/Signature/hooks'
import SwapProvider from '../../context/Swap/SwapProvider'
import { useCustomToast } from '../../context/Toast/hooks'
import {
  formatContractError,
  formatFullAmount,
  getABI,
  getChainName,
  getContractAddress,
  getSupportedChains,
  isNowAfterTimestamp,
  isTimestamp1AfterTimestamp2
} from '../../helpers'
import { useTokenData } from '../../hooks'
import { MerkleTreeService } from '../../services/merkleTree'
import { ProjectDetails } from '../../templates/ProjectProfile/model'

const DateTimePicker = dynamic(() => import('react-datetime-picker'), { ssr: false })

interface Props {
  projects: ProjectDetails[]
}

const PoolCreationForm: React.FC<Props> = ({ projects }) => {
  const { user, showLoading } = useSignature()
  const { chain } = useNetwork()
  const netId = chain?.id ?? 5
  const { data: walletClientData } = useWalletClient()

  const { showErrorToast, showPendingToast, showSuccessToast, closeToast } = useCustomToast()

  const [transactionSuccess, setTransactionSuccess] = useState(false)
  const [pendingHash, setPendingHash] = useState('')
  const [creating, setCreating] = useState(false)
  const [isAmountApproved, setIsAmountApproved] = useState(true)

  const projectIdRef = useRef(null)

  const { register, handleSubmit, watch, control, setValue } = useForm({
    defaultValues: {
      projectSlug: projects[0]?.slug,
      auctionType: 'FIX',
      whitelistOn: '0',
      releaseType: '0',
      name: 'demo',
      token0Addr: '0x10FBBbA9ce65286d50636f0D31ee390b3f3a4A39',
      etherAddr: '0x0000000000000000000000000000000000000000',
      token0Amount: 1,
      token1Amount: 1,
      amountStartOrMin1: 0.1,
      amountEndOrMax1: 1,
      fragmentsOrTimes: 10,
      startAt: new Date(),
      endAt: new Date(),
      claimStartAt: new Date(),
      claimEndAt: new Date(),
      maxAmount1PerWallet: 1,
      whiteListRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      auctionHolderOn: '0',
      reverseOn: '0',
      signature: '0x0000000000000000000000000000000000000000000000000000000000000000'
    }
  })

  const formValues = watch()

  const { swapToken } = useTokenData(netId, formValues.token0Addr as HexData, formValues.etherAddr as HexData)

  const contract = useMemo(() => {
    return {
      address: getContractAddress(formValues.auctionType as PoolType, netId),
      abi: getABI(formValues.auctionType as PoolType)
    }
  }, [formValues.auctionType, netId])

  useWaitForTransaction({
    hash: pendingHash as HexData,
    enabled: !!pendingHash,
    onSuccess(data) {
      if (data.status === 'success') {
        showSuccessToast(data.transactionHash)
        setTransactionSuccess(true)
        setPendingHash('')
      }
      setCreating(false)
    },
    onError() {
      closeToast()
      setTimeout(() => {
        showErrorToast(t('toast-pool-creation-failed'))
      }, 1000)
      setCreating(false)
    }
  })

  useEffect(() => {
    if (!pendingHash || !creating) return
    showPendingToast(pendingHash)
  }, [creating, pendingHash])

  useEffect(() => {
    const updateProject = async () => {
      if (!transactionSuccess) return
      try {
        const projectId = projectIdRef.current
        await axios.put('/api/contracts', {
          projectId
        })
      } catch (error) {
        showErrorToast(t('toast-something-wrong-after-transaction-finish'))
      } finally {
        projectIdRef.current = null
        setTransactionSuccess(false)
      }
    }
    updateProject()
  }, [setTransactionSuccess, transactionSuccess])

  useEffect(() => {
    if (formValues.auctionType === 'DUTCH' && formValues.releaseType === '0') {
      setValue('releaseType', '1')
    }
  }, [formValues.auctionType, setValue])

  const { data: allowanceAmount, refetch: refetchAllowanceAmount } = useContractRead({
    address: formValues.token0Addr as HexData,
    abi: abis.erc20,
    enabled: !!user && ethers.utils.isAddress(formValues.token0Addr),
    functionName: 'allowance',
    args: [user?.etherAddress, getContractAddress(formValues.auctionType as PoolType, netId)],
    watch: true
  })

  useEffect(() => {
    if (!swapToken) return
    if (!swapToken.token0) return

    let isWithinAllowance = true
    try {
      refetchAllowanceAmount()
      const formatAllowanceAmount = new BN(String(allowanceAmount)).div(10 ** swapToken.token0.decimals)

      isWithinAllowance = formatAllowanceAmount.isGreaterThanOrEqualTo(new BN(formValues.token0Amount.toString()))
      setIsAmountApproved(isWithinAllowance)
    } catch (error) {
      setIsAmountApproved(false)
    }
  }, [allowanceAmount, refetchAllowanceAmount, swapToken, formValues.token0Amount, formValues.auctionType])

  const handleCreatePool = async (data: any) => {
    if (!user || !swapToken || !swapToken.token0 || !swapToken.token1) {
      showErrorToast(t('toast-creation-not-ready'))
      return
    }

    if (!isAmountApproved) {
      showErrorToast('Please approve first')
    }

    setCreating(true)

    const contracts = [
      {
        ...contract,
        functionName: 'getPoolCount'
      }
    ]

    const [poolCountData] = await readContracts({
      contracts
    })

    if (!(poolCountData && poolCountData.status === 'success')) {
      showErrorToast(t('toast-creation-not-ready'))
      setCreating(false)
      return
    }

    const poolCount = poolCountData.result

    try {
      const slug = data.projectSlug
      const targetProject = projects.find(item => item.slug === slug)

      if (!targetProject) {
        setCreating(false)
        return
      }

      const SBKey = targetProject.id
      const projectIcon = targetProject.projectLogo.filename

      const whitelistAddresses = targetProject.whitelistAddress

      const projectData = {
        SBKey,
        slug,
        projectIcon,
        contract: data.auctionType,
        poolIndex: Number(poolCount),
        poolName: data.name,
        poolInfo: {
          ...swapToken,
          releaseType: data.releaseType,
          startAt: data.startAt,
          endAt: data.endAt,
          claimStartAt: data.releaseType === '0' ? null : data.claimStartAt,
          claimEndAt: data.releaseType === '2' ? data.claimEndAt : null
        },
        netId
      }
      if (!walletClientData) {
        setCreating(false)
        return
      }
      const res = await axios.post(`/api/contracts`, { projectData })

      let root = formValues.whiteListRoot
      if (formValues.whitelistOn === '1' && whitelistAddresses.length > 0) {
        const merkleTree = new MerkleTreeService(whitelistAddresses)
        merkleTree.createTree()
        root = merkleTree.getRoot()
      }

      let args = [
        String(poolCount),
        [
          formValues.name,
          formValues.token0Addr,
          formValues.etherAddr,
          formValues.token0Amount ? BigInt(new BN(formatFullAmount(formValues.token0Amount.toString(), swapToken.token0.decimals)).toFixed()) : 0,
          formValues.token1Amount ? BigInt(new BN(formatFullAmount(formValues.token1Amount.toString(), swapToken.token1.decimals)).toFixed()) : 0,
          moment(String(formValues.startAt)).unix(),
          moment(String(formValues.endAt)).unix(),
          formValues.releaseType === '0' ? '0' : moment(String(formValues.claimStartAt)).unix(),
          formValues.maxAmount1PerWallet ? BigInt(new BN(formatFullAmount(formValues.maxAmount1PerWallet.toString(), swapToken.token1.decimals)).toFixed()) : 0,
          root
        ],
        formValues.releaseType,
        formValues.releaseType === '0' ? [] : [[moment(String(formValues.claimStartAt)).unix(), moment(String(formValues.claimEndAt)).unix()]],
        formValues.auctionHolderOn === '1',
        formValues.reverseOn === '1',
        0
      ]
      if (formValues.auctionType === 'DUTCH') {
        args = [
          String(poolCount),
          [
            formValues.name,
            formValues.token0Addr,
            formValues.etherAddr,
            formValues.token0Amount ? BigInt(new BN(formatFullAmount(formValues.token0Amount.toString(), swapToken.token0.decimals)).toFixed()) : 0,
            formValues.amountEndOrMax1 ? BigInt(new BN(formatFullAmount(formValues.amountEndOrMax1.toString(), swapToken.token1.decimals)).toFixed()) : 0,
            formValues.amountStartOrMin1 ? BigInt(new BN(formatFullAmount(formValues.amountStartOrMin1.toString(), swapToken.token1.decimals)).toFixed()) : 0,
            formValues.fragmentsOrTimes,
            moment(String(formValues.startAt)).unix(),
            moment(String(formValues.endAt)).unix(),
            formValues.releaseType === '0' ? '0' : moment(String(formValues.claimStartAt)).unix(),
            formValues.maxAmount1PerWallet
              ? BigInt(new BN(formatFullAmount(formValues.maxAmount1PerWallet.toString(), swapToken.token0.decimals)).toFixed())
              : 0,
            root
          ],
          formValues.releaseType,
          formValues.releaseType === '0' ? [] : [[moment(String(formValues.claimStartAt)).unix(), moment(String(formValues.claimEndAt)).unix()]],
          formValues.auctionHolderOn === '1',
          0,
          formValues.signature
        ]
      }
      if (formValues.auctionType === 'ENGLISH') {
        args = [
          String(poolCount),
          [
            formValues.name,
            formValues.token0Addr,
            formValues.etherAddr,
            formValues.token0Amount ? BigInt(new BN(formatFullAmount(formValues.token0Amount.toString(), swapToken.token0.decimals)).toFixed()) : 0,
            formValues.amountStartOrMin1 ? BigInt(new BN(formatFullAmount(formValues.amountStartOrMin1.toString(), swapToken.token1.decimals)).toFixed()) : 0,
            formValues.amountEndOrMax1 ? BigInt(new BN(formatFullAmount(formValues.amountEndOrMax1.toString(), swapToken.token1.decimals)).toFixed()) : 0,
            formValues.fragmentsOrTimes,
            moment(String(formValues.startAt)).unix(),
            moment(String(formValues.endAt)).unix(),
            formValues.releaseType === '0' ? '0' : moment(String(formValues.claimStartAt)).unix(),
            formValues.maxAmount1PerWallet
              ? BigInt(new BN(formatFullAmount(formValues.maxAmount1PerWallet.toString(), swapToken.token1.decimals)).toFixed())
              : 0,
            root
          ],
          formValues.releaseType,
          formValues.releaseType === '0' ? [] : [[moment(String(formValues.claimStartAt)).unix(), moment(String(formValues.claimEndAt)).unix()]],
          formValues.auctionHolderOn === '1',
          0,
          formValues.signature
        ]
      }
      const txReceipt = await writeContract({
        account: walletClientData.account.address,
        args,
        functionName: 'createV2',
        address: getContractAddress(formValues.auctionType as PoolType, netId),
        abi: getABI(formValues.auctionType as PoolType)
      })
      setPendingHash(txReceipt.hash)
      projectIdRef.current = res.data.project.id
    } catch (error: any) {
      console.log(error)
      showErrorToast(formatContractError(error.message))
      setCreating(false)
    }
  }

  if (showLoading) {
    return (
      <div className={styles.remainderContainer}>
        <LoadingSpinner className={styles.loadingForm} />
      </div>
    )
  }

  if ((!user || !config.admins.find(item => item.toLowerCase() === user.etherAddress.toLowerCase())) && !showLoading) {
    return <div className={styles.remainderContainer}>You are not allowed to use this form</div>
  }

  return (
    <div className={styles.createPoolContainer}>
      <form className={styles.formContainer} onSubmit={handleSubmit(handleCreatePool)}>
        <div>
          <p>Project</p>
          <select className={styles.selection} {...register('projectSlug')}>
            {projects.map((project: any) => (
              <option value={`${project.slug}`} key={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Chain Name</p>
          <input type='text' value={getChainName(netId) || 'Unsupported Network'} disabled={true} />
        </div>
        {!getSupportedChains().includes(String(netId)) && <p className={styles.errorMessage}>Current Not support this chain</p>}
        <div>
          <p>Auction Type:</p>
          <select className={styles.selection} {...register('auctionType')}>
            <option value='FIX'>Fixed Price</option>
            <option value='DUTCH'>Dutch Auction</option>
            <option value='ENGLISH'>English Auction</option>
          </select>
        </div>
        <div>
          <p>Release Type:</p>
          <select className={styles.selection} {...register('releaseType')}>
            {watch('auctionType') !== 'DUTCH' && <option value={0}>Instant</option>}
            <option value={1}>Cliff</option>
            <option value={2}>Linear</option>
          </select>
        </div>

        <div>
          <p>Enable Whitelist</p>
          <select className={styles.selection} {...register('whitelistOn')}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div>
          <p>name</p>
          <input type='text' {...register('name')} />
        </div>

        <div>
          <p>token0 Address</p>
          <input type='text' {...register('token0Addr')} />
        </div>
        {!ethers.utils.isAddress(formValues.token0Addr) && <p className={styles.errorMessage}>Not a valid address</p>}
        <div>
          <p>token1 Address</p>
          <input type='text' {...register('etherAddr')} />
        </div>
        {!ethers.utils.isAddress(formValues.etherAddr) && <p className={styles.errorMessage}>Not a valid address</p>}

        <div>
          <p>total token0 amount</p>
          <input type='text' {...register('token0Amount')} />
        </div>

        {formValues.auctionType === 'FIX' ? (
          <div>
            <p>total token1 amount</p>
            <input type='text' {...register('token1Amount')} />
          </div>
        ) : (
          <>
            <div>
              <p>{formValues.auctionType === 'ENGLISH' ? 'amount start1' : 'amount min1'}</p>
              <input type='text' {...register('amountStartOrMin1')} />
              {formValues.auctionType !== 'FIX' && formValues.token0Amount && formValues.amountStartOrMin1 && (
                <p>
                  {formValues.auctionType === 'ENGLISH' ? 'The initial price will be' : 'The end price will be'}{' '}
                  {new BN(Number(formValues.amountStartOrMin1 / formValues.token0Amount)).toFixed()}, which means 1{swapToken?.token1?.symbol} =
                  {new BN(Number(formValues.token0Amount / formValues.amountStartOrMin1)).toFixed()} {swapToken?.token0?.symbol}
                </p>
              )}
            </div>
            <div>
              <p>{formValues.auctionType === 'ENGLISH' ? 'amount end1' : 'amount max1'}</p>
              <input type='text' {...register('amountEndOrMax1')} />
              {formValues.auctionType !== 'FIX' && formValues.token0Amount && formValues.amountEndOrMax1 && (
                <p>
                  {formValues.auctionType === 'ENGLISH' ? 'The end price can be' : 'The initial price will be'}{' '}
                  {new BN(Number(formValues.amountEndOrMax1 / formValues.token0Amount)).toFixed()}, which means 1{swapToken?.token1?.symbol} ={' '}
                  {new BN(Number(formValues.token0Amount / formValues.amountEndOrMax1)).toFixed()}
                  {swapToken?.token0?.symbol}
                </p>
              )}
            </div>
          </>
        )}

        {formValues.auctionType !== 'FIX' && (
          <div>
            <p>{formValues.auctionType === 'ENGLISH' ? 'fragments' : 'times'}</p>
            <input type='text' {...register('fragmentsOrTimes')} />
          </div>
        )}

        <div>
          <p>start at</p>
          <Controller
            control={control}
            name='startAt'
            render={({ field }) => <DateTimePicker onChange={date => field.onChange(date)} value={field.value} className={styles.picker} />}
          />
        </div>
        {isNowAfterTimestamp(String(moment(formValues.startAt).unix())) && <p className={styles.errorMessage}>Start at time should later than current time</p>}

        <div>
          <p>close at</p>
          <Controller
            control={control}
            name='endAt'
            render={({ field }) => <DateTimePicker onChange={date => field.onChange(date)} value={field.value} className={styles.picker} />}
          />
        </div>
        {!isTimestamp1AfterTimestamp2(String(moment(formValues.endAt).unix()), String(moment(formValues.startAt).unix())) && (
          <p className={styles.errorMessage}>close at time should later than start time</p>
        )}

        {watch('releaseType') !== '0' && (
          <>
            <div>
              <p>claim start at</p>
              <Controller
                control={control}
                name='claimStartAt'
                render={({ field }) => <DateTimePicker onChange={date => field.onChange(date)} value={field.value} className={styles.picker} />}
              />
            </div>
            {!isTimestamp1AfterTimestamp2(String(moment(formValues.claimStartAt).unix()), String(moment(formValues.endAt).unix())) && (
              <p className={styles.errorMessage}>claim start at time should later than pool end time</p>
            )}
          </>
        )}

        {watch('releaseType') === '2' && (
          <>
            <div>
              <p>claim close at</p>
              <Controller
                control={control}
                name='claimEndAt'
                render={({ field }) => <DateTimePicker onChange={date => field.onChange(date)} value={field.value} className={styles.picker} />}
              />
            </div>
            {!isTimestamp1AfterTimestamp2(String(moment(formValues.claimEndAt).unix()), String(moment(formValues.claimStartAt).unix())) && (
              <p className={styles.errorMessage}>claim end at time should later than claim start at time</p>
            )}
          </>
        )}
        <div>
          <p>{formValues.auctionType === 'DUTCH' ? 'max amount0 per wallet' : 'max amount1 per wallet'}</p>
          <input type='text' {...register('maxAmount1PerWallet')} />
        </div>

        <div>
          <p>auction holder on:</p>
          <select className={styles.selection} {...register('auctionHolderOn')}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        {formValues.auctionType === 'FIX' && (
          <div>
            <div>
              <p>reverse on:</p>
              <select className={styles.selection} {...register('reverseOn')}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
          </div>
        )}

        {!isAmountApproved && ethers.utils.isAddress(formValues.token0Addr) ? (
          <SwapProvider>
            <ApproveButton
              className={styles.approve}
              token1Address={formValues.token0Addr as HexData}
              swapAddress={getContractAddress(formValues.auctionType as PoolType, netId)}
            />
          </SwapProvider>
        ) : (
          <button className={styles.createBtn} type='submit' disabled={creating || !isAmountApproved}>
            {creating ? <LoadingSpinner className={styles.loading} /> : `Create`}
          </button>
        )}
      </form>
    </div>
  )
}

export default PoolCreationForm
