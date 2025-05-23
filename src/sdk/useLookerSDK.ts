import { useContext } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { mockSdk } from '../mocks/sdk'

export function useLookerSDK() {
  const context = useContext(ExtensionContext)
  const isLooker = window.location !== window.parent.location
  return isLooker && context ? context.core40SDK : mockSdk
}
