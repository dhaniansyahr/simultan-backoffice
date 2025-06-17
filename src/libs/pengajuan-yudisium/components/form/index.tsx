import { LoadingButton } from '@mui/lab'
import { CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import { getDocument } from 'src/utils'

interface FormProps {
  control: Control
  handleUploadDocument: (key: string, file: File) => void
  isLoadFile: string
}

const FormSection = ({ control, handleUploadDocument, isLoadFile }: FormProps) => {
  const { user } = useAuth()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Controller
          control={control}
          name='suratPendaftaran'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Formulir Pendaftaran / Biodata
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
                        const file = await getDocument(`surat_pendaftaran_${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratPendaftaran', file)
                        }
                      }}
                      loading={isLoadFile === 'suratPendaftaran'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
                helperText={'Format file: PDF; Max 10 MB'}
              />
              {errors.suratPendaftaran && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratPendaftaran.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Formulir Pendaftaran / Biodata harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='suratBebasLab'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Formulir Bebas Laboratorium
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
                        const file = await getDocument(`surat_bebas_lab_${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratBebasLab', file)
                        }
                      }}
                      loading={isLoadFile === 'suratBebasLab'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
                helperText={'Format file: PDF; Max 10 MB'}
              />
              {errors.suratBebasLab && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratBebasLab.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Formulir Bebas Laboratorium harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='suratBebasPerpustakaan'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Formulir Bebas Perpustakaan
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
                        const file = await getDocument(`surat_bebas_perpustakaan_${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratBebasPerpustakaan', file)
                        }
                      }}
                      loading={isLoadFile === 'suratBebasPerpustakaan'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
                helperText={'Format file: PDF; Max 10 MB'}
              />
              {errors.suratBebasPerpustakaan && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratBebasPerpustakaan.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Formulir Bebas Perpustakaan harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='suratDistribusiSkripsi'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Formulir Distribusi Skripsi
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
                        const file = await getDocument(`surat_distribusi_skripsi_${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratDistribusiSkripsi', file)
                        }
                      }}
                      loading={isLoadFile === 'suratDistribusiSkripsi'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
                helperText={'Format file: PDF; Max 10 MB'}
              />
              {errors.suratDistribusiSkripsi && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratDistribusiSkripsi.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Formulir Pendaftaran / Biodata harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='suratPendaftaranIka'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Formulir Pendaftaran pada IKA Alumni
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
                        const file = await getDocument(`surat_pendaftaran_ika_${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratPendaftaranIka', file)
                        }
                      }}
                      loading={isLoadFile === 'suratPendaftaranIka'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
                helperText={'Format file: PDF; Max 10 MB'}
              />
              {errors.suratPendaftaranIka && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratPendaftaranIka.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Formulir Pendaftaran pada IKA Alumni harus diisi' }}
        />
      </Grid>
    </Grid>
  )
}

export default FormSection
