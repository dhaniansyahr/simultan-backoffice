import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { getDocument, getFileNamefromURL } from 'src/utils'

interface FormSectionProps {
  control: Control<any>
  handleUploadDocument: (key: string, file: File) => void
  isLoadFile: string
}

const FormSection = ({ control, handleUploadDocument, isLoadFile }: FormSectionProps) => {
  const tipeRekomendasiOptions = [
    { value: 'UNTUK_BEASISWA', label: 'Untuk Beasiswa' },
    { value: 'UNTUK_MELANJUTKAN_STUDI', label: 'Untuk Melanjutkan Studi' },
    { value: 'UNTUK_MAGANG', label: 'Untuk Magang' },
    { value: 'UNTUK_PEKERJAAN', label: 'Untuk Pekerjaan' },
    { value: 'UNTUK_PENELITIAN', label: 'Untuk Penelitian' },
    { value: 'UNTUK_PERTUKARAN_PELAJAR', label: 'Untuk Pertukaran Pelajar' }
  ]

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Detail Rekomendasi
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='tipeRekomendasi'
            control={control}
            rules={{ required: 'Tipe rekomendasi harus dipilih' }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>Tipe Rekomendasi</InputLabel>
                <Select {...field} label='Tipe Rekomendasi' value={field.value || ''}>
                  {tipeRekomendasiOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {error && (
                  <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                    {error.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='institusiTujuan'
            control={control}
            rules={{ required: 'Institusi tujuan harus diisi' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label='Institusi Tujuan'
                placeholder='Masukkan nama institusi tujuan (contoh: Institut Pertanian Bogor)'
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='deskripsi'
            control={control}
            rules={{ required: 'Deskripsi harus diisi' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label='Deskripsi Keperluan'
                placeholder='Jelaskan keperluan rekomendasi secara detail'
                multiline
                rows={4}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '10px', marginTop: '20px' }}>
            Dokumen Pendukung
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='dokumenPendukung'
            control={control}
            render={({ field }) => (
              <Box sx={{ width: '100%' }}>
                <Typography variant='body2' sx={{ mb: 2, fontWeight: 500 }}>
                  Upload Dokumen Pendukung (Opsional)
                </Typography>
                <Typography variant='caption' sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
                  Format: PDF, DOC, DOCX (Maksimal 5MB per file)
                </Typography>

                {field.value ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant='body2' sx={{ flexGrow: 1 }}>
                      {getFileNamefromURL(field.value)}
                    </Typography>
                    <Button variant='outlined' size='small' onClick={() => getDocument(field.value)}>
                      Lihat
                    </Button>
                    <Button variant='outlined' color='error' size='small' onClick={() => field.onChange('')}>
                      Hapus
                    </Button>
                  </Box>
                ) : (
                  <LoadingButton
                    variant='outlined'
                    component='label'
                    loading={isLoadFile === 'dokumenPendukung'}
                    loadingIndicator={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        Uploading...
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  >
                    Pilih File
                    <input
                      type='file'
                      hidden
                      accept='.pdf,.doc,.docx'
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Ukuran file tidak boleh lebih dari 5MB')

                            return
                          }
                          handleUploadDocument('dokumenPendukung', file)
                        }
                      }}
                    />
                  </LoadingButton>
                )}
              </Box>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormSection
