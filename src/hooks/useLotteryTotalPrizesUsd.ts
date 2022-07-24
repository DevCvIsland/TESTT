import { usePriceKoninexBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from './useTickets'

const useLotteryTotalPrizesUsd = () => {
  const totalRewards = useTotalRewards()
  const totalKoninex = getBalanceNumber(totalRewards)
  const koninexPriceBusd = usePriceKoninexBusd()

  return totalKoninex * koninexPriceBusd.toNumber()
}

export default useLotteryTotalPrizesUsd
