import React from 'react'
import { Card, CardContent, Typography, Grid, Divider, Box, Button, TextField, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import 'react-datepicker/dist/react-datepicker.css'
import { NextRouter, useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import toast from 'react-hot-toast'
import { createCertificateLegalization } from 'src/stores/certificate-legalization/certificateLegalizationAction'
import HeaderPage from 'src/components/shared/header-page'
import FormLegalisirIjazah from '../components/form'
import { useForm, Controller } from 'react-hook-form'
import { uploadToStorage } from 'src/stores/storage/storageAction'
import { useAuth } from 'src/hooks/useAuth'
import { getDocument } from 'src/utils'

const CreateContainer = () => {
  const dispatch: AppDispatch = useDispatch()
  const router: NextRouter = useRouter()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadFile, setIsLoadFile] = useState<string>('')
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<any>(null)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({}) // Store uploaded files

  const { control, setValue, handleSubmit, watch } = useForm()

  // Watch for tempat pengambilan value
  const tempatPengambilan = watch('tempatPengambilan')

  // Restore uploaded files when component mounts or step changes
  useEffect(() => {
    Object.keys(uploadedFiles).forEach(key => {
      setValue(key, uploadedFiles[key])
    })
  }, [uploadedFiles, setValue])

  const handleUploadDocument = async (key: string, file: File) => {
    setIsLoadFile(key)

    const body: any = {
      bucket: 'nodewave',
      directory: `tender/document-review`,
      file: file
    }

    try {
      // @ts-ignore
      const res = await dispatch(uploadToStorage({ data: body }))

      if (res.meta.requestStatus !== 'fulfilled') {
        throw new Error(res.payload.response.data.message)
      }

      const fileUrl = res.payload.content.fileUrl
      setValue(key, fileUrl)
      
      // Store uploaded file in state to preserve it
      setUploadedFiles(prev => ({
        ...prev,
        [key]: fileUrl
      }))
      
      setIsLoadFile('')
    } catch (error) {
      setIsLoadFile('')
      toast.error('Gagal mengupload file')
    }
  }

  const handleFirstStep = handleSubmit(async (value: any) => {
    if (value.tempatPengambilan === 'Via_POS') {
      // If Via POS, go to next step and preserve all data including uploaded files
      const completeFormData = {
        ...value,
        ...uploadedFiles // Include all uploaded files
      }
      setFormData(completeFormData)
      setStep(2)
    } else {
      // If pickup at faculty, directly create with uploaded files
      const completeData = {
        ...value,
        ...uploadedFiles
      }
      handleCreate(completeData)
    }
  })

  const handleCreate = async (value: any) => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    const body: any = Object.assign({}, value)

    // @ts-ignore
    await dispatch(createCertificateLegalization({ data: body })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        return
      }

      setIsLoading(false)
      toast.dismiss()
      toast.success(res?.payload?.message)

      // Clear uploaded files after successful submission
      setUploadedFiles({})
      router.back()
    })
  }

  const handleSecondStep = handleSubmit(async (value: any) => {
    // Combine first step data with second step data and all uploaded files
    const combinedData = {
      ...formData,
      buktiPembayaranOngkir: value.buktiPembayaranOngkir,
      ...uploadedFiles // Ensure all uploaded files are included
    }
    handleCreate(combinedData)
  })

  const handleBack = () => {
    setStep(1)

    // Don't reset form data or clear uploaded files
    // setFormData(null) - Remove this line
    // reset() - Remove this line
    
    // Restore form data from step 1
    if (formData) {
      Object.keys(formData).forEach(key => {
        setValue(key, formData[key])
      })
    }
  }

  const handleRouterBack = () => {
    // Show confirmation dialog if user has uploaded files
    if (Object.keys(uploadedFiles).length > 0) {
      const confirmLeave = window.confirm(
        'Anda memiliki file yang sudah diupload. Apakah Anda yakin ingin meninggalkan halaman ini? Data akan hilang.'
      )
      
      if (confirmLeave) {
        setUploadedFiles({}) // Clear uploaded files
        router.back()
      }
    } else {
      router.back()
    }
  }
if (step === 2) {
  // Second step - Upload bukti pembayaran ongkir and shipping address
  return (
    <Card>
      <HeaderPage 
        title='Upload Bukti Pembayaran Ongkir & Alamat Pengiriman' 
        isDetail={true} 
        onBack={handleRouterBack} // Use custom back handler
      />

      <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
        <form action='submit' onSubmit={handleSecondStep}>
          <Grid container spacing={4} direction='row'>
            <Grid item xs={6}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    Upload Bukti Pembayaran & Alamat Pengiriman
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name='buktiPembayaranOngkir'
                    render={({ field, formState: { errors } }) => (
                      <>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Upload Bukti Biaya Pengiriman
                        </Typography>
                        <TextField
                          fullWidth
                          value={
                            field.value ? field.value.split('/').pop()?.replace(/%20/g, ' ') : 'Pilih file'
                          }
                          inputProps={{
                            readOnly: true
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              bgcolor: '#fff'
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <LoadingButton
                                sx={{ whiteSpace: 'nowrap' }}
                                variant='outlined'
                                color='primary'
                                onClick={async () => {
                                  const file = await getDocument(
                                    `bukti_biaya_pengiriman_${user?.nomorIdentitas}`,
                                    'image/*'
                                  )

                                  if (file) {
                                    handleUploadDocument('buktiPembayaranOngkir', file)
                                  }
                                }}
                                loading={isLoadFile === 'buktiPembayaranOngkir'}
                                disabled={isLoadFile !== ''}
                                loadingIndicator={<CircularProgress size={20} />}
                              >
                                Pilih File
                              </LoadingButton>
                            )
                          }}
                          helperText={'Format file: JPG, JPEG, PNG; Max 10 MB'}
                        />
                        {errors.buktiPembayaranOngkir && (
                          <Typography variant='body1' sx={{ color: 'red' }}>
                            {errors.buktiPembayaranOngkir.message as string}
                          </Typography>
                        )}
                      </>
                    )}
                    rules={{ required: 'Bukti Biaya Pengiriman harus diisi' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name='alamatPengiriman'
                    render={({ field, formState: { errors } }) => (
                      <>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Alamat Lengkap Pengiriman *
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          placeholder='Masukkan alamat lengkap sesuai KTP beserta kode pos...'
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={!!errors.alamatPengiriman}
                          sx={{
                            '& .MuiInputBase-root': {
                              bgcolor: '#fff'
                            }
                          }}
                          helperText={
                            errors.alamatPengiriman && typeof errors.alamatPengiriman.message === 'string'
                              ? errors.alamatPengiriman.message
                              : 'Contoh: Jl. Mawar No. 123, RT 02/RW 05, Kelurahan Lamgugob, Kecamatan Syiah Kuala, Banda Aceh, Aceh 23111'
                          }
                          FormHelperTextProps={{
                            sx: {
                              color: errors.alamatPengiriman ? 'error.main' : 'text.secondary',
                              fontSize: '0.75rem',
                              mt: 1
                            }
                          }}
                        />
                      </>
                    )}
                    rules={{ 
                      required: 'Alamat pengiriman harus diisi',
                      minLength: {
                        value: 20,
                        message: 'Alamat minimal 20 karakter (sertakan nama jalan, RT/RW, kelurahan, kecamatan, kota, dan kode pos)'
                      },
                      validate: {
                        hasKodePos: (value) => {
                          const kodePostPattern = /\b\d{5}\b/

                          return kodePostPattern.test(value) || 'Alamat harus mencantumkan kode pos (5 digit angka)'
                        },
                        hasKelurahan: (value) => {
                          const kelurahanPattern = /(kelurahan|desa|gampong)/i

                          return kelurahanPattern.test(value) || 'Alamat harus mencantumkan kelurahan/desa/gampong'
                        },
                        hasKecamatan: (value) => {
                          const kecamatanPattern = /(kecamatan|kec\.)/i

                          return kecamatanPattern.test(value) || 'Alamat harus mencantumkan kecamatan'
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'info.lighter', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'info.main'
                    }}
                  >
                    <Typography variant='body2' sx={{ fontWeight: 'bold', color: 'info.main', mb: 1 }}>
                      📋 Petunjuk Pengisian Alamat:
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'info.main' }}>
                      • Tulis alamat lengkap sesuai dengan KTP Anda<br/>
                      • Sertakan nama jalan dan nomor rumah<br/>
                      • Cantumkan RT/RW jika ada<br/>
                      • Tulis kelurahan/desa, kecamatan, dan kota<br/>
                      • Jangan lupa kode pos (5 digit)<br/>
                      • Pastikan alamat mudah ditemukan oleh kurir
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Card
                variant='outlined'
                sx={{ 
                  padding: '16px', 
                  backgroundColor: theme => hexToRGBA(theme.palette.grey[500], 0.12),
                  mb: 2 
                }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                     Pembayaran Ongkos Pengiriman Legalisir Ijazah
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <Typography variant='body1' color='initial'>
                            Nama Bank
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='body1' color='initial'>
                            : Bank BSI
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <Typography variant='body1' color='initial'>
                            Nama Rekening
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='body1' color='initial'>
                            : Fakultas Pertanian USK
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <Typography variant='body1' color='initial'>
                            Nomor Rekening
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='body1' color='initial'>
                            : 1234567890
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              <Card
                variant='outlined'
                sx={{ 
                  padding: '16px', 
                  backgroundColor: theme => hexToRGBA(theme.palette.warning.main, 0.12),
                  border: '1px solid',
                  borderColor: 'warning.main'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px', color: 'warning.main' }}>
                      ⚠️ Penting untuk Pengiriman
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ color: 'warning.main' }}>
                      • Pastikan alamat yang Anda berikan <strong>sesuai dengan KTP</strong><br/>
                      • Sertakan <strong>nomor telepon yang aktif</strong> untuk koordinasi dengan kurir<br/>
                      • Dokumen akan dikirim via <strong>POS Indonesia</strong> dengan layanan tercatat<br/>
                      • Estimasi pengiriman <strong>3-7 hari kerja</strong> tergantung lokasi<br/>
                      • Mohon <strong>konfirmasi penerimaan</strong> setelah dokumen diterima
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button variant="outlined" onClick={handleBack}>
                    Kembali
                  </Button>
                </Grid>
                <Grid item>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                  >
                    Simpan
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

  // First step - original form
  return (
    <Card>
      <HeaderPage 
        title='Buat Pengajuan Legalisir Ijazah & Transkrip Nilai' 
        isDetail={true} 
        onBack={handleRouterBack} // Use custom back handler
      />

      <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
        <form action='submit' onSubmit={handleFirstStep}>
          <Grid container spacing={4} direction='row'>
            <Grid item xs={6}>
              <FormLegalisirIjazah
                control={control}
                handleUploadDocument={handleUploadDocument}
                isLoadFile={isLoadFile}
              />
            </Grid>

            <Grid item xs={6}>
              <Card
                variant='outlined'
                sx={{ padding: '16px', backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.12), mb: 4 }}
              >
                <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  Perhatikan Informasi Berikut :
                </Typography>
                <Typography variant='body2'>
                  <ul>
                    <li>
                      <Typography variant='body2'>
                        Maksimal Jumlah Legalisir Ijazah yang dapat diajukan adalah minimal 5 dan maksimal 20.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>
                        Untuk via pos dapat dilakukan untuk wilayah Banda Aceh, Aceh Besar dan luar Aceh.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>
                        Untuk wilayah Banda Aceh dan Aceh Besar, diwajibkan untuk melakukan pengambilan di Fakultas
                        Pertanian.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>
                        Pastikan data yang anda isi sudah benar dan sesuai dengan data yang anda miliki.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>Pastikan anda sudah membayar biaya legalisir ijazah.</Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>
                        Biaya legalisir ijazah adalah sebesar Rp. 2.500,- per buah.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>
                        Biaya ongkos pengiriman via pos adalah sebesar Rp. 10.000,- untuk wilayah Banda Aceh dan Aceh
                        Besar, dan Rp. 20.000,- untuk wilayah luar Aceh.
                      </Typography>
                    </li>
                  
                    <li>
                      <Typography variant='body2'>
                      Pengiriman dokumen dilakukan setiap hari <strong>Kamis</strong>. Jika Anda mengajukan permohonan pada hari Jumat atau setelahnya, dokumen Anda akan dikirim pada hari Kamis berikutnya.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>
                      Legalisir ijazah dan transkrip nilai <strong>hanya berlaku bagi mahasiswa yang sudah memiliki barcode</strong> pada dokumen.
                      </Typography>
                    </li>
                  </ul>
                </Typography>
              </Card>


              <Card
                variant='outlined'
                sx={{ padding: '16px', backgroundColor: theme => hexToRGBA(theme.palette.grey[500], 0.12) }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                      Pembayaran Legalisir Ijazah
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <Typography variant='body1' color='initial'>
                            Nama Bank
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='body1' color='initial'>
                            : Bank BSI
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <Typography variant='body1' color='initial'>
                            Nama Rekening
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='body1' color='initial'>
                            : Biro Akademik USK
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <Typography variant='body1' color='initial'>
                            Nomor Rekening
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='body1' color='initial'>
                            : 1234567890
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                  >
                    {tempatPengambilan === 'Via_POS' ? 'Selanjutnya' : 'Simpan'}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateContainer