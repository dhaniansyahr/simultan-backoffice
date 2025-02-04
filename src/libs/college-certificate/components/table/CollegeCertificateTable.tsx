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
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { getAllCollegeCertificate } from 'src/stores/college-certificate/collegeCertificateAction'
import { checkAccess } from 'src/utils/checkAccess'
import moment from 'moment'
import VerificationCollegeCertificateDialog from '../dialogs/VerificationCollegeCertificateDialog'

export default function CollegeCertificateTable() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { refresher } = useSelector((state: any) => state.collegeCertificate)

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [itemSelected, setItemSelected] = useState<any>(null)
  const [isDialogVerificationOpen, setIsDialogVerificationOpen] = useState<boolean>(false)

  const columns = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 60,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'daftar pengajuan',
      headerName: 'Tipe Surat Pengajuan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.type ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'status',
      headerName: 'Status',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.status ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'tanggal Pengajuan',
      headerName: 'Tanggal Pengajuan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{moment(params?.row?.createdAt).format('DD MMMM YYYY HH:mm')}</span>
      }
    },
    {
      flex: 0.25,
      field: 'disetujui oleh',
      headerName: 'Disetujui Oleh',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.approvedBy?.fulname ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'menunggu persetujuan oleh',
      headerName: 'Menunggu Persetujuan Oleh',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.remainingApproved?.fullname ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'ditolak oleh',
      headerName: 'Ditolak Oleh',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.rejectedBy?.fullname ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 260,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: 2
            }}
          >
            {checkAccess('SURAT_KETERANGAN_KULIAH', 'UPDATE') && (
              <IconButton
                id={params?.row?.id}
                onClick={() => {
                  router.push('/college-certificate/edit')
                  setItemSelected(params.row)
                }}
              >
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            )}

            {checkAccess('SURAT_KETERANGAN_KULIAH', 'DELETE') && (
              <IconButton
                id={params?.row?.id}

                // onClick={() => {
                //   router.push('/college-certificate/edit')
                //   setItemSelected(params.row)
                // }}
              >
                <Icon icon='mdi:trash' />
              </IconButton>
            )}

            {checkAccess('SURAT_KETERANGAN_KULIAH', 'VERIFICATION') && (
              <Button
                size='small'
                color='primary'
                variant='contained'
                onClick={() => setIsDialogVerificationOpen(true)}
              >
                Verifikasi
              </Button>
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
        rows: pageSize
      }
    } as any

    // @ts-ignore
    await dispatch(getAllCollegeCertificate({ data: body })).then((res: any) => {
      if (
        !(res.payload.content?.entries ?? []).some((obj: any) =>
          (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
        ) &&
        isPagination
      ) {
        const _entries = [...(data?.entries ?? []), ...(res.payload.content?.entries ?? [])]
        setData(Object.assign({}, res.payload.content, { entries: _entries }))
      } else {
        if (!res.payload.content?.entries?.length && res.payload.content?.totalPage === 1) {
          setData(null)
        } else if (!isPagination) {
          setData(res.payload.content)
        }
      }
    })

    setIsLoading(false)
  }

  // const handleSearch = useCallback(
  //   debounce((query: any) => {
  //     setSearch(query)
  //   }, 300),
  //   []
  // )

  useEffect(() => {
    setPage(1)

    handleGetAll(false)
  }, [refresher])

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
                Surat Keterangan Kuliah
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
            <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 } }}>
              {/* <TextField
                size='small'
                placeholder='Cari Status'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ maxWidth: 200 }}
              /> */}
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {checkAccess('SURAT_KETERANGAN_KULIAH', 'CREATE') && (
                <Button
                  variant='contained'
                  color='primary'
                  sx={{ mb: 2 }}
                  onClick={() => router.push('/college-certificate/create')}
                >
                  Buat Surat Keterangan Kuliah
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
        <CardContent style={{ paddingInline: '0px' }}>
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

      <VerificationCollegeCertificateDialog
        open={isDialogVerificationOpen}
        onClose={(v: boolean) => setIsDialogVerificationOpen(v)}
      />
    </>
  )
}
