import { Icon } from '@iconify/react'
import {
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
import { checkAccess } from 'src/utils/checkAccess'
import UserManagementDialogAdd from '../dialog/UserManagementDialogAdd'
import UserManagementDialogEdit from '../dialog/UserManagementDIalogEdit'
import { getAllUsers } from 'src/stores/user/userAction'

export default function UserManagementTable() {
  const dispatch = useDispatch()

  const { refresher } = useSelector((state: any) => state.users)

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<any>('')

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
      field: 'level',
      headerName: 'Level AKSEs',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.UserLevel?.name ?? '-'}</span>
      }
    },
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
            <IconButton
              id={params?.row?.id}

              // onClick={() => {
              //   setItemSelected(params.row)
              //   setIsEditDialogOpen(true)
              // }}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>

            <IconButton

            // onClick={() => handleDelete(params?.row?.id)} id={params?.row?.id}
            >
              <Icon icon='mdi:trash' />
            </IconButton>
          </div>
        )
      }
    }
  ]

  const handleGetAll = async (isPagination = false) => {
    setIsLoading(true)

    const body = {
      params: {
        page: isPagination ? page : 1,
        rows: pageSize,
        searchFilters: {
          name: search
        }
      }
    } as any

    if (!search) {
      delete body.params.searchFilters
    }

    body.params.searchFilters = JSON.stringify(body.params.searchFilters)

    // @ts-ignore
    await dispatch(getAllUsers({ data: body })).then((res: any) => {
      if (
        !(res?.payload?.content?.entries ?? []).some((obj: any) =>
          (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
        ) &&
        isPagination
      ) {
        const _entries = [...(data?.entries ?? []), ...(res?.payload?.content?.entries ?? [])]
        setData(Object.assign({}, res?.payload?.content, { entries: _entries }))
      } else {
        if (!res?.payload?.content?.entries?.length && res?.payload?.content?.totalPage === 1) {
          setData(null)
        } else if (!isPagination) {
          setData(res?.payload?.content)
        }
      }
    })

    setIsLoading(false)
  }

  const handleSearch = useCallback(
    debounce((query: any) => {
      setSearch(query)
    }, 300),
    []
  )

  useEffect(() => {
    setPage(1)

    handleGetAll(false)
  }, [refresher, search])

  useEffect(() => {
    if (page !== 1) {
      handleGetAll(true)
    }
  }, [page, pageSize])

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
