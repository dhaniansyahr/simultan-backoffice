import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Divider } from '@mui/material'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import {
  getRekomendasiBeasiswa,
  updateRekomendasiBeasiswa
} from 'src/stores/rekomendasi-beasiswa/rekomendasiBeasiswaAction'
import HeaderPage from 'src/components/shared/header-page'
import FormSection from '../components/form'
import ActionPage from 'src/components/shared/action-page'
import LoadData from 'src/components/shared/load-data'
import { uploadToStorage } from 'src/stores/storage/storageAction'

const RekomendasiBeasiswaEditContainer = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { id } = router.query as { id: string }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadFile, setIsLoadFile] = useState<string>('')
  const [isLoadData, setIsLoadData] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

  const { handleSubmit, control, setValue } = useForm<any>({
    values: {
      tipeRekomendasi: data?.tipeRekomendasi,
      institusiTujuan: data?.institusiTujuan,
      deskripsi: data?.deskripsi,
      dokumenPendukung: data?.dokumenPendukung
    }
  })

  const handleUploadDocument = async (key: string, file: File) => {
    setIsLoadFile(key)

    const body: any = {
      bucket: 'nodewave',
      directory: `rekomendasi-beasiswa/documents`,
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

  const handleGetData = async () => {
    setIsLoadData(true)

    // @ts-ignore
    await dispatch(getRekomendasiBeasiswa({ id })).then((res: any) => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoadData(false)
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        return
      }

      const content = res.payload?.content
      setData(content)

      // Set form values
      setValue('tipeRekomendasi', content?.tipeRekomendasi)
      setValue('institusiTujuan', content?.institusiTujuan)
      setValue('deskripsi', content?.deskripsi)
      setValue('dokumenPendukung', content?.dokumenPendukung)

      setIsLoadData(false)
    })
  }

  useEffect(() => {
    if (id) {
      handleGetData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    const body: any = {
      tipeRekomendasi: value?.tipeRekomendasi,
      institusiTujuan: value?.institusiTujuan,
      deskripsi: value?.deskripsi,
      dokumenPendukung: value?.dokumenPendukung || ''
    }

    // @ts-ignore
    await dispatch(updateRekomendasiBeasiswa({ data: body, id })).then((res: any) => {
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
        <HeaderPage title='Edit Rekomendasi Beasiswa' isDetail={true} />

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
                      <Typography variant='body2'>
                        Pastikan dokumen yang diupload sesuai dengan ketentuan yang berlaku. Perubahan data akan
                        diproses setelah semua dokumen persyaratan lengkap dan telah diverifikasi ulang oleh pihak
                        akademik.
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <ActionPage isLoading={isLoading} />
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default RekomendasiBeasiswaEditContainer
