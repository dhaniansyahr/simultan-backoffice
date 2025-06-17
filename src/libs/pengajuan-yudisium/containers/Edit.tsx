import React, { useEffect } from 'react'
import { Card, CardContent, Typography, Grid, Divider } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import toast from 'react-hot-toast'
import {
  getGraduationSubmission,
  updateGraduationSubmission
} from 'src/stores/graduation-submission/graduationSubmissionAction'
import HeaderPage from 'src/components/shared/header-page'
import FormSection from '../components/form'
import { useForm } from 'react-hook-form'
import { uploadToStorage } from 'src/stores/storage/storageAction'
import ActionPage from 'src/components/shared/action-page'
import LoadData from 'src/components/shared/load-data'

const EditContainer = () => {
  const dispatch: AppDispatch = useDispatch()
  const router: NextRouter = useRouter()

  const { id } = router.query as { id: string }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadFile, setIsLoadFile] = useState<string>('')
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false)

  const [data, setData] = useState<any>(null)

  const { control, handleSubmit, setValue } = useForm<any>({
    values: {
      suratPendaftaran: data?.suratPendaftaran,
      suratBebasLab: data?.suratBebasLab,
      suratBebasPerpustakaan: data?.suratBebasPerpustakaan,
      suratDistribusiSkripsi: data?.suratDistribusiSkripsi,
      suratPendaftaranIka: data?.suratPendaftaranIka
    }
  })

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

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    const body: any = Object.assign({}, value)

    // @ts-ignore
    await dispatch(updateGraduationSubmission({ data: body, id })).then((res: any) => {
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
    setIsLoadingData(true)

    // @ts-ignore
    await dispatch(getGraduationSubmission({ id })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        setIsLoadingData(false)
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        return
      }

      setIsLoadingData(false)
      setData(res?.payload?.content)
    })
  }

  useEffect(() => {
    handleGetData()
  }, [id])

  return (
    <>
      <Card>
        <HeaderPage title='Edit Pengajuan Yudisium' isDetail={true} />

        {isLoadingData ? (
          <LoadData />
        ) : (
          <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
            <form onSubmit={onSubmit}>
              <Grid container spacing={4} direction='row'>
                <Grid item xs={6}>
                  <FormSection control={control} handleUploadDocument={handleUploadDocument} isLoadFile={isLoadFile} />
                </Grid>

                <Grid item xs={6}>
                  <Card
                    variant='outlined'
                    sx={{ padding: '16px', backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.12) }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                      Perhatikan Informasi Berikut:
                    </Typography>
                    <Typography variant='body2'>
                      Kumpulkan Semua Berkas Untuk Keperluan Yudisium dan Upload Berkas tersebut disini, Adapun Prosedur
                      Yudisium Sebagai Berikut:
                    </Typography>

                    <ul>
                      <li>
                        <Typography variant='body2'>
                          Mahasiswa mengambil formulir distribusi skripsidi sub bagian akademik fakultas, dan
                          Mendistribusikan Skripsi
                        </Typography>
                      </li>

                      <li>
                        <Typography variant='body2'>
                          Mahasiswa mengambil formulir bebas laboraturium dijurusan dan melengkapinya
                        </Typography>
                      </li>
                      <li>
                        <Typography variant='body2'>
                          Mahasiswa meminta bukti bebas dari perpustakaan unsyiah, bebas dari perpustakaan wilayah
                        </Typography>
                      </li>
                      <li>
                        <Typography variant='body2'>
                          Mahasiswa melihat jadwal pendaftaran yudisium difakultas/jurusan masing masing, dan mengambil
                          formulir biodata di sub bagian akademik fakultas
                        </Typography>
                      </li>
                      <li>
                        <Typography variant='body2'>
                          Mahasiswa mengumpulkan semua berkas persyaratam dan diserahkan pada sub bagian akademik
                          fakultas
                        </Typography>
                      </li>
                    </ul>
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
        )}
      </Card>
    </>
  )
}

export default EditContainer
