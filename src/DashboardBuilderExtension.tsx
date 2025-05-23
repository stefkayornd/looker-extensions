import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  Fieldset,
  Grid,
  Heading,
  Spinner,
  SpaceVertical,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
  useToast,
} from '@looker/components'
import { ExtensionContext2 } from '@looker/extension-sdk-react'
import type {
  IDashboard,
  ILook,
  IDashboardElement,
  IDashboardCreate,
  IDashboardElementCreate,
} from '@looker/sdk'

/**
 * Main entry component for the Looker Extension.
 * Provides the following high‑level features:
 *  • "New Dashboard" button opens a builder dialog
 *  • Lists all user‑created dashboards with option to delete
 *  • Persists dashboards via Looker SDK calls
 */
const DashboardBuilderExtension: React.FC = () => {
  const { coreSDK: sdk, extensionSDK } = React.useContext(ExtensionContext2)
  const toast = useToast()

  /* ------------------------------------------------------------------
   * State management
   * ---------------------------------------------------------------- */
  const [looks, setLooks] = useState<ILook[]>([])
  const [dashboards, setDashboards] = useState<IDashboard[]>([])
  const [builderOpen, setBuilderOpen] = useState(false)
  const [selectedLookIds, setSelectedLookIds] = useState<number[]>([])
  const [newDashboardTitle, setNewDashboardTitle] = useState('')
  const [loading, setLoading] = useState(false)

  /* ------------------------------------------------------------------
   * Initial data fetch
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const looksResp = await sdk.ok(sdk.all_looks({ fields: 'id,title,space_id,user_id' }))
        const dashboardsResp = await sdk.ok(sdk.all_dashboards({ fields: 'id,title' }))
        setLooks(looksResp)
        setDashboards(dashboardsResp)
      } catch (err) {
        toast.error({ description: 'Failed to load data' })
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [sdk, toast])

  /* ------------------------------------------------------------------
   * Dashboard builder helpers
   * ---------------------------------------------------------------- */
  const toggleLook = (lookId: number) => {
    setSelectedLookIds((prev) =>
      prev.includes(lookId) ? prev.filter((id) => id !== lookId) : [...prev, lookId]
    )
  }

  const resetBuilder = () => {
    setSelectedLookIds([])
    setNewDashboardTitle('')
  }

  const openBuilder = () => {
    resetBuilder()
    setBuilderOpen(true)
  }

  const closeBuilder = () => {
    setBuilderOpen(false)
  }

  const handleSaveDashboard = async () => {
    if (!newDashboardTitle.trim()) {
      toast.error({ description: 'Please enter a dashboard title' })
      return
    }
    if (selectedLookIds.length === 0) {
      toast.error({ description: 'Select at least one Look' })
      return
    }

    try {
      setLoading(true)
      // 1) Create the dashboard shell
      const draft: IDashboardCreate = {
        title: newDashboardTitle,
        // Create in the user's personal space; adjust as needed
        space_id: (await sdk.ok(sdk.me())).personal_space_id,
      }
      const created = await sdk.ok(sdk.create_dashboard(draft))

      // 2) Add dashboard elements for each selected look
      const elementPromises: Promise<IDashboardElement>[] = selectedLookIds.map(async (lookId) => {
        const elem: IDashboardElementCreate = {
          dashboard_id: created.id,
          look_id: lookId,
          title: looks.find((l) => String(l.id) === String(lookId))?.title ?? 'Look',
        }
        return sdk.ok(sdk.create_dashboard_element(elem))
      })

      await Promise.all(elementPromises)

      toast.success({ description: `Dashboard “${created.title}” saved!` })
      // Refresh dashboard list
      const updated = await sdk.ok(sdk.all_dashboards({ fields: 'id,title' }))
      setDashboards(updated)
      closeBuilder()
    } catch (err) {
      toast.error({ description: 'Failed to save dashboard' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ------------------------------------------------------------------
   * Delete functionality
   * ---------------------------------------------------------------- */
  const handleDeleteDashboard = async (dashId: string) => {
    if (!window.confirm('Delete this dashboard permanently?')) return
    try {
      await sdk.ok(sdk.delete_dashboard(dashId))
      toast.success({ description: 'Dashboard deleted' })
      setDashboards((prev) => prev.filter((d) => d.id !== dashId))
    } catch (err) {
      toast.error({ description: 'Failed to delete dashboard' })
      console.error(err)
    }
  }

  /* ------------------------------------------------------------------
   * Render helpers
   * ---------------------------------------------------------------- */
  const renderLooksTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Select</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {looks.map((look) => (
          <TableRow key={look.id} onClick={() => toggleLook(Number(look.id))}>
            <TableCell>
              <input type="checkbox" checked={selectedLookIds.includes(Number(look.id))} readOnly />
            </TableCell>
            <TableCell>{look.title}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderSelectedPreview = () => (
    <Grid columns={2} gap="u3">
      {selectedLookIds.map((id) => (
        <Card key={id} height="150px">
          <CardContent>{looks.find((l) => Number(l.id) === id)?.title}</CardContent>
        </Card>
      ))}
    </Grid>
  )

  return (
    <Box p="u4">
      <Heading as="h2" fontSize="xlarge" mb="u3">
        Custom Dashboard Manager
      </Heading>

      <Button onClick={openBuilder} mb="u5">
        New Dashboard
      </Button>

      {loading && <Spinner />}

      {/**************** Existing Dashboards ****************/}
      <SpaceVertical>
        <Heading as="h3" fontSize="large">
          Your Dashboards
        </Heading>
        {dashboards.length === 0 && <p>No dashboards yet.</p>}
        {dashboards.map((dash) => (
          <Card key={dash.id} p="u3">
            <SpaceVertical>
              <Heading as="h4" fontSize="medium">
                {dash.title}
              </Heading>
              <Button size="small" onClick={() => handleDeleteDashboard(dash.id!)}>
                Delete
              </Button>
            </SpaceVertical>
          </Card>
        ))}
      </SpaceVertical>

      {/**************** Builder Dialog ****************/}
      {builderOpen && (
        <Dialog isOpen onClose={closeBuilder} width="80vw" height="80vh">
          <DialogHeader>
            <Heading as="h3">New Dashboard</Heading>
          </DialogHeader>
          <DialogContent>
            <Fieldset legend="Step 1: Choose Looks" gap="u2">
              {renderLooksTable()}
            </Fieldset>

            <Fieldset legend="Step 2: Preview" my="u4">
              {selectedLookIds.length === 0 ? (
                <p>Select looks to preview their placement.</p>
              ) : (
                renderSelectedPreview()
              )}
            </Fieldset>

            <Fieldset legend="Step 3: Save" gap="u3">
              <TextInput
                placeholder="Dashboard title"
                value={newDashboardTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewDashboardTitle(e.currentTarget.value)
                }
              />
              <Button onClick={handleSaveDashboard} disabled={loading}>
                Save Dashboard
              </Button>
            </Fieldset>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  )
}

export default DashboardBuilderExtension
