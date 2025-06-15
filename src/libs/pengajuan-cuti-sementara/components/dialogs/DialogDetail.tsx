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
import { setRefresher } from 'src/stores/temporary-leave-request/temporaryLeaveRequestSlice'
import { formatString, getFileNamefromURL, getStatus } from 'src/utils'

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
    <Dialog
      fullWidth
      open={open}
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      PaperProps={{ sx: { borderRadius: '0px' } }}
    >
      <HeaderDialog title='Detail Pengajuan' onClose={handleClose} />

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
                          backgroundColor: getStatus(values?.verifikasiStatus)?.color + '22',
                          color: getStatus(values?.verifikasiStatus)?.color
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
                        Alasan Pengajuan
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant='body1' color={'text.secondary'}>
                        {values?.alasanPengajuan ?? '-'}
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
                        Surat Persetujuan Orang Tua
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Link
                        href={values?.suratPersetujuanOrangTuaUrl ?? ''}
                        target='_blank'
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography variant='body1' sx={{ color: 'blue' }}>
                          {getFileNamefromURL(values?.suratIzinOrangTuaUrl ?? '') || '-'}
                        </Typography>
                      </Link>
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
                        Surat BSS
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Link href={values?.suratBssUrl ?? ''} target='_blank' style={{ textDecoration: 'none' }}>
                        <Typography variant='body1' sx={{ color: 'blue' }}>
                          {getFileNamefromURL(values?.suratBssUrl ?? '') || '-'}
                        </Typography>
                      </Link>
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
                        Surat Bebas Pustaka
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Link
                        href={values?.suratBebasPustakaUrl ?? ''}
                        target='_blank'
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography variant='body1' sx={{ color: 'blue' }}>
                          {getFileNamefromURL(values?.suratBebasPustakaUrl ?? '') || '-'}
                        </Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
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
                                  backgroundColor: getStatus(item?.nama)?.color + '22',
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
                                    color: getStatus(item?.nama)?.color
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
