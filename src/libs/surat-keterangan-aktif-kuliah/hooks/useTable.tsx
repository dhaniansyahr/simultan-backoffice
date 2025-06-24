import { Icon } from '@iconify/react'
import { Box, Chip, IconButton, Tooltip } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Can from 'src/components/acl/Can'
import {
  getAllCollegeCertificate,
  getAllCollegeCertificateHistory,
  printCollegeCertificate
} from 'src/stores/college-certificate/collegeCertificateAction'
import { formatString, getStatus } from 'src/utils'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'



export const useTable = (type: string) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { refresher } = useAppSelector(state => state.collegeCertificate)

  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'pengajuanOleh',
      headerName: 'Nama',
      minWidth: 260,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <span>
            {params?.row?.user?.nama ?? '-'} - {params?.row?.user?.npm ?? '-'}
          </span>
        )
      }
    },
    {
      flex: 0.25,
      field: 'tanggalPengajuan',
      headerName: 'Tanggal Pengajuan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{moment(params?.row?.createdAt).format('DD MMMM YYYY HH:mm')}</span>
      }
    },

          {
            flex: 0.25,
            field: 'nomorSurat',
            headerName: 'Nomor Surat',
            minWidth: 200,
            sortable: false,
            renderCell: (params: any) => {
              // return getAllHistory
              return (
                <span>
                  {params?.row?.nomorSurat ?? '-'} - {params?.row?.tanggalSurat ? moment(params?.row?.tanggalSurat).format('DD MMMM YYYY') : '-'}
                </span>
              )
            }
          },
        
    {
      flex: 0.25,
      field: 'status',
      headerName: 'Status',
      minWidth: 260,
      sortable: false,
      renderCell: (params: any) => {
        const status = getStatus(params?.row?.verifikasiStatus ?? '-')

        return (
          <span>
            <Chip
              label={formatString(params?.row?.verifikasiStatus ?? '-')}
              sx={{
                backgroundColor: status.color + '22',
                color: status.color
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
      minWidth: type === 'HISTORY' ? 200 : 160,
      sortable: false,
      renderCell: (params: any) => {
        const status = getStatus(params?.row?.verifikasiStatus ?? '-')

        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Can I='VIEW' a='SURAT_KETERANGAN_KULIAH'>
              <Tooltip title='Lihat detail pengajuan'>
                <IconButton
                  onClick={() => router.push(`/surat-keterangan-aktif-kuliah/detail/${params?.row?.ulid}`)}
                  size='small'
                >
                  <Icon icon='ph:eye' color='primary' />
                </IconButton>
              </Tooltip>
            </Can>

            <Can I='UPDATE' a='SURAT_KETERANGAN_KULIAH'>
              <Tooltip title='Edit/Perubahan Pengajuan'>
                <IconButton
                  onClick={() => router.push(`/surat-keterangan-aktif-kuliah/edit/${params?.row?.ulid}`)}
                  disabled={status.text !== 'DITOLAK'}
                  size='small'
                >
                  <Icon icon='mdi:pencil-outline' color='primary' />
                </IconButton>
              </Tooltip>
            </Can>

            <Can I='EXPORT' a='SURAT_KETERANGAN_KULIAH'>
              <Tooltip title='Download/Unduh'>
                <IconButton
                  onClick={() => handleDownloadSurat(params?.row?.ulid)}
                  disabled={status.text !== 'DISETUJUI'}
                  size='small'
                >
                  <Icon icon='ic:baseline-print' color='primary' />
                </IconButton>
              </Tooltip>
            </Can>

             <Box sx={{ display: 'flex', gap: 1 }}>
            <Can I='NOMOR_SURAT' a='SURAT_KETERANGAN_KULIAH'>
              <Tooltip title='Edit Nomor Surat'>
                <IconButton
                    onClick={() => router.push(`/surat-keterangan-aktif-kuliah/${params?.row?.ulid}nomor-surat`)}
                    disabled={status.text !== 'DISETUJUI'}
                    size='small'
                  >
                   <Icon icon='mdi:format-list-numbered' color='primary' />
                </IconButton>
              </Tooltip>
            </Can>

           
          </Box>
          </Box>
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

  const handleGetHistory = async (isPagination = false) => {
    setIsLoading(true)

    const body = {
      params: {
        page: isPagination ? page : 1,
        rows: pageSize,
        status: ['DISETUJUI', 'DITOLAK']
      }
    } as any

    // @ts-ignore
    await dispatch(getAllCollegeCertificateHistory({ data: body })).then((res: any) => {
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

  const handleDownloadSurat = async (id: string) => {
    toast.loading('Printing...')

    // @ts-ignore
    await dispatch(printCollegeCertificate({ id })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.message)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)
    })
  }

  useEffect(() => {
    setPage(1)

    if (type === 'HISTORY') {
      handleGetHistory(false)
    } else {
      handleGetAll(false)
    }
  }, [refresher, type])

  useEffect(() => {
    if (page !== 1) {
      if (type === 'HISTORY') {
        handleGetHistory(true)
      } else {
        handleGetAll(true)
      }
    }
  }, [page, pageSize, type])

  return {
    columns,
    data,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize
  }
}
