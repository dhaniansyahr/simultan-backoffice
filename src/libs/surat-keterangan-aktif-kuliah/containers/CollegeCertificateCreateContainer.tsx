import React from 'react'
import { Card, CardContent, List, Typography, Grid, ListItem, Divider } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import { createCollegeCertificate } from 'src/stores/college-certificate/collegeCertificateAction'
import HeaderPage from 'src/components/shared/header-page'
import { uploadToStorage } from 'src/stores/storage/storageAction'
import AddForm from '../components/form/add'
import ActionPage from 'src/components/shared/action-page'

const CollegeCertificateCreate = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { setValue, handleSubmit, control } = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isLoadFile, setIsLoadFile] = useState<boolean>(false)

  const handleUploadDocument = async (key: string, file: File) => {
    setIsLoadFile(true)

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
    setIsLoadFile(false)
  }

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    const body: any = Object.assign({}, value)

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
  })

  return (
    <>
      <Card>
        <HeaderPage title='Buat Pengajuan Surat Keterangan Aktif Kuliah' isDetail={true} />

        <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
          <form action='submit' onSubmit={onSubmit}>
            <Grid container spacing={4} direction='row'>
              <Grid item xs={6}>
                <AddForm control={control} handleUploadDocument={handleUploadDocument} isLoadFile={isLoadFile} />
              </Grid>

              <Grid item xs={6}>
                <Card
                  variant='outlined'
                  sx={{ padding: '16px', backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.12) }}
                >
                  <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Perhatikan Informasi Berikut :
                  </Typography>
                  <Typography variant='body2'>
                    Bagi Mahasiswa yang orangtua-nya sudah pensiun , surat KP4 diganti dengan foto kopi SK surat pensiun
                    orangtua yang bersangkutan. Bagi Mahasiswa yang orangtua-nya pegawai swasta , surat KP4 diganti
                    dengan surat keterangan dari perusahaan.
                  </Typography>
                  <List>
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                      <Typography variant='body2'>1. KP4 : Untuk orangtua-nya PNS dan belum pensiun</Typography>
                    </ListItem>
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                      <Typography variant='body2'>
                        2. SURAT PENSIUN : Untuk Penganti KP4 yang orangtua-nya sudah pensiun
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                      <Typography variant='body2'>
                        3. SURAT KETERANGAN PERUSAHAAN (SKP) : Untuk yang orangtua-nya pegawai swasta
                      </Typography>
                    </ListItem>
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <ActionPage isLoading={isLoading} />
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default CollegeCertificateCreate
