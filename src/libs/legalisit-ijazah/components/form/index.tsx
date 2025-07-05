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

  const [totalHarga, setTotalHarga] = useState<number>(0)

  // Price per unit
  const HARGA_SATUAN = 2500

  // Function to calculate total price
  const calculateTotalPrice = (quantity: number): number => {
    return quantity * HARGA_SATUAN
  }

  // Function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

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

              <Select
                fullWidth
                value={field.value || ''}
                onChange={e => {
                  field.onChange(e)

                  const quantity = Number(e.target.value)
                  if (quantity > 0) {
                    setTotalHarga(calculateTotalPrice(quantity))
                  } else {
                    setTotalHarga(0)
                  }
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                error={!!errors.totalLegalisir}
              >
                <MenuItem value='' disabled>
                  <em>Pilih Jumlah Legalisir</em>
                </MenuItem>
                <MenuItem value={5}>5 Lembar</MenuItem>
                <MenuItem value={10}>10 Lembar</MenuItem>
                <MenuItem value={15}>15 Lembar</MenuItem>
                <MenuItem value={20}>20 Lembar</MenuItem>
              </Select>
              {errors.totalLegalisir && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.totalLegalisir.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{
            required: 'Jumlah Legalisir harus diisi'
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
          Harga Satuan
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          {formatCurrency(HARGA_SATUAN)} per lembar
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
          Total Harga
        </Typography>
        <Typography
          variant='h6'
          sx={{
            color: totalHarga > 0 ? 'primary.main' : 'text.secondary',
            fontWeight: 'bold'
          }}
        >
          {totalHarga > 0 ? formatCurrency(totalHarga) : 'Rp 0'}
        </Typography>
      </Grid>

      {/* Hidden field to store total price */}
      <Grid item xs={12} sx={{ display: 'none' }}>
        <Controller
          control={control}
          name='totalHarga'
          render={({ field }) => (
            <TextField
              {...field}
              value={totalHarga}
              onChange={() => {}} // Read-only, controlled by totalLegalisir
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: '10px' }}>
          Data Informasi Pembayaran
        </Typography>
      </Grid>

      {/* <Grid item xs={12}>
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
      </Grid> */}

      {/* <Grid item xs={12}>
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
      </Grid> */}

      {/* <Grid item xs={12}>
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
      </Grid> */}

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
            error={!!errors.tempatPengambilan}
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
          <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
            Pilih Via POS jika ingin dikirim ke alamat atau Ambil Langsung jika ingin mengambil di fakultas
          </Typography>
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

      {/* Show upload form when Via POS is selected */}
      <Controller
        control={control}
        name='tempatPengambilan'
        render={({ field }) =>
          field.value === 'Via_POS' ? (
            <Grid item xs={12}>
              <Controller
                control={control}
                name='buktiPembayaranOngkir'
                render={({ field: uploadField, formState: { errors } }) => (
                  <>
                    <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                      Upload Bukti Biaya Pengiriman
                    </Typography>
                    <TextField
                      fullWidth
                      value={
                        uploadField.value ? uploadField.value.split('/').pop()?.replace(/%20/g, ' ') : 'Pilih file'
                      }
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
                              const file = await getDocument(
                                `bukti_biaya_pengiriman_${user?.nomorIdentitas}`,
                                'image/*'
                              )

                              if (file) {
                                handleUploadDocument('buktiPembayaranOngkir', file)
                              }
                            }}
                            loading={isLoadFile === 'buktiPembayaranOngkir'}
                            disabled={isLoadFile !== ''}
                            loadingIndicator={<CircularProgress size={20} />}
                          >
                            Pilih File
                          </LoadingButton>
                        )
                      }}
                      helperText={'Format file: JPG, JPEG, PNG; Max 10 MB'}
                    />
                    {errors.buktiPembayaranOngkir && (
                      <Typography variant='body1' sx={{ color: 'red' }}>
                        {errors.buktiPembayaranOngkir.message as string}
                      </Typography>
                    )}
                  </>
                )}
                rules={{
                  required: field.value === 'Via_POS' ? 'Bukti Biaya Pengiriman harus diisi' : false
                }}
              />
            </Grid>
          ) : (
            <></>
          )
        }
      />
    </Grid>
  )
}

export default FormLegalisirIjazah
