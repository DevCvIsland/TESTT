import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, koninexStake, koninexStakeBnb } from 'utils/callHelpers'
import { useMasterchef, useKoninexChef } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useKoninexStake = (arenaId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  const koninexChefContract = useKoninexChef(arenaId)

  const handleStake = useCallback(
    async (amount: string) => {
      if (arenaId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await koninexStakeBnb(koninexChefContract, amount, account)
      } else {
        await koninexStake(koninexChefContract, amount, account)
      }
      dispatch(updateUserStakedBalance(arenaId, account))
      dispatch(updateUserBalance(arenaId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, koninexChefContract, arenaId],
  )

  return { onStake: handleStake }
}

export default useStake
