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
  IconButton
} from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import { CreateCutiPayload } from '../consts/payload'
import { createTemporaryLeaveRequest } from 'src/stores/temporary-leave-request/temporaryLeaveRequestAction'

const TemporaryLeaveRequestCreateContainer = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { watch, setValue, handleSubmit } = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCreate = async (value: any) => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    const body: CreateCutiPayload = {
      suratPersetujuanOrangTuaUrl: value?.suratPersetujuanOrangTua[0]?.previewUrl,
      bebasPustakaUrl: value?.suratBebasPustaka[0]?.previewUrl,
      bssFormUrl: value?.suratBss[0]?.previewUrl,
      reason: value?.reason
    }

    // @ts-ignore
    await dispatch(createTemporaryLeaveRequest({ data: body })).then((res: any) => {
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

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => router.back}>
                <Icon icon='ic:baseline-arrow-back' />
              </IconButton>
              <Typography variant='h5'>Buat Pengajuan Cuti</Typography>
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
                    Upload Surat Persetujuan Orang Tua
                  </Typography>
                  <Grid style={{ marginTop: '10px' }}>
                    <TextField
                      fullWidth
                      type='file'
                      inputProps={{ accept: 'application/pdf' }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files
                        if (files) {
                          const newFiles: any[] = Array.from(files).map(file => ({
                            previewUrl: URL.createObjectURL(file),
                            file: file
                          }))

                          setValue('suratPersetujuanOrangTua', [...newFiles])
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                    Upload Surat Bebas Pustaka
                  </Typography>
                  <Grid style={{ marginTop: '10px' }}>
                    <TextField
                      fullWidth
                      type='file'
                      inputProps={{ accept: 'application/pdf' }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files
                        if (files) {
                          const newFiles: any[] = Array.from(files).map(file => ({
                            previewUrl: URL.createObjectURL(file),
                            file: file
                          }))

                          setValue('suratBebasPustaka', [...newFiles])
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                    Upload Formulir BSS
                  </Typography>
                  <Grid style={{ marginTop: '10px' }}>
                    <TextField
                      fullWidth
                      type='file'
                      inputProps={{ accept: 'application/pdf' }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files
                        if (files) {
                          const newFiles: any[] = Array.from(files).map(file => ({
                            previewUrl: URL.createObjectURL(file),
                            file: file
                          }))

                          setValue('suratBss', [...newFiles])
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                    Alasan Pengambilan Cuti
                  </Typography>
                  <Grid style={{ marginTop: '10px' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      type='text'
                      placeholder='Masukan Alasan Pengambilan Cuti'
                      value={watch('reason') ?? ''}
                      onChange={e => setValue('reason', e.target.value)}
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
                  Mohon di perhatikan!! Bagi Mahasiswa yang sudah mengambil Cuti pada semester lalu, tidak dapat
                  mengambil cuti lagi. Dikarenan peraturan yang diterbitkan oleh universitas Mahasiswa Tidak dapat
                  mengambil cuti secara berturut - turut.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', pt: 4 }}>
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

export default TemporaryLeaveRequestCreateContainer
