import React, { useState, useEffect } from 'react'

import { Box, Typography, Pagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

import LayoutDefaut from '../../components/Layouts/LayoutDefault'
import Container from '../../components/Layouts/Container'

import Title from './Title'
import CardSection from './CardSection'
import CardLoading from './CardLoading'

import getHttpRequest from '../../utils/getHttpRequest'

const fiatCurrency = [
  { label: 'Dólar', short: 'usd', symbol: '$' },
  { label: 'Real', short: 'brl', symbol: 'R$' },
  { label: 'Euro', short: 'eur', symbol: '€' },
  { label: 'Libra', short: 'gbp', symbol: '£' }
]

const Market = () => {
  const [dataIsInTheLoadingPhase, setDataIsInTheLoadingPhase] = useState(true)

  const [allCoins, setAllCoins] = useState([])
  const [page, setPage] = useState(1)
  const [currentFiatCurrencyLabel, setCurrentFiatCurrencyLabel] = useState('usd')
  const [currentFiatCurrencySymbol, setCurrentFiatCurrencySymbol] = useState('$')
  const [currentPageNumber, setCurrentPageNumber] = useState(0)
  const order = 'market_cap_desc'
  const sparkline = true

  const totalCoins = 150
  const amountOfCoinsPerPage = 15
  const numberOfPages = Math.ceil(totalCoins / amountOfCoinsPerPage)

  const getCurrentFiatCurrency = (labelCurrency) => {
    const currentFiatCurrency = fiatCurrency.find(item => item.short === labelCurrency)

    setCurrentFiatCurrencySymbol(currentFiatCurrency.symbol)
  }

  const handleChangeCurrency = event => {
    const value = event.target.value

    setCurrentFiatCurrencyLabel(value)
    getCurrentFiatCurrency(value)
  }

  const handleChangePaginationButton = (event, value) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    setPage(value)
    setCurrentPageNumber(value)
  }

  const url = `${process.env.REACT_APP_CRYPTO_API}/coins/markets`

  useEffect(() => {
    getHttpRequest(url, {
      vs_currency: currentFiatCurrencyLabel,
      order: order,
      per_page: amountOfCoinsPerPage,
      page: currentPageNumber,
      sparkline: sparkline
    })
      .then(response => {
        setAllCoins(response.data)
        setDataIsInTheLoadingPhase(false)
      })
      .catch(error => console.error(error))
  }, [url, currentFiatCurrencyLabel, order, amountOfCoinsPerPage, currentPageNumber, sparkline])

  return (
    <LayoutDefaut>
      <Container>
        <Title />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingInline: 5, marginBottom: 3 }}>
          <FormControl sx={{ maxWidth: '150px', width: '100%' }}>
            <InputLabel>Selecionar moeda</InputLabel>
            <Select
              label="Selecionar moeda"
              value={currentFiatCurrencyLabel}
              onChange={handleChangeCurrency}
            >
              {fiatCurrency.map((currency, i) => (
                <MenuItem
                  key={i}
                  value={currency.short}
                >
                  <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
                    {currency.label} - {currency.short.toLocaleUpperCase()} ({currency.symbol})
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          component="section"
          sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}
        >
          {!dataIsInTheLoadingPhase && (
            <>
              {allCoins.map((item, i) => (
                <CardSection
                  key={i}
                  name={item.name}
                  symbol={item.symbol}
                  image={item.image}
                  currentPrice={item.current_price}
                  fiatCurrency={currentFiatCurrencySymbol}
                />
              ))}

              <Box sx={{ marginTop: 3 }}>
                <Pagination
                  color="primary"
                  count={numberOfPages}
                  page={page}
                  onChange={handleChangePaginationButton}
                />
              </Box>
            </>
          )}

          <CardLoading
            amountOfCoinsPerPage={amountOfCoinsPerPage}
            dataIsInTheLoadingPhase={dataIsInTheLoadingPhase}
          />
        </Box>
      </Container>
    </LayoutDefaut>
  )
}

export default Market
