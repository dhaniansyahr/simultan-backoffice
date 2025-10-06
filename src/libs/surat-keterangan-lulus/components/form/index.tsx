import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { getFileNamefromURL } from 'src/utils'

interface FormSectionProps {
  control: Control<any>
  handleUploadDocument: (key: string, file: File) => void
  isLoadFile: string
}

const tipeSuratOptions = [
  { value: 'UNTUK_BEKERJA', label: 'Untuk Bekerja' },
  { value: 'UNTUK_MELANJUTKAN_STUDI', label: 'Untuk Melanjutkan Studi' },
  { value: 'UNTUK_BEASISWA', label: 'Untuk Beasiswa' },
  { value: 'LAINNYA', label: 'Lainnya' }
]

const FormSection = ({ control, handleUploadDocument, isLoadFile }: FormSectionProps) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Controller
          control={control}
          name='tipeSurat'
          rules={{ required: 'Tipe surat harus dipilih' }}
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Tipe Berkas yang diupload
              </Typography>
              <Autocomplete
                options={tipeSuratOptions}
                getOptionLabel={(option: any) => option.label}
                value={tipeSuratOptions.find((item: any) => item.value === field.value) ?? null}
                onChange={(e: any, value: any) => {
                  field.onChange(value?.value)
                }}
                renderInput={params => (
                  <TextField {...params} placeholder='Pilih Tipe Surat' fullWidth sx={{ marginTop: '10px' }} />
                )}
              />
              {errors.tipeSurat && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.tipeSurat.message as string}
                </Typography>
              )}
            </>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='deskripsi'
          rules={{ required: 'Deskripsi harus diisi' }}
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Deskripsi Keperluan
              </Typography>
              <TextField
                fullWidth
                required
                placeholder='Tulis Deskripsi Keperluan (contoh: Surat keterangan lulus diperlukan untuk melamar pekerjaan di PT. ABC sebagai Software Developer)'
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                multiline
                rows={4}
                sx={{ marginTop: '10px' }}
              />
              {errors.deskripsi && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.deskripsi.message as string}
                </Typography>
              )}
            </>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='dokumenTranskrip'
          rules={{ required: 'Transkrip nilai wajib diunggah' }}
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Transkrip Nilai (Wajib)
              </Typography>
              <TextField
                fullWidth
                value={field.value ? getFileNamefromURL(field.value) : 'Pilih file'}
                inputProps={{
                  readOnly: true
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#fff'
                  },
                  marginTop: '10px'
                }}
                helperText='Format file: PDF, DOC, DOCX - Max 2MB'
                InputProps={{
                  endAdornment: (
                    <LoadingButton
                      sx={{ whiteSpace: 'nowrap' }}
                      variant='outlined'
                      color='primary'
                      component='label'
                      loading={isLoadFile === 'dokumenTranskrip'}
                      disabled={isLoadFile === 'dokumenTranskrip'}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                      <input
                        type='file'
                        hidden
                        accept='.pdf,.doc,.docx'
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('Ukuran file tidak boleh lebih dari 2MB')

                              return
                            }
                            handleUploadDocument('dokumenTranskrip', file)
                          }
                        }}
                      />
                    </LoadingButton>
                  )
                }}
              />
              {errors.dokumenTranskrip && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.dokumenTranskrip.message as string}
                </Typography>
              )}
            </>
          )}
        />
      </Grid>
    </Grid>
  )
}

export default FormSection
