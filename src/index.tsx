// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DashboardBuilderExtension from './DashboardBuilderExtension'
import { ComponentsProvider } from '@looker/components'
// import ThemedAppWrapper  from './providers/ThemedAppWrapper'
import { ExtensionProvider } from '@looker/extension-sdk-react'

const theme = {
  // TODO we should map current theme from officernd/core-ui to the looker/components theme interface
  colors: {
    background: '#fff',
    text: '#000',
  },
}

const container = document.getElementById('root')
const isLooker = window.location !== window.parent.location

if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <StrictMode>
      <ComponentsProvider themeCustomizations={theme}>
        {isLooker ? (
          <ExtensionProvider>
            <DashboardBuilderExtension />
          </ExtensionProvider>
        ) : (
          <App />
        )}
      </ComponentsProvider>
    </StrictMode>
  )
}
