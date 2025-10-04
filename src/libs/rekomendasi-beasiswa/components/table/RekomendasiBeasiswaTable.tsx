import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useTable } from '../../hooks/useTable'
import Can from 'src/components/acl/Can'
import { useAuth } from 'src/hooks/useAuth'
import { useState } from 'react'
import DataTable from 'src/components/shared/data-table'

export default function RekomendasiBeasiswaTable() {
  const router = useRouter()
  const { user } = useAuth()

  // State
  const [tab, setTab] = useState<string>('SEDANG DIAJUKAN')

  const { columns, data, isLoading, page, pageSize, setPage, setPageSize } = useTable(tab)

  const onPaginationModelChange = (newModel: any) => {
    setPage(newModel.page + 1)
    setPageSize(newModel.pageSize)
  }

  const onDisable = data?.entries?.some(
    (item: any) =>
      item?.verifikasiStatus === 'DIPROSES OLEH OPERATOR AKADEMIK' ||
      item?.verifikasiStatus === 'DIPROSES OLEH KASUBBAG AKADEMIK'
  )

  return (
    <Card>
      <CardHeader
        title={
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 500 }}>
              Rekomendasi Beasiswa
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
            <Can I='CREATE' a='REKOMENDASI_BEASISWA'>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Icon icon='ic:baseline-add' />}
                onClick={() => router.push('/rekomendasi-beasiswa/create')}
                disabled={onDisable}
              >
                Buat Rekomendasi
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
        <Grid container spacing={4}>
          {['OPERATOR_AKADEMIK', 'KASUBBAG_AKADEMIK'].includes(user?.role || '') && (
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
                        borderColor: tab === item ? 'primary.main' : 'primary.main'
                      }}
                      onClick={() => setTab(item)}
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
