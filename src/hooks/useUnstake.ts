import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from 'state/actions'
import { unstake, koninexUnstake, koninexEmegencyUnstake } from 'utils/callHelpers'
import { useMasterchef, useKoninexChef } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

const ARENAIDS = []

export const useKoninexUnstake = (arenaId) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  const koninexChefContract = useKoninexChef(arenaId)
  const isOldArena = ARENAIDS.includes(arenaId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (arenaId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.info(txHash)
      } else if (isOldArena) {
        const txHash = await koninexEmegencyUnstake(koninexChefContract, amount, account)
        console.info(txHash)
      } else {
        const txHash = await koninexUnstake(koninexChefContract, amount, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(arenaId, account))
      dispatch(updateUserBalance(arenaId, account))
      dispatch(updateUserPendingReward(arenaId, account))
    },
    [account, dispatch, isOldArena, masterChefContract, koninexChefContract, arenaId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
