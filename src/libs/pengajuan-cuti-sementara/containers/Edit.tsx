import React, { useEffect } from 'react'
import { Card, CardContent, Typography, Grid, Divider } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useDispatch } from 'react-redux'
import HeaderPage from 'src/components/shared/header-page'
import { uploadToStorage } from 'src/stores/storage/storageAction'
import ActionPage from 'src/components/shared/action-page'
import {
  getTemporaryLeaveRequest,
  updateTemporaryLeaveRequest
} from 'src/stores/temporary-leave-request/temporaryLeaveRequestAction'
import FormSection from '../components/form'

const EditContainer = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query as { id: string }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadFile, setIsLoadFile] = useState<string>('')

  const [data, setData] = useState<any>(null)

  const { setValue, handleSubmit, control } = useForm<any>({
    values: {
      suratPersetujuanOrangTua: data?.suratIzinOrangTuaUrl,
      suratBebasPustaka: data?.suratBebasPustakaUrl,
      suratBss: data?.suratBssUrl,
      reason: data?.alasanPengajuan
    }
  })

  const handleGetData = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getTemporaryLeaveRequest({ id })).then((res: any) => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        return
      }

      setData(res.payload.content)
      setIsLoading(false)
    })
  }

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

    const body: any = {
      suratIzinOrangTuaUrl: value?.suratPersetujuanOrangTua,
      suratBebasPustakaUrl: value?.suratBebasPustaka,
      suratBssUrl: value?.suratBss,
      alasanPengajuan: value?.reason
    }

    // @ts-ignore
    await dispatch(updateTemporaryLeaveRequest({ data: body, id })).then((res: any) => {
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

  useEffect(() => {
    handleGetData()
  }, [id])

  return (
    <>
      <Card>
        <HeaderPage title='Edit Pengajuan Cuti Sementara' isDetail={true} />

        <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
          <form action='submit' onSubmit={onSubmit}>
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
                    Perhatikan Informasi Berikut :
                  </Typography>
                  <Typography variant='body2'>
                    Mohon di perhatikan!! Bagi Mahasiswa yang sudah mengambil Cuti pada semester lalu, tidak dapat
                    mengambil cuti lagi. Dikarenakan peraturan yang diterbitkan oleh universitas, Mahasiswa Tidak dapat
                    mengambil cuti secara berturut - turut.
                  </Typography>
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
    </>
  )
}

export default EditContainer
