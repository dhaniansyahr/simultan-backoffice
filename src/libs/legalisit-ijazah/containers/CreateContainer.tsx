import React from 'react'
import { Card, CardContent, Typography, Grid, Divider, Box } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import toast from 'react-hot-toast'
import { createCertificateLegalization } from 'src/stores/certificate-legalization/certificateLegalizationAction'
import HeaderPage from 'src/components/shared/header-page'
import ActionPage from 'src/components/shared/action-page'
import FormLegalisirIjazah from '../components/form'
import { useForm } from 'react-hook-form'
import { uploadToStorage } from 'src/stores/storage/storageAction'

const CreateContainer = () => {
  const dispatch: AppDispatch = useDispatch()
  const router: NextRouter = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadFile, setIsLoadFile] = useState<string>('')

  const { control, setValue, handleSubmit } = useForm()

  const handleUploadDocument = async (key: string, file: File) => {
    setIsLoadFile(key)

    const body: any = {
      bucket: 'nodewave',
      directory: `tender/document-review`,
      file: file
    }

    // @ts-ignore
    const res = await dispatch(uploadToStorage({ data: body }))

    if (res.meta.requestStatus !== 'fulfilled') {
      throw new Error(res.payload.response.data.message)
    }

    setValue(key, res.payload.content.fileUrl)
    setIsLoadFile('')
  }

  const handleCreate = handleSubmit(async (value: any) => {
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

      router.back()
    })
  })

  return (
    <Card>
      <HeaderPage title='Buat Pengajuan Legalisir Ijazah' isDetail={true} />

      <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
        <form action='submit' onSubmit={handleCreate}>
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
                        Maksimal Jumlah Legalisir Ijazah yang dapat diajukan adalah 10 (sepuluh) buah.
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
                        Biaya legalisir ijazah adalah sebesar Rp. 10.000,- per buah.
                      </Typography>
                      </li>
                    <li>
                      <Typography variant='body2'>
                        Untuk wilayah banda aceh dan aceh besar, diwajibkan untuk melakukan pengambilan di fakultas pertanian
                      </Typography>
                    </li>
                    <li>
                      <Typography variant='body2'>
                        Untuk di luar banda aceh, aceh besar serta termasuk wilayah diluar aceh, pengambilan ijazah akan dilakukan melalui jasa kurir.
                      </Typography>
                      <li>
                        <Typography variant='body2'>
                         Pilih jasa pengiriman pos untuk wilayah selain banda aceh dan aceh besar.
                        </Typography>
                      </li>
                      <li>
                        <Typography variant='body2'>
                          Pilih ambil langsung untuk wilayah banda aceh dan aceh besar.
                        </Typography>
                      </li>
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
                      Informasi Pembayaran
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
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <ActionPage isLoading={isLoading} />
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateContainer
