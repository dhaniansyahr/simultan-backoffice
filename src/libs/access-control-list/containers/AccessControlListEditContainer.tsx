import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { createAcl, getAllFeauture, getFeatureByUserLevel } from 'src/stores/acl/aclAction'

const AccessControlListEditContainer = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { id } = router.query

  const [body, setBody] = useState<any>({ userLevelId: '', acl: [] })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [features, setFeatures] = useState<any>(null)

  const columns = [
    {
      flex: 0.25,
      field: 'no',
      headerName: '',
      maxWidth: 50,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nama',
      headerName: 'List Feature',
      maxWidth: 360,
      renderCell: (params: any) => {
        return <span>{params?.row?.name.replaceAll('_', ' ') ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 160,
      renderCell: (params: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: 2
            }}
          >
            {params?.row?.action?.map((item: any, index: number) => {
              const featureName = params.row.name
              const isChecked =
                body?.acl &&
                Array.isArray(body?.acl) &&
                body?.acl.some((aclItem: any) => aclItem.feature === featureName && aclItem.actions.includes(item.name))

              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox checked={isChecked} onChange={() => handleAclChange(featureName, item.name)} />}
                  label={item.name}
                />
              )
            })}
          </div>
        )
      }
    }
  ]

  const handleAclChange = (featureName: string, actionName: string) => {
    // Ensure body.acl is an array, defaulting to an empty array if it's not
    const acl = Array.isArray(body.acl) ? [...body.acl] : []

    const featureIndex = acl.findIndex(f => f.feature === featureName)

    if (featureIndex === -1) {
      acl.push({
        feature: featureName,
        actions: [actionName]
      })
    } else {
      const feature = acl[featureIndex]
      const actionIndex = feature.actions.indexOf(actionName)

      if (actionIndex === -1) {
        feature.actions.push(actionName)
      } else {
        feature.actions.splice(actionIndex, 1)
      }

      if (feature.actions.length === 0) {
        acl.splice(featureIndex, 1)
      }
    }

    setBody({ ...body, acl })
  }
  const handleGetAllFeatures = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getAllFeauture({ data: {} })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
        setIsLoading(false)
        setFeatures(null)

        return
      }

      setIsLoading(false)
      setFeatures(res?.payload?.content)
    })
  }

  const handleGetDetail = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getFeatureByUserLevel({ id })).then((res: any) => {
      setIsLoading(false)
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        setBody({ userLevelId: '', acl: [] })

        return
      }

      setBody({
        userLevelId: id,
        acl: res?.payload?.content || []
      })
    })
  }

  const handleCreate = async () => {
    setIsLoading(true)
    toast.loading('Loading...')

    const filteredAcl = body?.acl?.filter((item: any) => item.actions && item.actions.length > 0)

    const mappedBody: any = {
      userLevelId: body.userLevelId,
      acl: filteredAcl?.map((item: any) => ({
        featureName: item.feature,
        actions: item.actions
      }))
    }

    // @ts-ignore
    await dispatch(createAcl({ data: mappedBody })).then((res: any) => {
      setIsLoading(false)
      toast.dismiss()
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        return
      }

      toast.success(res?.payload?.message)
      router.back()
    })
  }

  useEffect(() => {
    handleGetAllFeatures()
    handleGetDetail()
  }, [id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display={'flex'} gap={2} alignItems={'center'}>
                <IconButton onClick={() => router.back()}>
                  <Icon icon='ic:baseline-arrow-back' />
                </IconButton>

                <Typography variant='h6' sx={{ fontWeight: 500 }}>
                  Edit Akses
                </Typography>
              </Box>
            }
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'start', md: 'center' },
              borderBottom: '1px solid #f4f4f4'
            }}
          />

          <CardHeader
            action={
              <Box display={'flex'} gap={2} alignItems={'center'}>
                <Button variant='contained' color='secondary'>
                  Batal
                </Button>
                <Button variant='contained' color='primary' onClick={handleCreate}>
                  Simpan
                </Button>
              </Box>
            }
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'start', md: 'center' },
              borderBottom: '1px solid #f4f4f4'
            }}
          />

          <CardHeader
            title={
              <Box display={'flex'} gap={2} alignItems={'center'}>
                {/* <Autocomplete
                  size='small'
                  options={level ?? []}
                  getOptionLabel={option => option.name}
                  onChange={(e, v) => setBody({ ...body, userLevelId: v?.id })}
                  value={level?.find((option: any) => option.id === body?.userLevelId) ?? null}
                  renderInput={params => (
                    <TextField {...params} label='Level Role' placeholder='Nama Level Role User' />
                  )}
                  sx={{ minWidth: 200 }}
                /> */}
              </Box>
            }
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'start', md: 'center' },
              borderBottom: '1px solid #f4f4f4'
            }}
          />

          <CardContent style={{ paddingInline: '10px' }}>
            <DataGrid
              autoHeight
              rows={features ?? []}
              columns={columns}
              pagination
              rowCount={features?.length ?? 0}
              loading={isLoading}
              hideFooter
              slots={{
                loadingOverlay: CircularProgress
              }}
              sx={{
                [`& .${gridClasses.cell}`]: {
                  py: 1
                }
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AccessControlListEditContainer
