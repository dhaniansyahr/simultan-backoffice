import { Button, Card, CardContent } from '@mui/material'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useTable } from '../../hooks/useTable'
import HeaderPage from 'src/components/shared/header-page'
import Can from 'src/components/acl/Can'
import DataTable from 'src/components/shared/data-table'

export default function CertificateLegalizationTable() {
  const router = useRouter()

  const { data, isLoading, page, pageSize, columns, setPage, setPageSize } = useTable()

  const onPaginationModelChange = (newModel: any) => {
    setPage(newModel.page + 1)
    setPageSize(newModel.pageSize)
  }

  const isDisable = data?.entries?.some(
    (item: any) =>
      item?.verifikasiStatus === 'DIPROSES OLEH OPERATOR AKADEMIK' ||
      item?.verifikasiStatus === 'DIPROSES OLEH KASUBBAG AKADEMIK'
  )

  return (
    <Card>
      <HeaderPage
        title='Pengajuan Legalisir Ijazah & Transkrip Nilai'
        isDetail={false}
        action={
          <Can I='CREATE' a='LEGALISIR_IJAZAH'>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Icon icon='ic:baseline-add' />}
              onClick={() => router.push('/legalisir-ijazah/create')}
              disabled={isDisable}
            >
              Buat Pengajuan
            </Button>
          </Can>
        }
      />

      <CardContent style={{ paddingInline: '0px' }}>
        <DataTable
          data={data}
          columns={columns}
          onPaginationModelChange={onPaginationModelChange}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
        />
      </CardContent>
    </Card>
  )
}
