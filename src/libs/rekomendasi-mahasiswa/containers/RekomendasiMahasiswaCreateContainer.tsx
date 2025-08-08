// import React from 'react'
// import { Card, CardContent, Typography, Grid, Divider } from '@mui/material'
// import 'react-datepicker/dist/react-datepicker.css'
// import { useRouter } from 'next/router'
// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import toast from 'react-hot-toast'
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
// import { useDispatch } from 'react-redux'
// import { createRekomendasiMahasiswa } from 'src/stores/rekomendasi-mahasiswa/rekomendasiMahasiswaAction'
// import HeaderPage from 'src/components/shared/header-page'
// import FormSection from '../components/form'
// import ActionPage from 'src/components/shared/action-page'
// import { uploadToStorage } from 'src/stores/storage/storageAction'

// const RekomendasiMahasiswaCreateContainer = () => {
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const { handleSubmit, control, setValue } = useForm()

//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [isLoadFile, setIsLoadFile] = useState<string>('')

//   const handleUploadDocument = async (key: string, file: File) => {
//     setIsLoadFile(key)

//     const body: any = {
//       bucket: 'nodewave',
//       directory: `rekomendasi-mahasiswa/documents`,
//       file: file
//     }

//     // @ts-ignore
//     const res = await dispatch(uploadToStorage({ data: body }))

//     if (res.meta.requestStatus !== 'fulfilled') {
//       throw new Error(res.payload.response.data.message)
//     }

//     setValue(key, res.payload.content.fileUrl)
//     setIsLoadFile('')
//   }

//   const onSubmit = handleSubmit(async (value: any) => {
//     setIsLoading(true)
//     toast.loading('Waiting ...')

//     const body: any = {
//       tipeRekomendasi: value?.tipeRekomendasi,
//       keperluan: value?.keperluan,
//       dokumenPendukungUrl: value?.dokumenPendukungUrl
//     }

//     // @ts-ignore
//     await dispatch(createRekomendasiMahasiswa({ data: body })).then((res: any) => {
//       if (res?.meta?.requestStatus !== 'fulfilled') {
//         setIsLoading(false)
//         toast.dismiss()
//         toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

//         return
//       }

//       setIsLoading(false)
//       toast.dismiss()
//       toast.success(res?.payload?.message)

//       router.back()
//     })
//   })

//   return (
//     <>
//       <Card>
//         <HeaderPage title='Buat Rekomendasi Mahasiswa' isDetail={true} />

//         <CardContent style={{ padding: '16px 48px', borderBottom: '1px solid #f4f4f4' }}>
//           <form action='submit' onSubmit={onSubmit}>
//             <Grid container spacing={4} direction='row'>
//               <Grid item xs={6}>
//                 <FormSection control={control} handleUploadDocument={handleUploadDocument} isLoadFile={isLoadFile} />
//               </Grid>

//               <Grid item xs={6}>
//                 <Card
//                   variant='outlined'
//                   sx={{ padding: '16px', backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.12) }}
//                 >
//                   <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
//                     Perhatikan Informasi Berikut :
//                   </Typography>
//                   <Typography variant='body2'>
//                     Pastikan dokumen yang diupload sesuai dengan ketentuan yang berlaku. Surat rekomendasi akan diproses
//                     setelah semua dokumen persyaratan lengkap dan telah diverifikasi oleh pihak akademik.
//                   </Typography>
//                 </Card>
//               </Grid>

//               <Grid item xs={12}>
//                 <Divider />
//               </Grid>

//               <Grid item xs={12}>
//                 <ActionPage isLoading={isLoading} />
//               </Grid>
//             </Grid>
//           </form>
//         </CardContent>
//       </Card>
//     </>
//   )
// }

// export default RekomendasiMahasiswaCreateContainer
