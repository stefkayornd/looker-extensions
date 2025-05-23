import React from 'react'
import { ThemeProvider, createRndTheme } from '@officernd/core-ui'
import { APP_THEMES } from '../helpers/constants'

export default function ThemedAppWrapper({ children }: { children: React.ReactNode }) {
  const theme = 'Flex' // TODO should be dynamic

  const productTheme = createRndTheme(APP_THEMES[theme])
  return <ThemeProvider theme={productTheme}>{children}</ThemeProvider>
}
