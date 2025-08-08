import { Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import HeaderPage from 'src/components/shared/header-page'
import { getSuratKeteranganLulus } from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusAction'
import { formatString, getFileNamefromURL, getStatus } from 'src/utils'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import DialogVerifikasi from '../components/dialogs/DialogVerifikasi'
import DialogPenolakan from '../components/dialogs/DialogPenolakan'
import Can from 'src/components/acl/Can'
import InputNomorSuratDialog from '../components/dialogs/InputNomorSuratDialog'
import EditNomorSuratDialog from '../components/dialogs/DialogEditNomorSurat'

export default function DetailContainer() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { refresher } = useAppSelector(state => state.suratKeteranganLulus)

  const { id } = router.query as { id: string }

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const [isReject, setIsReject] = useState(false)
  const [isVerify, setIsVerify] = useState(false)
  const [isInputNomorSurat, setIsInputNomorSurat] = useState(false)
  const [isEditNomorSurat, setIsEditNomorSurat] = useState(false)

  const handleGetData = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getSuratKeteranganLulus({ id })).then(res => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refresher])

  const onVerificationOrInputNomorSurat = () => {
    if (data?.verifikasiStatus === 'SEDANG INPUT NOMOR SURAT OLEH OPERATOR KEMAHASISWAAN') {
      setIsInputNomorSurat(true)
    } else {
      setIsVerify(true)
    }
  }

  const onInputNomorSurat = () => {
    setIsInputNomorSurat(true)
  }

  // Separate function for edit nomor surat (when already approved)
  const onEditNomorSurat = () => {
    setIsEditNomorSurat(true)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <HeaderPage
          title='Detail Surat Keterangan Lulus'
          isDetail={true}
          action={
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Can I='VERIFICATION' a='SURAT_KETERANGAN_LULUS'>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => setIsReject(true)}
                  disabled={data?.verifikasiStatus === 'DISETUJUI'}
                >
                  Tolak
                </Button>

                {/* Show Verifikasi button only when not in specific status */}
                {data?.verifikasiStatus !== 'SEDANG INPUT NOMOR SURAT OLEH OPERATOR KEMAHASISWAAN' &&
                  data?.verifikasiStatus !== 'DISETUJUI' && (
                    <Button variant='contained' color='primary' onClick={onVerificationOrInputNomorSurat}>
                      Verifikasi
                    </Button>
                  )}

                {/* Show Input Nomor Surat button when status is SEDANG INPUT */}
                {data?.verifikasiStatus === 'SEDANG INPUT NOMOR SURAT OLEH OPERATOR KEMAHASISWAAN' && (
                  <Button variant='contained' color='primary' onClick={onInputNomorSurat}>
                    Input Nomor Surat
                  </Button>
                )}

                {/* Show Edit Nomor Surat button when status is DISETUJUI */}
                {data?.verifikasiStatus === 'DISETUJUI' && (
                  <Button variant='contained' color='primary' onClick={onEditNomorSurat}>
                    Edit Nomor Surat
                  </Button>
                )}
              </Can>
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
              height: '200px'
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      borderBottom: '1px solid #4C4E6438',
                      paddingBottom: 2
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant='body1' fontWeight={500}>
                          Pemohon
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant='body1' color={'text.secondary'}>
                          {data?.user?.nama ?? '-'} - {data?.user?.npm ?? '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={6}>
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
                          {`${moment(data?.createdAt).format('DD MMMM YYYY HH:mm')} WIB`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    sx={{
                      borderBottom: '1px solid #4C4E6438',
                      paddingBottom: 2
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant='body1' fontWeight={500}>
                          Tipe Surat
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant='body1' color={'text.secondary'}>
                          {formatString(data?.tipeSurat ?? '-')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={6}>
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
                      <Grid item xs={2}>
                        <Typography variant='body1' fontWeight={500}>
                          Deskripsi Keperluan
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography variant='body1' color={'text.secondary'}>
                          {data?.deskripsi ?? '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    sx={{
                      borderBottom: '1px solid #4C4E6438',
                      paddingBottom: 2
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant='body1' fontWeight={500}>
                          Dokumen Transkrip
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {data?.dokumenTranskrip ? (
                          <Link href={data?.dokumenTranskrip ?? ''} target='_blank' style={{ textDecoration: 'none' }}>
                            <Typography variant='body1' sx={{ color: 'blue' }}>
                              {getFileNamefromURL(data?.dokumenTranskrip ?? '') || '-'}
                            </Typography>
                          </Link>
                        ) : (
                          <Typography variant='body1' color={'text.secondary'}>
                            -
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    sx={{
                      borderBottom: '1px solid #4C4E6438',
                      paddingBottom: 2
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant='body1' fontWeight={500}>
                          Nomor Surat
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant='body1' color={'text.secondary'}>
                          {data?.nomorSurat ?? '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {data?.alasanPenolakan && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: '1px solid #4C4E6438',
                        paddingBottom: 2
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <Typography variant='body1' fontWeight={500}>
                            Alasan Penolakan
                          </Typography>
                        </Grid>
                        <Grid item xs={10}>
                          <Typography variant='body1' color={'error.main'}>
                            {data?.alasanPenolakan}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                )}

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
                                      {getStatus(item?.nama)?.text === 'DITOLAK' ? (
                                        <Typography variant='body1'>
                                          {formatString(item?.nama ?? '-')} : {data?.alasanPenolakan}
                                        </Typography>
                                      ) : (
                                        <Typography variant='body1'>{formatString(item?.nama ?? '-')}</Typography>
                                      )}
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

      <DialogPenolakan
        open={isReject}
        onClose={() => setIsReject(false)}
        closeVerification={() => setIsVerify(false)}
        values={data}
      />

      <InputNomorSuratDialog open={isInputNomorSurat} onClose={() => setIsInputNomorSurat(false)} values={data} />

      <EditNomorSuratDialog open={isEditNomorSurat} onClose={() => setIsEditNomorSurat(false)} values={data} />
    </Grid>
  )
}
