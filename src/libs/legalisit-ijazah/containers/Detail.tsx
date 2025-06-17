import { Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import HeaderPage from 'src/components/shared/header-page'
import { formatString, getFileNamefromURL, getStatus } from 'src/utils'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import Can from 'src/components/acl/Can'
import { getCertificateLegalization } from 'src/stores/certificate-legalization/certificateLegalizationAction'
import DialogVerifikasi from '../components/dialogs/DialogVerifikasi'
import DialogPenolakan from '../components/dialogs/DialogPenolakan'
import DialogProses from '../components/dialogs/DialogProses'

export default function DetailContainer() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { refresher } = useAppSelector(state => state.certificateLegalization)

  const { id } = router.query as { id: string }

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const [isReject, setIsReject] = useState(false)
  const [isVerify, setIsVerify] = useState(false)
  const [isProcess, setIsProcess] = useState(false)

  const handleGetData = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getCertificateLegalization({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        return
      }

      setData(res.payload?.content)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    handleGetData()
  }, [id, refresher])

  const verificationOrProcess = () => {
    if (data?.verifikasiStatus === 'LEGALISIR IJAZAH SEDANG DIPROSES') {
      setIsProcess(true)
    } else {
      setIsVerify(true)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <HeaderPage
          title='Detail Pengajuan Surat Keterangan Aktif Kuliah'
          isDetail={true}
          action={
            <Box sx={{ display: 'flex', gap: 2 }}>
              {data?.verifikasiStatus !== 'SELESAI' && (
                <Can I='VERIFICATION' a='LEGALISIR_IJAZAH'>
                  {data?.verifikasiStatus !== 'LEGALISIR IJAZAH SEDANG DIPROSES' && (
                    <Button variant='outlined' color='error' onClick={() => setIsReject(true)}>
                      Tolak
                    </Button>
                  )}

                  <Button variant='contained' color='primary' onClick={verificationOrProcess}>
                    {data?.verifikasiStatus === 'LEGALISIR IJAZAH SEDANG DIPROSES' ? 'Proses' : 'Verifikasi'}
                  </Button>
                </Can>
              )}
            </Box>
          }
        />
      </Grid>

      {isLoading ? (
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ paddingBottom: 2 }}>
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Informasi Pengajuan
                      </Typography>
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
                              Nama yang mengajukan
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant='body1' color={'text.secondary'}>
                              {data?.user?.nama || '-'} - {data?.user?.npm || '-'}
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
                              {`${moment(data?.createdDate).format('DD MMMM YYYY HH:mm')} WIB`}
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
                              label={formatString(data?.verifikasiStatus ?? '-')}
                              sx={{
                                backgroundColor: getStatus(data?.verifikasiStatus)?.color + '22',
                                color: getStatus(data?.verifikasiStatus)?.color
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
                              Jumlah Legalisir
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant='body1' color={'text.secondary'}>
                              {data?.totalLegalisir ?? '-'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ paddingBottom: 2 }}>
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Informasi Pembayaran
                      </Typography>
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
                              Nama Bank
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant='body1' color={'text.secondary'}>
                              {data?.namaBank || '-'}
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
                              Nama Rekening
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant='body1' color={'text.secondary'}>
                              {data?.namaRekening || '-'}
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
                              Nomor Rekening
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant='body1' color={'text.secondary'}>
                              {data?.nomorRekening || '-'}
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
                              Bukti Pembayaran
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Link href={data?.buktiPembayaran ?? ''} target='_blank' style={{ textDecoration: 'none' }}>
                              <Typography variant='body1' color={'blue'}>
                                {getFileNamefromURL(data?.buktiPembayaran ?? '') || '-'}
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
                            {!data?.status ||
                              (data?.status?.length === 0 && (
                                <Grid item xs={12}>
                                  <Typography variant='body1'>Tidak ada data</Typography>
                                </Grid>
                              ))}
                            {data?.status?.map((item: any) => (
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
                                      {moment(item?.createdAt).format('dddd, DD MMMM YYYY HH:mm')}
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
                                      <Typography variant='body1'>{formatString(item?.nama ?? '-')}</Typography>
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
            </CardContent>
          </Card>
        </Grid>
      )}

      <DialogVerifikasi open={isVerify} onClose={() => setIsVerify(false)} values={data} />

      <DialogPenolakan open={isReject} onClose={() => setIsReject(false)} values={data} />

      <DialogProses open={isProcess} onClose={() => setIsProcess(false)} values={data} />
    </Grid>
  )
}
