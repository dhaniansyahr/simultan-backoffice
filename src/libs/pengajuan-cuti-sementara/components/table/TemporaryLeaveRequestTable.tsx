import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import DialogDetail from '../dialogs/DialogDetail'
import { useTable } from '../../hooks/useTable'
import Can from 'src/components/acl/Can'
import DialogVerification from '../dialogs/VerificationDialog'

export default function TemporaryLeaveRequestTable() {
  const router = useRouter()

  const {
    data,
    isLoading,
    page,
    pageSize,
    itemSelected,
    isVerificationOpen,
    isDetailOpen,
    columns,
    setPage,
    setPageSize,
    setIsVerificationOpen,
    setIsDetailOpen
  } = useTable()

  const isDisable = data?.entries?.some((item: any) => item?.verifikasiStatus?.split(' ')?.includes('DIPROSES'))

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
              <Can I='CREATE' a='CUTI_SEMENTARA'>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<Icon icon='ic:baseline-add' />}
                  onClick={() => router.push('/pengajuan-cuti-sementara/create')}
                  disabled={isDisable}
                >
                  Buat Pengajuan
                </Button>
              </Can>
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

      <DialogVerification
        open={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        values={itemSelected}
      />

      <DialogDetail open={isDetailOpen} onClose={() => setIsDetailOpen(false)} values={itemSelected} />
    </>
  )
}
