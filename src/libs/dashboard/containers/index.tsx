import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BoxProps } from '@mui/material/Box'
import { checkAccess } from 'src/utils/checkAccess'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))

export default function Dashboard() {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            {checkAccess('SURAT_KETERANGAN_KULIAH', 'VIEW') ||
            checkAccess('CUTI_SEMENTARA', 'VIEW') ||
            checkAccess('PENGAJUAN_YUDISIUM', 'VIEW') ||
            checkAccess('LEGALISIR_IJAZAH', 'VIEW') ? (
              <Box>
                <Typography variant='h4' mb={4}>
                  Dashboard
                </Typography>
                <Typography variant='body1' mb={4}>
                  Selamat datang di dashboard, silahkan pilih menu yang tersedia di samping kiri untuk mengakses
                  fitur-fitur yang tersedia.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <BoxWrapper>
                  <Typography variant='h1' sx={{ mb: 2.5 }}>
                    401
                  </Typography>
                  <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
                    You are not authorized! 🔐
                  </Typography>
                  <Typography variant='body2'>You don&prime;t have permission to access this page. Go Home!</Typography>
                </BoxWrapper>
                <Img alt='error-illustration' src='/images/pages/401.png' />
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
