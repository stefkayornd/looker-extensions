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

/**
  * This is a sample Looker Extension written in typescript and React. It imports one component, <HelloWorld>.
  * HelloWorld makes a simple call to the Looker API using the Extension Framework's built in authentication,
  * and returns the logged in user.
*/
import React from 'react'
import { ComponentsProvider } from '@looker/components'

const App = () => {
  return (
    <ComponentsProvider>
      <div style={{ padding: '2rem' }}>
        <h1>Hello from Looker Extension</h1>
        <p>This is your custom dashboard builder!</p>
      </div>
    </ComponentsProvider>
  )
}

export default App;
