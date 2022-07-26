import React, { useContext } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useTheme from 'hooks/useTheme'
import { usePriceKoninexBusd } from 'state/hooks'
import { Menu as UikitMenu } from '@koninex/uikit'
import config from './config'

const Menu = (props) => {
  const { account, connect, reset } = useWallet()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const koninexPriceUsd = usePriceKoninexBusd()

  return (
    <UikitMenu
      account={account}
      login={connect}
      logout={reset}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      koninexPriceUsd={koninexPriceUsd.toNumber()}
      links={config}
      priceLink="https://info.cheeseswap.app/pair/0xB0361a92E2646F9F11f1670484f09D585fe4a419"
      {...props}
    />
  )
}

export default Menu
