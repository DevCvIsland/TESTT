import React from 'react'
import { Card, CardBody, Heading, Text } from '@koninex/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getKoninexAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import { useFarms, usePriceKoninexBusd } from '../../../state/hooks'

const StyledKoninexStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const KoninexStats = () => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getKoninexAddress())
  const farms = useFarms()
  const koninexPrice = usePriceKoninexBusd()
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0)
  const koninexSupply = getBalanceNumber(circSupply)
  const marketCap = koninexPrice.times(circSupply)

  let koninexPerBlock = 0
  if (farms && farms[0] && farms[0].koninexPerBlock) {
    koninexPerBlock = new BigNumber(farms[0].koninexPerBlock).div(new BigNumber(10).pow(18)).toNumber()
  }

  return (
    <StyledKoninexStats>
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(534, 'Koninex Stats')}
        </Heading>
        <Row>
          <Text fontSize="14px">{TranslateString(10005, 'Market Cap')}</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(marketCap)} decimals={0} prefix="$" />
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(536, 'Total Minted')}</Text>
          {totalSupply && <CardValue fontSize="14px" value={getBalanceNumber(totalSupply)} decimals={0} />}
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(538, 'Total Burned')}</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} decimals={0} />
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(10004, 'Circulating Supply')}</Text>
          {koninexSupply && <CardValue fontSize="14px" value={koninexSupply} decimals={0} />}
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(540, 'New KNX/block')}</Text>
          <Text bold fontSize="14px">
            {koninexPerBlock}
          </Text>
        </Row>
      </CardBody>
    </StyledKoninexStats>
  )
}

export default KoninexStats
