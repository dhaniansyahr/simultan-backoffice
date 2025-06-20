import { Box, Button, Card, CardContent } from '@mui/material'
import { useRouter } from 'next/router'
import { checkAccess } from 'src/utils/checkAccess'
import { Icon } from '@iconify/react'
import { useTable } from '../../hooks/useTable'
import DataTable from 'src/components/shared/data-table'
import HeaderPage from 'src/components/shared/header-page'

export default function CollegeCertificateTable() {
  const router = useRouter()

  const { columns, data, isLoading, page, pageSize, setPage, setPageSize } = useTable()

  const onPaginationModelChange = (newModel: any) => {
    setPage(newModel.page + 1)
    setPageSize(newModel.pageSize)
  }

  const onDisable = data?.entries?.some(
    (item: any) =>
      item?.verifikasiStatus === 'DIPROSES OLEH OPERATOR KEMAHASISWAAN' ||
      item?.verifikasiStatus === 'DIPROSES OLEH KASUBBAG KEMAHASISWAAN'
  )

  return (
    <Card>
      <HeaderPage
        title='Pengajuan Surat Keterangan Aktif Kuliah'
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {checkAccess('SURAT_KETERANGAN_KULIAH', 'CREATE') && (
              <Button
                variant='contained'
                color='primary'
                sx={{ mb: 2 }}
                startIcon={<Icon icon='ic:baseline-add' />}
                onClick={() => router.push('/surat-keterangan-aktif-kuliah/create')}
                disabled={onDisable}
              >
                Buat Pengajuan
              </Button>
            )}
          </Box>
        }
      />

      <CardContent style={{ paddingInline: '0px' }}>
        <DataTable
          data={data}
          columns={columns}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          onPaginationModelChange={onPaginationModelChange}
        />
      </CardContent>
    </Card>
  )
}
