import React, { ChangeEvent } from 'react'
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  List,
  Typography,
  Grid,
  Autocomplete,
  CardActions,
  ListItem,
  InputLabel
} from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import { createCollegeCertificate } from 'src/stores/college-certificate/collegeCertificateAction'
import { uploadToStorage } from 'src/stores/storage/storageAction'
import { tipeSurat } from '../consts'

const CollegeCertificateCreate = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { watch, setValue, handleSubmit, reset } = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileSelected, setFileSelected] = useState<any>(null)

  const handleFileUpload = async (file: any) => {
    const body: any = {
      part: 'BOOTCAMP',
      files: file
    }

    // @ts-ignore
    const res: any = await dispatch(uploadToStorage({ data: body }))

    if (res?.meta?.requestStatus !== 'fulfilled') {
      setIsLoading(false)
      toast.error(res?.payload?.response?.message)

      return
    }

    return res.payload?.data
  }

  const handleCreate = async (value: any, id: any) => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    const body: any = {
      type: value?.tipe?.value,
      fileUrl: fileSelected[0]?.previewUrl,
      description: value?.description
    }

    // @ts-ignore
    await dispatch(createCollegeCertificate({ data: body })).then((res: any) => {
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
  }

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles: any[] = Array.from(files).map(file => ({
        previewUrl: URL.createObjectURL(file),
        file: file
      }))

      setFileSelected([...newFiles])
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Icon
                onClick={() => router.back}
                icon='ic:baseline-arrow-back'
                style={{ marginRight: '8px', fontSize: '24px', cursor: 'pointer' }}
              />
              <Typography variant='h5'>Buat Surat Keterangan Aktif Kuliah</Typography>
            </Box>
          }
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' },
            borderBottom: '1px solid #f4f4f4'
          }}
        />

        <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
          <Grid container spacing={4} direction='row'>
            {/* Form Section */}
            <Grid item xs={6}>
              <Grid container spacing={4} direction='column'>
                <Grid item xs={6}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Tipe Berkas yang diupload
                  </Typography>
                  <Grid style={{ marginTop: '10px' }}>
                    <Autocomplete
                      options={tipeSurat ?? []}
                      getOptionLabel={(option: any) => option.label}
                      value={watch('tipe')}
                      onChange={(e: any, value: any) => {
                        setValue('tipe', value)
                      }}
                      renderInput={params => (
                        <TextField {...params} label='Pilih Tipe Surat' required placeholder='Tipe Surat' fullWidth />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                    Deskripsi Keperluan
                  </Typography>
                  <Grid style={{ marginTop: '10px' }}>
                    <TextField
                      fullWidth
                      required
                      label='Tulis Deskripsi Keperluan'
                      placeholder='Deskripsi Keperluan'
                      value={watch('description')}
                      onChange={e => setValue('description', e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                    Upload Berkas
                  </Typography>
                  <Grid style={{ marginTop: '10px' }}>
                    <Box
                      sx={{
                        mb: -2,
                        ml: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <InputLabel
                        sx={{
                          px: 2,
                          position: 'relative',
                          fontSize: '12px',
                          background: '#ffffff',
                          zIndex: 2
                        }}
                      >
                        File
                      </InputLabel>
                    </Box>
                    <TextField
                      fullWidth
                      type='file'
                      inputProps={{ accept: 'application/pdf' }}
                      onChange={(e: any) => handleChangeFile(e)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Card
                variant='outlined'
                sx={{ padding: '16px', backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.12) }}
              >
                <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  Informations
                </Typography>
                <Typography variant='body2'>
                  Bagi Mahasiswa yang orang tua nya sudah pensiun , surat KP4 diganti dengan fotocopy SK surat pensiun
                  orang tua yang bersangkutan. Bagi Mahasiswa yang orang tua nya pegawai swasta , surat KP4 diganti
                  dengan surat ketengan dari perusahaan
                </Typography>
                <List>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>1. KP4</Typography>
                    <Typography variant='body2'>Untuk Orang tua nya PNS dan belum pensiun</Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>2. SURAT PENSIUN</Typography>
                    <Typography variant='body2'>Untuk Penganti KP4 yang orang tua nya sudah pensiun</Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>3. SURAT KETENGAN PERUSAHAAN</Typography>
                    <Typography variant='body2'>Untuk orang tua nya pegawai swasta </Typography>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button
              variant='contained'
              color='secondary'
              size='medium'
              disabled={isLoading}
              sx={{ padding: { sm: '5px 20px', xs: '5px 15px' }, marginRight: 1 }}
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={isLoading}
              sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
              onClick={handleSubmit(handleCreate)}
            >
              Simpan
            </Button>
          </Box>
        </CardActions>
      </Card>
    </>
  )
}

export default CollegeCertificateCreate
