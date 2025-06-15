import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch } from 'react-redux'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { checkAccess } from 'src/utils/checkAccess'
import moment from 'moment'
import VerificationCollegeCertificateDialog from '../dialogs/VerificationDialog'
import { getAllTemporaryLeaveRequest } from 'src/stores/temporary-leave-request/temporaryLeaveRequestAction'
import { AppDispatch, RootState } from 'src/stores'
import { formatString, getStatus } from 'src/utils'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DialogDetail from '../dialogs/DialogDetail'

export default function TemporaryLeaveRequestTable() {
  const dispatch: AppDispatch = useDispatch()
  const router = useRouter()

  const { refresher } = useSelector((state: RootState) => state.temporaryLeaveRequest)

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [itemSelected, setItemSelected] = useState<any>(null)
  const [isDialogVerificationOpen, setIsDialogVerificationOpen] = useState<boolean>(false)
  const [isDialogDetailOpen, setIsDialogDetailOpen] = useState<boolean>(false)

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
      headerName: 'Daftar Pengajuan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>Diajukan Oleh {params?.row?.user?.nama ?? '-'}</span>
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
      field: 'reason',
      headerName: 'Alasan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.alasanPengajuan ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'status',
      headerName: 'Status',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        const status = getStatus(params?.row?.status?.[params?.row?.status.length - 1]?.nama ?? '-')

        return (
          <span>
            <Chip
              label={formatString(params?.row?.status?.[params?.row?.status.length - 1]?.nama ?? '-')}
              sx={{
                backgroundColor: theme =>
                  status === 'DIPROSES'
                    ? hexToRGBA(theme.palette.warning.main, 0.12)
                    : status === 'DISETUJUI'
                    ? hexToRGBA(theme.palette.success.main, 0.12)
                    : hexToRGBA(theme.palette.error.main, 0.12),
                color: theme =>
                  status === 'DIPROSES'
                    ? theme.palette.warning.main
                    : status === 'DISETUJUI'
                    ? theme.palette.success.main
                    : theme.palette.error.main
              }}
            />
          </span>
        )
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
            {checkAccess('CUTI_SEMENTARA', 'VIEW') && (
              <IconButton
                id={params?.row?.id}
                onClick={() => {
                  setItemSelected(params?.row)
                  setIsDialogDetailOpen(true)
                }}
              >
                <Icon icon='ph:eye' />
              </IconButton>
            )}

            {checkAccess('CUTI_SEMENTARA', 'VERIFICATION') && (
              <Button
                size='small'
                color='primary'
                variant='contained'
                onClick={() => {
                  setIsDialogVerificationOpen(true)
                  setItemSelected(params.row)
                }}
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
    await dispatch(getAllTemporaryLeaveRequest({ data: body })).then((res: any) => {
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
                Cuti Sementara
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {checkAccess('CUTI_SEMENTARA', 'CREATE') && (
                <Button
                  variant='contained'
                  color='primary'
                  sx={{ mb: 2 }}
                  startIcon={<Icon icon='ic:baseline-add' />}
                  onClick={() => router.push('/temporary-leave/create')}
                >
                  Buat Pengajuan
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
        values={itemSelected}
      />

      <DialogDetail
        open={isDialogDetailOpen}
        onClose={(v: boolean) => setIsDialogDetailOpen(v)}
        values={itemSelected}
      />
    </>
  )
}
