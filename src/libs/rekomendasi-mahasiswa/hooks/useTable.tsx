// import { Icon } from '@iconify/react'
// import { Box, Chip, IconButton, Tooltip } from '@mui/material'
// import { GridRenderCellParams } from '@mui/x-data-grid'
// import moment from 'moment'
// import { useRouter } from 'next/router'
// import { useEffect, useState } from 'react'
// import Can from 'src/components/acl/Can'
// import { getAllRekomendasiMahasiswa } from 'src/stores/rekomendasi-mahasiswa/rekomendasiMahasiswaAction'
// import { formatString, getStatus } from 'src/utils'
// import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

// export const useTable = () => {
//   const dispatch = useAppDispatch()
//   const router = useRouter()

//   const { refresher } = useAppSelector(state => state.rekomendasiMahasiswa)

//   const [data, setData] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [page, setPage] = useState<number>(1)
//   const [pageSize, setPageSize] = useState<number>(10)

//   const columns = [
//     {
//       flex: 0.25,
//       field: 'no',
//       headerName: 'No',
//       maxWidth: 60,
//       sortable: false,
//       renderCell: (params: GridRenderCellParams) => {
//         return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
//       }
//     },
//     {
//       flex: 0.25,
//       field: 'pengajuanOleh',
//       headerName: 'Nama',
//       minWidth: 260,
//       sortable: false,
//       renderCell: (params: any) => {
//         return (
//           <span>
//             {params?.row?.user?.nama ?? '-'} - {params?.row?.user?.npm ?? '-'}
//           </span>
//         )
//       }
//     },
//     {
//       flex: 0.25,
//       field: 'tanggalPengajuan',
//       headerName: 'Tanggal Pengajuan',
//       minWidth: 150,
//       sortable: false,
//       renderCell: (params: any) => {
//         return <span>{moment(params?.row?.createdAt).format('DD/MM/YYYY')}</span>
//       }
//     },
//     {
//       flex: 0.25,
//       field: 'tipeRekomendasi',
//       headerName: 'Tipe Rekomendasi',
//       minWidth: 200,
//       sortable: false,
//       renderCell: (params: any) => {
//         return <span>{formatString(params?.row?.tipeRekomendasi)}</span>
//       }
//     },
//     {
//       flex: 0.25,
//       field: 'keperluan',
//       headerName: 'Keperluan',
//       minWidth: 200,
//       sortable: false,
//       renderCell: (params: any) => {
//         return <span>{params?.row?.keperluan ?? '-'}</span>
//       }
//     },
//     {
//       flex: 0.25,
//       field: 'nomorSurat',
//       headerName: 'Nomor Surat',
//       minWidth: 200,
//       sortable: false,
//       renderCell: (params: any) => {
//         return <span>{params?.row?.nomorSurat ?? '-'}</span>
//       }
//     },
//     {
//       flex: 0.25,
//       field: 'verifikasiStatus',
//       headerName: 'Status',
//       minWidth: 150,
//       sortable: false,
//       renderCell: (params: any) => {
//         const { color, text } = getStatus(params?.row?.verifikasiStatus)

//         return (
//           <Chip
//             size='small'
//             variant='filled'
//             color={color}
//             label={text}
//             sx={{
//               '& .MuiChip-label': {
//                 textTransform: 'capitalize'
//               }
//             }}
//           />
//         )
//       }
//     },
//     {
//       flex: 0.25,
//       field: 'actions',
//       headerName: 'Actions',
//       minWidth: 150,
//       sortable: false,
//       renderCell: (params: any) => {
//         return (
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Can I='VIEW' a='REKOMENDASI_MAHASISWA'>
//               <Tooltip title='Detail'>
//                 <IconButton size='small' onClick={() => router.push(`/rekomendasi-mahasiswa/${params?.row?.id}`)}>
//                   <Icon icon='tabler:eye' fontSize={20} />
//                 </IconButton>
//               </Tooltip>
//             </Can>
//           </Box>
//         )
//       }
//     }
//   ]

//   const fetchData = async () => {
//     setIsLoading(true)

//     const params = {
//       page,
//       pageSize
//     }

//     // @ts-ignore
//     await dispatch(getAllRekomendasiMahasiswa({ data: params })).then((res: any) => {
//       if (res?.meta?.requestStatus === 'fulfilled') {
//         setData(res?.payload?.content)
//       }

//       setIsLoading(false)
//     })
//   }

//   useEffect(() => {
//     fetchData()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, pageSize, refresher])

//   return {
//     data,
//     isLoading,
//     page,
//     pageSize,
//     columns,
//     setPage,
//     setPageSize
//   }
// }
