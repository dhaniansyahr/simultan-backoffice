import { Button, Card, CardContent } from '@mui/material'
import { Icon } from '@iconify/react'
import { useTable } from '../../hooks/useTable'
import HeaderPage from 'src/components/shared/header-page'
import { useRouter } from 'next/router'
import Can from 'src/components/acl/Can'
import DataTable from 'src/components/shared/data-table'

export default function TableYudisium() {
  const router = useRouter()

  const { data, isLoading, page, pageSize, columns, setPage, setPageSize } = useTable()

  const isDisable = data?.entries?.some(
    (item: any) =>
      item?.verifikasiStatus === 'DIPROSES OLEH OPERATOR AKADEMIK' ||
      item?.verifikasiStatus === 'DIPROSES OLEH KASUBBAG AKADEMIK'
  )

  const onPaginationModelChange = (newModel: any) => {
    setPage(newModel.page + 1)
    setPageSize(newModel.pageSize)
  }

  return (
    <Card>
      <HeaderPage
        title='Pengajuan Yudisium'
        isDetail={false}
        action={
          <Can I='CREATE' a='LEGALISIR_IJAZAH'>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Icon icon='ic:baseline-add' />}
              onClick={() => router.push('/pengajuan-yudisium/create')}
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
