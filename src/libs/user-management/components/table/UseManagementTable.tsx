import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  debounce
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { checkAccess } from 'src/utils/checkAccess'
import UserManagementDialogAdd from '../dialog/UserManagementDialogAdd'
import UserManagementDialogEdit from '../dialog/UserManagementDIalogEdit'

export default function UserManagementTable() {
  //   const dispatch = useDispatch()

  //   const { refresher } = useSelector((state: any) => state.adminUserSetting)

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<any>('')

  const [userLevels, setUserLevels] = useState<any>(null)
  const [level, setLevel] = useState<any>(null)
  const [lokasi, setLokasi] = useState<any>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [itemSelected, setItemSelected] = useState<any>(null)

  const columns = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 50,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nama',
      headerName: 'Nama User',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.fullName ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'email',
      headerName: 'Email',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.email ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'status',
      headerName: 'Status',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <span>
            <Chip
              label={params?.row?.status ?? '-'}
              color='primary'
              size='small'
              sx={{
                backgroundColor: params?.row?.status === 'Aktif' ? '#4CAF5022' : '#6D788D22',
                color: params?.row?.status === 'Aktif' ? '#4CAF50' : '#6D788D'
              }}
            />
          </span>
        )
      }
    },
    {
      flex: 0.25,
      field: 'level',
      headerName: 'Level',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.level?.name ?? '-'}</span>
      }
    },

    //     {
    //       flex: 0.25,
    //       field: 'lastLogin',
    //       headerName: 'Terakhir Login',
    //       minWidth: 160,
    //       sortable: false,
    //       renderCell: (params: any) => {
    //         return <span>{moment(params?.row?.level?.updateAt).format('YYYY-MM-DD HH:mm')}</span>
    //       }
    //     },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: 2
            }}
          >
            {checkAccess('USER_SETTING', 'UPDATE') && (
              <IconButton
                id={params?.row?.id}
                onClick={() => {
                  setItemSelected(params.row)
                  setIsEditDialogOpen(true)
                }}
              >
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            )}
            {checkAccess('USER_SETTING', 'DELETE') && (
              <IconButton onClick={() => handleDelete(params?.row?.id)} id={params?.row?.id}>
                <Icon icon='mdi:trash' />
              </IconButton>
            )}
          </div>
        )
      }
    }
  ]

  //   const handleGetAll = async (isPagination = false) => {
  //     setIsLoading(true)

  //     const body = {
  //       params: {
  //         page: isPagination ? page : 1,
  //         rows: pageSize,
  //         searchFilters: {
  //           name: search
  //         },
  //         filters: {
  //           'level.id': level?.id
  //         }
  //       }
  //     } as any

  //     if (!search) {
  //       delete body.params.searchFilters['name']
  //     }

  //     if (!level) {
  //       delete body.params.filters['level.id']
  //     }

  //     body.params.searchFilters = JSON.stringify(body.params.searchFilters)
  //     body.params.filters = JSON.stringify(body.params.filters)

  //     // @ts-ignore
  //     await dispatch(getAllAdminUserSetting({ data: body })).then((res: any) => {
  //       if (
  //         !(res?.payload?.content?.entries ?? []).some((obj: any) =>
  //           (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
  //         ) &&
  //         isPagination
  //       ) {
  //         const _entries = [...(data?.entries ?? []), ...(res?.payload?.content?.entries ?? [])]
  //         setData(Object.assign({}, res?.payload?.content, { entries: _entries }))
  //       } else {
  //         if (!res?.payload?.content?.entries?.length && res?.payload?.content?.totalPage === 1) {
  //           setData(null)
  //         } else if (!isPagination) {
  //           setData(res?.payload?.content)
  //         }
  //       }
  //     })

  //     setIsLoading(false)
  //   }

  //   const handleGetAllUserLevel = async () => {
  //     setIsLoading(true)

  //     const body: any = {
  //       params: {
  //         page: 1,
  //         rows: 1000
  //       }
  //     }

  //     // @ts-ignore
  //     await dispatch(getAllUserLevel({ data: body })).then((res: any) => {
  //       if (res?.meta?.requestStatus !== 'fulfilled') {
  //         toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
  //         setIsLoading(false)
  //         setUserLevels(null)

  //         return
  //       }

  //       setIsLoading(false)
  //       setUserLevels(res?.payload?.content?.entries)
  //     })
  //   }

  const handleDelete = async (id: any) => {
    setIsLoading(true)
    toast.loading('Loading...')

    const body = {
      params: {
        ids: JSON.stringify([id])
      }
    }

    // @ts-ignore
    await dispatch(deleteAdminUserSetting({ data: body })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
        setIsLoading(false)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)
      setIsLoading(false)

      //  dispatch(setRefresher())
    })
  }

  const handleSearch = useCallback(
    debounce((query: any) => {
      setSearch(query)
    }, 300),
    []
  )

  //   useEffect(() => {
  //     setPage(1)

  //     handleGetAll(false)
  //   }, [refresher, search, level])

  //   useEffect(() => {
  //     if (page !== 1) {
  //       handleGetAll(true)
  //     }
  //   }, [page, pageSize])

  //   useEffect(() => {
  //     handleGetAllUserLevel()
  //   }, [])

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 500 }}>
                Pengaturan User
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
          title={
            <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
              <TextField
                size='small'
                placeholder='Cari Nama'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ maxWidth: 200 }}
              />

              <Autocomplete
                size='small'
                options={[]}
                getOptionLabel={(option: any) => option.label}
                onChange={(e, v) => setLokasi(v)}
                renderInput={params => <TextField {...params} label='Status' />}
                sx={{ minWidth: 200 }}
              />

              <Autocomplete
                size='small'
                options={userLevels ?? []}
                getOptionLabel={option => option.name}
                onChange={(e, v) => setLevel(v)}
                value={level ?? null}
                renderInput={params => <TextField {...params} label='Jabatan' />}
                sx={{ minWidth: 200 }}
              />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {checkAccess('USER_SETTING', 'CREATE') && (
                <Button variant='contained' color='primary' sx={{ mb: 2 }} onClick={() => setIsAddDialogOpen(true)}>
                  Tambah User
                </Button>
              )}
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
            rows={data?.entries ?? []}
            columns={columns}
            pagination
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            rowCount={data?.totalData ?? 0}
            paginationModel={{
              page: page - 1,
              pageSize: pageSize
            }}
            onPaginationModelChange={(newModel: any) => {
              setPage(newModel.page + 1)
              setPageSize(newModel.pageSize)
            }}
            loading={isLoading}
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

      <UserManagementDialogAdd open={isAddDialogOpen} onClose={(v: boolean) => setIsAddDialogOpen(v)} />
      <UserManagementDialogEdit
        open={isEditDialogOpen}
        onClose={(v: boolean) => setIsEditDialogOpen(v)}
        values={itemSelected}
      />
    </>
  )
}
