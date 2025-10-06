import { Icon } from '@iconify/react'
import { Box, Chip, IconButton, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Can from 'src/components/acl/Can'
import {
  getAllSuratKeteranganLulusHistory,
  getAllSuratKeteranganLulus,
  printSuratKeteranganLulus
} from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusAction'
import { formatString, getStatus } from 'src/utils'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

export const useTable = (tab?: string) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { refresher } = useAppSelector(state => state.suratKeteranganLulus)

  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const columns = [
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
      minWidth: 150,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{moment(params?.row?.createdAt).format('DD/MM/YYYY')}</span>
      }
    },
    {
      flex: 0.25,
      field: 'tipeSurat',
      headerName: 'Tipe Surat',
      minWidth: 200,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{formatString(params?.row?.tipeSurat)}</span>
      }
    },
    {
      flex: 0.25,
      field: 'keperluan',
      headerName: 'Keperluan',
      minWidth: 200,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.keperluan ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nomorSurat',
      headerName: 'Nomor Surat',
      minWidth: 200,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nomorSurat ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'verifikasiStatus',
      headerName: 'Status',
      minWidth: 150,
      sortable: false,
      renderCell: (params: any) => {
        const { color, text } = getStatus(params?.row?.verifikasiStatus)

        return (
          <Chip
            size='small'
            variant='filled'
            label={text}
            sx={{
              backgroundColor: color + '22',
              color: color,
              '& .MuiChip-label': {
                textTransform: 'capitalize'
              }
            }}
          />
        )
      }
    },
    {
      flex: 0.25,
      field: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Can I='VIEW' a='SURAT_KETERANGAN_LULUS'>
              <Tooltip title='Detail'>
                <IconButton size='small' onClick={() => router.push(`/surat-keterangan-lulus/${params?.row?.ulid}`)}>
                  <Icon icon='tabler:eye' fontSize={20} />
                </IconButton>
              </Tooltip>
            </Can>

            <Can I='UPDATE' a='SURAT_KETERANGAN_LULUS'>
              <Tooltip title='Edit'>
                <IconButton
                  size='small'
                  onClick={() => router.push(`/surat-keterangan-lulus/edit/${params?.row?.ulid}`)}
                  disabled={getStatus(params?.row?.verifikasiStatus).text !== 'DITOLAK'}
                >
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
            </Can>
            <Can I='EXPORT' a='SURAT_KETERANGAN_KULIAH'>
              <Tooltip title='Download/Unduh'>
                <IconButton
                  onClick={() => handleDownloadSurat(params?.row?.ulid)}
                  disabled={getStatus(params?.row?.verifikasiStatus).text !== 'DISETUJUI'}
                  size='small'
                >
                  <Icon icon='ic:baseline-print' color='primary' />
                </IconButton>
              </Tooltip>
            </Can>
          </Box>
        )
      }
    }
  ]

  const handleDownloadSurat = async (id: string) => {
    toast.loading('Printing...')

    // @ts-ignore
    await dispatch(printSuratKeteranganLulus({ id })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.message)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)
    })
  }

  const handleGetAll = async (isPagination = false) => {
    setIsLoading(true)

    const params = {
      page: isPagination ? page : 1,
      rows: pageSize
    }

    // @ts-ignore
    await dispatch(getAllSuratKeteranganLulus(params)).then((res: any) => {
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

    const params = {
      page: isPagination ? page : 1,
      rows: pageSize,
      status: ['DISETUJUI', 'DITOLAK']
    }

    // @ts-ignore
    await dispatch(getAllSuratKeteranganLulusHistory(params)).then((res: any) => {
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
    if (tab === 'HISTORY') {
      handleGetHistory(false)
    } else {
      handleGetAll(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresher, tab])

  useEffect(() => {
    if (page !== 1) {
      if (tab === 'HISTORY') {
        handleGetHistory(true)
      } else {
        handleGetAll(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, tab])

  return {
    data,
    isLoading,
    page,
    pageSize,
    columns,
    setPage,
    setPageSize
  }
}
