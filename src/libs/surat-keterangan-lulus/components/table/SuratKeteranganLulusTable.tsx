import { Box, Button, Card, CardContent, Divider, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { checkAccess } from 'src/utils/checkAccess'
import { Icon } from '@iconify/react'
import { useTable } from '../../hooks/useTable'
import DataTable from 'src/components/shared/data-table'
import HeaderPage from 'src/components/shared/header-page'
import { useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

export default function SuratKeteranganLulusTable() {
  const router = useRouter()
  const { user } = useAuth()

  // State
  const [tab, setTab] = useState<string>('ALL')

  const { columns, data, isLoading, page, pageSize, setPage, setPageSize } = useTable(tab)

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
        title='Surat Keterangan Lulus'
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {checkAccess('SURAT_KETERANGAN_LULUS', 'CREATE') && (
              <Button
                variant='contained'
                color='primary'
                sx={{ mb: 2 }}
                startIcon={<Icon icon='ic:baseline-add' />}
                onClick={() => router.push('/surat-keterangan-lulus/create')}
                disabled={onDisable}
              >
                Buat Surat
              </Button>
            )}
          </Box>
        }
      />

      <CardContent style={{ paddingInline: '0px' }}>
        <Grid container spacing={4}>
          {['OPERATOR_KEMAHASISWAAN', 'KASUBBAG_KEMAHASISWAAN'].includes(user?.role || '') && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 4, py: 2 }}>
                  {['SEDANG DIAJUKAN', 'HISTORY'].map(item => (
                    <Button
                      key={item}
                      variant='outlined'
                      color='primary'
                      sx={{
                        backgroundColor: tab === item ? 'primary.main' : 'transparent',
                        color: tab === item ? 'white' : 'primary.main',
                        borderColor: tab === item ? 'primary.main' : 'transparent'
                      }}
                      onClick={() => {
                        setTab(item)
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <DataTable
              data={data}
              columns={columns}
              isLoading={isLoading}
              page={page}
              pageSize={pageSize}
              onPaginationModelChange={onPaginationModelChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
