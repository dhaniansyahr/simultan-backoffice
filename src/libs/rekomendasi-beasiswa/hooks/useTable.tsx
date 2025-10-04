import { Icon } from '@iconify/react'
import { Box, Chip, IconButton, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Can from 'src/components/acl/Can'
import {
  getAllRekomendasiBeasiswa,
  getAllRekomendasiBeasiswaHistory
} from 'src/stores/rekomendasi-beasiswa/rekomendasiBeasiswaAction'
import { formatString, getStatus } from 'src/utils'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

export const useTable = (tab?: string) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { refresher } = useAppSelector(state => state.rekomendasiBeasiswa)

  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Function to handle download surat
  const handleDownloadSurat = async (id: string) => {
    // @ts-ignore
    const { toast } = await import('react-hot-toast')
    toast.loading('Printing...')

    // Import the correct action for rekomendasi beasiswa
    const { printRekomendasiBeasiswa } = await import('src/stores/rekomendasi-beasiswa/rekomendasiBeasiswaAction')

    // @ts-ignore
    await dispatch(printRekomendasiBeasiswa({ id })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.message)
        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)
    })
  }

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
      field: 'tipeRekomendasi',
      headerName: 'Tipe Rekomendasi',
      minWidth: 200,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{formatString(params?.row?.tipeRekomendasi)}</span>
      }
    },
    {
      flex: 0.25,
      field: 'deskripsi',
      headerName: 'Deskripsi',
      minWidth: 200,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.deskripsi ?? '-'}</span>
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
            <Can I='VIEW' a='REKOMENDASI_BEASISWA'>
              <Tooltip title='Detail'>
                <IconButton size='small' onClick={() => router.push(`/rekomendasi-beasiswa/${params?.row?.ulid}`)}>
                  <Icon icon='tabler:eye' fontSize={20} />
                </IconButton>
              </Tooltip>
            </Can>

            <Can I='UPDATE' a='REKOMENDASI_BEASISWA'>
              <Tooltip title='Edit'>
                <IconButton
                  size='small'
                  onClick={() => router.push(`/rekomendasi-beasiswa/edit/${params?.row?.ulid}`)}
                  disabled={getStatus(params?.row?.verifikasiStatus).text !== 'DITOLAK'}
                >
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
            </Can>
            <Can I='EXPORT' a='REKOMENDASI_BEASISWA'>
              <Tooltip title='Cetak PDF'>
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

  const handleGetAll = async (isPagination = false) => {
    setIsLoading(true)

    const params = {
      page: isPagination ? page : 1,
      rows: pageSize
    }

    // @ts-ignore
    await dispatch(getAllRekomendasiBeasiswa(params)).then((res: any) => {
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
      rows: pageSize
    }

    // @ts-ignore
    await dispatch(getAllRekomendasiBeasiswaHistory(params)).then((res: any) => {
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
    setData(null) // Reset data when tab changes
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
  }, [page, pageSize])

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
