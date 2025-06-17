import { Chip } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import Link from 'next/link'
import React, { ReactElement, Ref, forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'
import { AppDispatch } from 'src/stores'
import { setRefresher } from 'src/stores/college-certificate/certificateLegalizationSlice'
import { formatString, getFileNamefromURL, getStatus } from 'src/utils'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface DetailProps {
  open: boolean
  onClose: () => void
  values: any
}

const DialogDetail = ({ open, onClose, values }: DetailProps) => {
  const dispatch: AppDispatch = useDispatch()

  const handleClose = () => {
    onClose()

    // @ts-ignore
    dispatch(setRefresher())
  }

  const status = getStatus(values?.verifikasiStatus)

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '0px',
          padding: '0px !important'
        }
      }}
    >
      <HeaderDialog onClose={handleClose} title='Detail Pengajuan' />

      <DialogContent
        sx={{
          pb: 6,
          px: { xs: 4, sm: 7.5 },
          pt: { xs: 8, sm: 12.5 },
          position: 'relative'
        }}
        style={{ paddingTop: '5px' }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    borderBottom: '1px solid #4C4E6438',
                    paddingBottom: 2
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant='body1' fontWeight={500}>
                        Tipe Surat yang diajukan
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant='body1' color={'text.secondary'}>
                        {values?.tipeSurat ?? '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    borderBottom: '1px solid #4C4E6438',
                    paddingBottom: 2
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant='body1' fontWeight={500}>
                        Tanggal Pengajuan
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant='body1' color={'text.secondary'}>
                        {`${moment(values?.createdDate).format('DD MMMM YYYY HH:mm')} WIB`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    borderBottom: '1px solid #4C4E6438',
                    paddingBottom: 2
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant='body1' fontWeight={500}>
                        Status Pengajuan
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        label={formatString(values?.verifikasiStatus ?? '-')}
                        sx={{
                          backgroundColor: status?.color + '22',
                          color: status?.color
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    borderBottom: '1px solid #4C4E6438',
                    paddingBottom: 2
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant='body1' fontWeight={500}>
                        Deskripsi Pengajuan
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant='body1' color={'text.secondary'}>
                        {values?.deskripsi ?? '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    borderBottom: '1px solid #4C4E6438',
                    paddingBottom: 2
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant='body1' fontWeight={500}>
                        Surat Pengajuan
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Link href={values?.dokumenUrl ?? ''} target='_blank' style={{ textDecoration: 'none' }}>
                        <Typography variant='body1' sx={{ color: 'blue' }}>
                          {getFileNamefromURL(values?.dokumenUrl ?? '') || '-'}
                        </Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}></Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDetail
