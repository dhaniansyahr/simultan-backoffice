import { Icon } from '@iconify/react'
import { Chip, MenuItem, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Can from 'src/components/acl/Can'
import ActionTable from 'src/components/shared/action-table'
import {
  getAllCollegeCertificate,
  printCollegeCertificate
} from 'src/stores/college-certificate/collegeCertificateAction'
import { formatString, getStatus } from 'src/utils'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

export const useTable = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { refresher } = useAppSelector(state => state.collegeCertificate)

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [itemSelected, setItemSelected] = useState<any>(null)
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false)
  const [isInputNomorSuratOpen, setIsInputNomorSuratOpen] = useState<boolean>(false)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(menuAnchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

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
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        const status = getStatus(params?.row?.verifikasiStatus ?? '-')

        const splitStatus = params?.row?.verifikasiStatus?.split(' ')

        const verificationOrInputNomorSurat = () => {
          if (splitStatus?.includes('DIPROSES')) {
            setIsVerificationOpen(true)
            setItemSelected(params?.row)
          } else if (splitStatus?.includes('NOMOR')) {
            setIsInputNomorSuratOpen(true)
            setItemSelected(params?.row)
          }
        }

        return (
          <ActionTable isOpen={openMenu} onOpen={handleMenuOpen} onClose={handleMenuClose} anchorEl={menuAnchorEl}>
            <Can I='VIEW' a='SURAT_KETERANGAN_KULIAH'>
              <MenuItem
                sx={{ display: 'flex', gap: 2 }}
                onClick={() => {
                  setIsDetailOpen(true)
                  setItemSelected(params?.row)
                  handleMenuClose()
                }}
              >
                <Icon icon='ph:eye' />
                <Typography variant='body1'>Detail</Typography>
              </MenuItem>
            </Can>

            <Can I='UPDATE' a='SURAT_KETERANGAN_KULIAH'>
              <MenuItem
                sx={{ display: 'flex', gap: 2 }}
                onClick={() => router.push(`/surat-keterangan-aktif-kuliah/edit/${params?.row?.id}`)}
                disabled={status.text !== 'DITOLAK'}
              >
                <Icon icon='mdi:pencil-outline' />
                <Typography variant='body1'>Edit</Typography>
              </MenuItem>
            </Can>

            <Can I='VERIFICATION' a='SURAT_KETERANGAN_KULIAH'>
              <MenuItem
                sx={{ display: 'flex', gap: 2 }}
                onClick={() => {
                  verificationOrInputNomorSurat()
                  handleMenuClose()
                }}
              >
                <Icon icon={splitStatus?.includes('NOMOR') ? 'mdi:pencil-outline' : 'mdi:check-outline'} />
                <Typography variant='body1'>
                  {splitStatus?.includes('NOMOR') ? 'Input Nomor Surat' : 'Verifikasi'}
                </Typography>
              </MenuItem>
            </Can>

            <Can I='EXPORT' a='SURAT_KETERANGAN_KULIAH'>
              <MenuItem
                sx={{ display: 'flex', gap: 2 }}
                onClick={() => handleDownloadSurat(params?.row?.ulid)}
                disabled={status.text !== 'DISETUJUI'}
              >
                <Icon icon='mdi:file-pdf-box' />
                <Typography variant='body1'>Download Surat</Typography>
              </MenuItem>
            </Can>
          </ActionTable>
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

    handleGetAll(false)
  }, [refresher])

  useEffect(() => {
    if (page !== 1) {
      handleGetAll(true)
    }
  }, [page, pageSize])

  return {
    columns,
    data,
    isLoading,
    page,
    pageSize,
    itemSelected,
    isVerificationOpen,
    isInputNomorSuratOpen,
    isDetailOpen,
    setPage,
    setPageSize,
    setIsVerificationOpen,
    setIsInputNomorSuratOpen,
    setIsDetailOpen
  }
}
