import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { koninexhHarvest, koninexhHarvestBnb, harvest } from 'utils/callHelpers'
import { useMasterchef, useKoninexChef } from './useContract'

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract])

  return { onReward: handleHarvest }
}

export const useKoninexHarvest = (arenaId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const koninexChefContract = useKoninexChef(arenaId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    if (arenaId === 0) {
      await harvest(masterChefContract, 0, account)
    } else if (isUsingBnb) {
      await koninexhHarvestBnb(koninexChefContract, account)
    } else {
      await koninexhHarvest(koninexChefContract, account)
    }
    dispatch(updateUserPendingReward(arenaId, account))
    dispatch(updateUserBalance(arenaId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, koninexChefContract, arenaId])

  return { onReward: handleHarvest }
}
