import { Icon } from '@iconify/react'
import { Chip, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import React, { ReactElement, Ref, forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { AppDispatch } from 'src/stores'
import { setRefresher } from 'src/stores/temporary-leave-request/temporaryLeaveRequestSlice'
import { formatString, getStatus } from 'src/utils'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface DetailProps {
  open: boolean
  onClose: (v: boolean) => void
  values: any
}

const DialogDetail = ({ open, onClose, values }: DetailProps) => {
  const dispatch: AppDispatch = useDispatch()

  const handleClose = () => {
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' TransitionComponent={Transition}>
      <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: '#F7F7F9' }}>
        <IconButton
          onClick={() => {
            handleClose()
          }}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='material-symbols:close' />
        </IconButton>
        <Box>
          <Typography variant='h5' align='center'>
            Detail Pengajuan
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          pb: 6,
          px: { xs: 8, sm: 15 },
          pt: { xs: 8, sm: 12.5 },
          position: 'relative'
        }}
        style={{ paddingTop: '5px' }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={4} sx={{ bgcolor: '#F9F9F9', px: 4, pb: 4, borderRadius: '12px' }}>
              <Grid item xs={12}>
                <Grid container spacing={2} paddingBottom={'16px'} borderBottom={'1px solid #4c4e6438'}>
                  <Grid item xs={6}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      Tanggal Pengajuan
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='body1'>{moment(values?.createdDate).format('DD MMMM YYYY') ?? '-'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} paddingBottom={'16px'} borderBottom={'1px solid #4c4e6438'}>
                  <Grid item xs={6}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      Status
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={formatString(values?.verifikasiStatus ?? '-')}
                      sx={{
                        backgroundColor: theme =>
                          getStatus(values?.verifikasiStatus) === 'DIPROSES'
                            ? hexToRGBA(theme.palette.warning.main, 0.12)
                            : getStatus(values?.verifikasiStatus) === 'DISETUJUI'
                            ? hexToRGBA(theme.palette.success.main, 0.12)
                            : hexToRGBA(theme.palette.error.main, 0.12),
                        color: theme =>
                          getStatus(values?.verifikasiStatus) === 'DIPROSES'
                            ? theme.palette.warning.main
                            : getStatus(values?.verifikasiStatus) === 'DISETUJUI'
                            ? theme.palette.success.main
                            : theme.palette.error.main
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  History Status
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={0.3}>
                    <Box
                      sx={{
                        width: '4px',
                        height: '100%',
                        bgcolor: '#6D788D22',
                        borderRadius: '12px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={11.7}>
                    <Grid container spacing={4}>
                      {!values?.status ||
                        (values?.status?.length === 0 && (
                          <Grid item xs={12}>
                            <Typography variant='body1'>Tidak ada data</Typography>
                          </Grid>
                        ))}
                      {values?.status?.map((item: any) => (
                        <Grid item xs={12} key={item?.id}>
                          <Grid container spacing={1} sx={{ alignItems: 'center' }}>
                            <Grid item xs={0.5}>
                              <Box
                                sx={{
                                  height: '4px',
                                  width: '100%',
                                  bgcolor: '#6D788D22',
                                  borderRadius: '12px'
                                }}
                              />
                            </Grid>
                            <Grid item xs={0.5}>
                              <Box width={'8px'} height={'8px'} bgcolor={'#72E128'} borderRadius={'100%'} />
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant='body1'>
                                {moment(item?.createdAt).format('dddd, DD/MM/YYYY HH:mm')}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Box
                                sx={{
                                  backgroundColor: theme =>
                                    getStatus(item?.nama) === 'DIPROSES'
                                      ? hexToRGBA(theme.palette.warning.main, 0.12)
                                      : getStatus(item?.nama) === 'DISETUJUI'
                                      ? hexToRGBA(theme.palette.success.main, 0.12)
                                      : hexToRGBA(theme.palette.error.main, 0.12),
                                  borderRadius: '6px',
                                  px: 4,
                                  py: 2,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <Typography
                                  variant='body1'
                                  sx={{
                                    color: theme =>
                                      getStatus(item?.nama) === 'DIPROSES'
                                        ? theme.palette.warning.main
                                        : getStatus(item?.nama) === 'DISETUJUI'
                                        ? theme.palette.success.main
                                        : theme.palette.error.main
                                  }}
                                >
                                  {formatString(item?.nama ?? '-')}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDetail
