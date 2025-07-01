import { LoadingButton } from '@mui/lab'
import { CircularProgress, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import { getDocument } from 'src/utils'

interface FormLegalisirIjazahProps {
  control: Control
  handleUploadDocument: (key: string, file: File) => void
  isLoadFile: string
}

interface OpsiPengambilan {
  value: string
  label: string
}

const FormLegalisirIjazah = ({ control, handleUploadDocument, isLoadFile }: FormLegalisirIjazahProps) => {
  const { user } = useAuth()
  const [opsiPengambilan, setOpsiPengambilan] = useState<OpsiPengambilan[]>([])
  const [isLoadingOpsi, setIsLoadingOpsi] = useState(false)

  const handleGetOpsiPengambilan = async () => {
    setIsLoadingOpsi(true)
    try {
      setOpsiPengambilan([
        { value: 'Via_POS', label: 'Via POS' },
        { value: 'Ambil_Langsung_DiFakultas', label: 'Ambil Langsung Di Fakultas' }
      ])
    } catch (error) {
      console.error('Error fetching opsi pengambilan:', error)
      setOpsiPengambilan([
        { value: 'Via_POS', label: 'Via POS' },
        { value: 'Ambil_Langsung_DiFakultas', label: 'Ambil Langsung Di Fakultas' }
      ])
    } finally {
      setIsLoadingOpsi(false)
    }
  }

  useEffect(() => {
    handleGetOpsiPengambilan()
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Controller
          control={control}
          name='totalLegalisir'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                Jumlah Legalisir
              </Typography>

              <TextField
                placeholder='Jumlah Legalisir'
                fullWidth
                type='number'
                inputProps={{
                  min: 1,
                  pattern: '[0-9]*',
                  max: 10
                }}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onChange={e => {
                  const value = parseInt(e.target.value)
                  if (value > 10) {
                    field.onChange(10)
                  } else {
                    field.onChange(value)
                  }
                }}
                value={field.value}
                error={!!errors.totalLegalisir}
                helperText={errors.totalLegalisir?.message as string}
              />
            </>
          )}
          rules={{
            required: 'Jumlah Legalisir harus diisi',
            max: {
              value: 10,
              message: 'Maksimal jumlah legalisir adalah 10'
            }
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
          Data Informasi Pembayaran
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='namaBank'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                Nama Bank
              </Typography>

              <TextField
                placeholder='Masukan Nama Bank'
                fullWidth
                {...field}
                error={!!errors.namaBank}
                helperText={errors.namaBank?.message as string}
              />
            </>
          )}
          rules={{ required: 'Nama Bank harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='namaRekening'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                Nama Rekening
              </Typography>

              <TextField
                placeholder='Masukan Nama sesuai rekening bank'
                fullWidth
                {...field}
                error={!!errors.namaRekening}
                helperText={errors.namaRekening?.message as string}
              />
            </>
          )}
          rules={{ required: 'Nama Rekening harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='nomorRekening'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                Nomor Rekening
              </Typography>

              <TextField
                placeholder='Masukan Nomor Rekening'
                fullWidth
                type='number'
                inputProps={{
                  min: 1,
                  pattern: '[0-9]*'
                }}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                {...field}
                error={!!errors.nomorRekening}
                helperText={errors.nomorRekening?.message as string}
              />
            </>
          )}
          rules={{ required: 'Nomor Rekening harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='buktiPembayaran'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Bukti Pembayaran
              </Typography>
              <TextField
                fullWidth
                value={field.value ? field.value.split('/').pop().replace(/%20/g, ' ') : 'Pilih file'}
                inputProps={{
                  readOnly: true
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#fff'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <LoadingButton
                      sx={{ whiteSpace: 'nowrap' }}
                      variant='outlined'
                      color='primary'
                      onClick={async () => {
                        const file = await getDocument(`bukti_pembayaran_${user?.nomorIdentitas}`, 'image/*')

                        console.log(file)

                        if (file) {
                          handleUploadDocument('buktiPembayaran', file)
                        }
                      }}
                      loading={isLoadFile === 'buktiPembayaran'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
                helperText={'Format file: JPG, JPEG, PNG; Max 10 MB'}
              />
              {errors.buktiPembayaran && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.buktiPembayaran.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Bukti Pembayaran harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='buktiIjazah'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Ijazah
              </Typography>
              <TextField
                fullWidth
                value={field.value ? field.value.split('/').pop()?.replace(/%20/g, ' ') : 'Pilih file'}
                inputProps={{
                  readOnly: true
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#fff'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <LoadingButton
                      sx={{ whiteSpace: 'nowrap' }}
                      variant='outlined'
                      color='primary'
                      onClick={async () => {
                        const file = await getDocument(`bukti_ijazah_${user?.nomorIdentitas}`, 'image/*')

                        console.log(file)

                        if (file) {
                          handleUploadDocument('buktiIjazah', file)
                        }
                      }}
                      loading={isLoadFile === 'buktiIjazah'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
                helperText={'Format file: JPG, JPEG, PNG; Max 10 MB'}
              />
              {errors.buktiIjazah && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.buktiIjazah.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Ijazah harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='tempatPengambilan'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                Tempat Pengambilan
              </Typography>
              <Select
                fullWidth
                value={field.value}
                onChange={field.onChange}
                displayEmpty
                disabled={isLoadingOpsi}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value='' disabled>
                  <em>{isLoadingOpsi ? 'Loading...' : 'Pilih Tempat Pengambilan Legalisir Ijazah'}</em>
                </MenuItem>
                {opsiPengambilan.map(opsi => (
                  <MenuItem key={opsi.value} value={opsi.value}>
                    {opsi.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.tempatPengambilan && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.tempatPengambilan.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Tempat pengambilan harus dipilih' }}
        />
      </Grid>
    </Grid>
  )
}

export default FormLegalisirIjazah
