import React, { useEffect, useState } from 'react'
import { map } from 'lodash'
import { ComponentsProvider, Heading, Grid, Box, Card, Button } from '@looker/components'
import { useLookerSDK } from './sdk/useLookerSDK'
import { ILook } from '@looker/sdk'
import { useToast } from './sdk/useToast'

const App = () => {
  const sdk = useLookerSDK()
  const [looks, setLooks] = useState<ILook[]>([])
  const [selectedLookIds, setSelectedLookIds] = useState<number[]>([])
  const toast = useToast()

  useEffect(() => {
    const fetchLooks = async () => {
      // @ts-expect-error: Type mismatch between mock and real SDK
      const sdkResp = await (sdk.ok
        ? sdk.ok(sdk.all_looks('id,title,description, model'))
        : sdk.all_looks())
      const result = Array.isArray(sdkResp)
        ? sdkResp
        : sdkResp && typeof sdkResp === 'object' && 'value' in sdkResp
          ? (sdkResp as { value: ILook[] }).value
          : []
      setLooks(result)
    }
    fetchLooks()
  }, [sdk])

  const addToDashboard = (look: ILook) => {
    console.log(look)
  }

  const toggleLook = (lookId: number) => {
    toast.success('Look added to dashboard!')
    setSelectedLookIds((prev) =>
      prev.includes(lookId) ? prev.filter((id) => id !== lookId) : [...prev, lookId]
    )
  }

  const renderLooksTable = () =>
    map(looks, (look: ILook) => (
      <Card key={look.id} p="u4" raised>
        <Heading fontSize="small">{look.title}</Heading>
        <Button onClick={() => toggleLook(Number(look.id))}>Add</Button>
      </Card>
    ))

  return (
    <ComponentsProvider>
      <Box p="u12">
        <Heading mb="u10">Dashboard Builder - Mocked view</Heading>

        <Grid gap="large" columns={4}>
          {renderLooksTable()}
        </Grid>
      </Box>
    </ComponentsProvider>
  )
}

export default App
