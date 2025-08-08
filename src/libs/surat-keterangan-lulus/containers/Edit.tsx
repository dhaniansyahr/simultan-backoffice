import React, { useEffect } from 'react'
import { Card, CardContent, List, Typography, Grid, ListItem, Divider } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import {
  getSuratKeteranganLulus,
  updateSuratKeteranganLulus
} from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusAction'
import HeaderPage from 'src/components/shared/header-page'
import { uploadToStorage } from 'src/stores/storage/storageAction'
import FormSection from '../components/form'
import ActionPage from 'src/components/shared/action-page'
import LoadData from 'src/components/shared/load-data'

const EditContainer = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadFile, setIsLoadFile] = useState<string>('')
  const [isLoadData, setIsLoadData] = useState<boolean>(false)

  const { id } = router.query as { id: string }
  const [data, setData] = useState<any>(null)

  const { setValue, handleSubmit, control } = useForm<any>({
    values: {
      tipeSurat: data?.tipeSurat,
      dokumenTranskrip: data?.dokumenTranskrip,
      deskripsi: data?.deskripsi
    }
  })

  const handleUploadDocument = async (key: string, file: File) => {
    setIsLoadFile(key)

    const body: any = {
      bucket: 'nodewave',
      directory: `surat-keterangan-lulus/documents`,
      file: file
    }

    try {
      // @ts-ignore
      const res = await dispatch(uploadToStorage({ data: body }))

      if (res.meta.requestStatus !== 'fulfilled') {
        throw new Error(res.payload.response.data.message)
      }

      setValue(key, res.payload.content.fileUrl)
      setIsLoadFile('')
    } catch (error: any) {
      setIsLoadFile('')
      toast.error(error.message || 'Gagal upload dokumen')
    }
  }

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)
    toast.loading('Memperbarui data...')

    const body: any = Object.assign({}, value)

    // @ts-ignore
    await dispatch(updateSuratKeteranganLulus({ data: body, id })).then((res: any) => {
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

  const handleGetData = async () => {
    setIsLoadData(true)

    // @ts-ignore
    await dispatch(getSuratKeteranganLulus({ id })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        setIsLoadData(false)
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        return
      }

      setData(res?.payload?.content)
      setIsLoadData(false)
    })
  }

  useEffect(() => {
    if (id) {
      handleGetData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <>
      <Card>
        <HeaderPage title='Edit Pengajuan Surat Keterangan Lulus' isDetail={true} />

        <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
          <form action='submit' onSubmit={onSubmit}>
            <Grid container spacing={4} direction='row'>
              {isLoadData ? (
                <Grid item xs={12}>
                  <LoadData />
                </Grid>
              ) : (
                <>
                  <Grid item xs={6}>
                    <FormSection
                      control={control}
                      handleUploadDocument={handleUploadDocument}
                      isLoadFile={isLoadFile}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Card
                      variant='outlined'
                      sx={{ padding: '16px', backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.12) }}
                    >
                      <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        Perhatikan Informasi Berikut :
                      </Typography>
                      <Typography variant='body2' sx={{ marginBottom: '16px' }}>
                        Surat Keterangan Lulus adalah dokumen resmi yang menyatakan bahwa mahasiswa telah menyelesaikan
                        seluruh program studi dan dinyatakan lulus dari perguruan tinggi.
                      </Typography>
                      <List>
                        <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', py: 1 }}>
                          <Typography variant='body2'>
                            1. <strong>Transkrip Nilai:</strong> Upload transkrip nilai resmi yang telah dilegalisir
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', py: 1 }}>
                          <Typography variant='body2'>
                            2. <strong>Tipe Surat:</strong> Pilih tujuan penggunaan surat (bekerja, melanjutkan studi,
                            beasiswa, dll)
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', py: 1 }}>
                          <Typography variant='body2'>
                            3. <strong>Deskripsi:</strong> Jelaskan secara detail keperluan surat keterangan lulus
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', py: 1 }}>
                          <Typography variant='body2'>
                            4. <strong>Format File:</strong> PDF, DOC, atau DOCX dengan maksimal ukuran 2MB
                          </Typography>
                        </ListItem>
                      </List>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <ActionPage isLoading={isLoading} />
                </>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default EditContainer
