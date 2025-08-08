// import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material'
// import { DataGrid, gridClasses } from '@mui/x-data-grid'
// import { Icon } from '@iconify/react'
// import { useRouter } from 'next/router'
// import { useTable } from '../../hooks/useTable'
// import Can from 'src/components/acl/Can'

// export default function RekomendasiMahasiswaTable() {
//   const router = useRouter()

//   const { data, isLoading, page, pageSize, columns, setPage, setPageSize } = useTable()

//   return (
//     <Card>
//       <CardHeader
//         title={
//           <Box>
//             <Typography variant='h6' sx={{ fontWeight: 500 }}>
//               Rekomendasi Mahasiswa
//             </Typography>
//           </Box>
//         }
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           alignItems: { xs: 'start', md: 'center' },
//           borderBottom: '1px solid #f4f4f4'
//         }}
//       />
//       <CardHeader
//         action={
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
//             <Can I='CREATE' a='REKOMENDASI_MAHASISWA'>
//               <Button
//                 variant='contained'
//                 color='primary'
//                 startIcon={<Icon icon='ic:baseline-add' />}
//                 onClick={() => router.push('/rekomendasi-mahasiswa/create')}
//               >
//                 Buat Rekomendasi
//               </Button>
//             </Can>
//           </Box>
//         }
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           alignItems: { xs: 'start', md: 'center' },
//           borderBottom: '1px solid #f4f4f4'
//         }}
//       />
//       <CardContent style={{ paddingInline: '0px' }}>
//         <DataGrid
//           autoHeight
//           rows={data?.entries ?? []}
//           columns={columns}
//           pagination
//           disableColumnFilter
//           disableColumnMenu
//           disableColumnSelector
//           rowCount={data?.totalData ?? 0}
//           paginationModel={{
//             page: page - 1,
//             pageSize: pageSize
//           }}
//           onPaginationModelChange={(newModel: any) => {
//             setPage(newModel.page + 1)
//             setPageSize(newModel.pageSize)
//           }}
//           loading={isLoading}
//           slots={{
//             loadingOverlay: CircularProgress
//           }}
//           sx={{
//             [`& .${gridClasses.cell}`]: {
//               py: 1
//             }
//           }}
//         />
//       </CardContent>
//     </Card>
//   )
// }
