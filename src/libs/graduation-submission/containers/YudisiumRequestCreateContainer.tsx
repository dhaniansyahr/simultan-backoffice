import React, { ChangeEvent } from 'react'
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Grid,
  CardActions,
  InputLabel,
  List,
  ListItem,
  IconButton
} from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import toast from 'react-hot-toast'
import { createGraduationSubmission } from 'src/stores/graduation-submission/graduationSubmissionAction'

const YudisiumRequestCreate = () => {
  const dispatch: AppDispatch = useDispatch()
  const router: NextRouter = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileSelected, setFileSelected] = useState<any[]>([])

  const handleCreate = async () => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    if (fileSelected?.length === 0) {
      setIsLoading(false)
      toast.dismiss()
      toast.error('Mohon Input Berkas Pengajuan Yudisium, Terlebih Dahulu!')

      return
    }

    const body: any = {
      dokumenUrl: fileSelected[0]?.previewUrl
    }

    // @ts-ignore
    await dispatch(createGraduationSubmission({ data: body })).then((res: any) => {
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
              <IconButton
                onClick={() => router.back()}
                sx={{
                  '&:hover': {
                    transform: 'translateX(-5px)',
                    transition: 'transform 0.2s ease'
                  }
                }}
              >
                <Icon icon='ic:baseline-arrow-back' />
              </IconButton>
              <Typography variant='h5'>Buat Pengajuan Yudisium</Typography>
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
                  Kumpulkan Semua Berkas Untuk Keperluan Yudisium dan Upload Berkas tersebut disini, Adapun Prosedur
                  Yudisium Sebagai Berikut:
                </Typography>
                <List>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>
                      1. Mahasiswa mengambil formulir distribusi skripsidi sub bagian akademik fakultas, dan
                      Mendistribusikan Skripsi
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>
                      2. Mahasiswa mengambil formulir bebas laboraturium dijurusan dan melengkapinya
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>
                      3. Mahasiswa meminta bukti bebas dari perpustakaan unsyiah, bebas dari perpustakaan wilayah
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>
                      4. Mahasiswa melihat jadwal pendaftaran yudisium difakultas/jurusan masing masing, dan mengambil
                      formulir biodata di sub bagian akademik fakultas
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant='body2'>
                      4. Mahasiswa mengumpulkan semua berkas persyaratam dan diserahkan pada sub bagian akademik
                      fakultas
                    </Typography>
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
              sx={{
                padding: { sm: '5px 20px', xs: '5px 15px' },
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  animation: 'bounce 0.5s infinite'
                },
                '@keyframes bounce': {
                  '0%, 100%': {
                    transform: 'translateY(0)'
                  },
                  '50%': {
                    transform: 'translateY(-5px)'
                  }
                }
              }}
              onClick={handleCreate}
            >
              Simpan
            </Button>
          </Box>
        </CardActions>
      </Card>
    </>
  )
}

export default YudisiumRequestCreate
