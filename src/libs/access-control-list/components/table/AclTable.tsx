import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import { useRouter } from 'next/router'
import { checkAccess } from 'src/utils/checkAccess'
import { getAllUserLevels } from 'src/stores/acl/aclAction'

export default function AclTable() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { refresher } = useSelector((state: any) => state.acl)

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<any>('')

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
      headerName: 'Level Akses',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.name ?? '-'}</span>
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
            {(checkAccess('USER_LEVEL', 'UPDATE') || checkAccess('ACL', 'UPDATE')) && (
              <IconButton
                id={params?.row?.id}
                onClick={() => router.push(`/access-control-list/${params?.row?.id}/edit`)}
              >
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            )}
            {(checkAccess('USER_LEVEL', 'DELETE') || checkAccess('ACL', 'DELETE')) && (
              <IconButton onClick={() => handleDelete(params?.row?.id)} id={params?.row?.id}>
                <Icon icon='mdi:trash' />
              </IconButton>
            )}
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
      delete body.params.searchFilters['name']
    }

    body.params.searchFilters = JSON.stringify(body.params.searchFilters)

    // @ts-ignore
    await dispatch(getAllUserLevels({ data: body })).then((res: any) => {
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

  const handleDelete = async (id: any) => {
    setIsLoading(true)
    toast.loading('Loading...')

    const body = {
      params: {
        ids: JSON.stringify([id])
      }
    }

    setIsLoading(false)
    toast.dismiss()
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
                Access Control List
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
                placeholder='Cari Nama Level Aksesx'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ maxWidth: 200 }}
              />
            </Box>
          }
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' },
            borderBottom: '1px solid #f4f4f4'
          }}

          // action={
          //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          //     {(checkAccess('USER_LEVEL', 'CREATE') || checkAccess('ACL', 'CREATE')) && (
          //       <Button
          //         variant='contained'
          //         color='primary'
          //         sx={{ mb: 2 }}
          //         onClick={() => router.push('/access-control-list/create')}
          //       >
          //         Tambah Akses
          //       </Button>
          //     )}
          //   </Box>
          // }
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
    </>
  )
}
