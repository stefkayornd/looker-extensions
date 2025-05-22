import React, { useEffect, useState } from 'react'
import { ComponentsProvider, Heading, Grid, Box, Card, Button } from '@looker/components'
import { useLookerSDK } from './sdk/useLookerSDK';
import { ILook } from '@looker/sdk';

const App = () => {
  const sdk = useLookerSDK();
  const [looks, setLooks] = useState<ILook[]>([]);

  useEffect(() => {
    const fetchLooks = async () => {
      // @ts-expect-error: Type mismatch between mock and real SDK
      const sdkResp = await (sdk.ok ? sdk.ok(sdk.all_looks('id,title,description, model')) : sdk.all_looks());
      const result = Array.isArray(sdkResp)
        ? sdkResp
        : (sdkResp && typeof sdkResp === 'object' && 'value' in sdkResp ? (sdkResp as { value: ILook[] }).value : []);
      setLooks(result);
    };
    fetchLooks();
  }, [sdk])

  const addToDashboard = (look: ILook) => {
    console.log(look);
  }

  return (
    <ComponentsProvider>
      <Box p="u12">
        <Heading>Dashboard Builder</Heading>
        <Grid gap='large'>
{looks.map(look => (
        <Card key={look.id} p="u4" border="#ff0000" raised>
          <Heading fontSize="small">{look.title}</Heading>
          <Button onClick={() => addToDashboard(look)}>Add</Button>
        </Card>
      ))}
        </Grid>
      </Box>
    </ComponentsProvider>
  )
}

export default App
