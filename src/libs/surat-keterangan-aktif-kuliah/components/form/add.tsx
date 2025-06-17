import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { tipeSurat } from '../../consts'
import { getDocument } from 'src/utils'
import { LoadingButton } from '@mui/lab'
import { useAuth } from 'src/hooks/useAuth'

interface AddFormProps {
  control: Control
  handleUploadDocument: (key: string, file: File) => void
  isLoadFile: boolean
}

const AddForm = (props: AddFormProps) => {
  const { user } = useAuth()

  const { control, handleUploadDocument, isLoadFile } = props

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Controller
          control={control}
          name='tipeSurat'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Tipe Berkas yang diupload
              </Typography>
              <Autocomplete
                options={tipeSurat}
                getOptionLabel={(option: any) => option.label}
                value={tipeSurat.find((item: any) => item.value === field.value) ?? null}
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
          rules={{ required: 'Tipe Berkas yang diupload harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='deskripsi'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Deskripsi Keperluan
              </Typography>
              <TextField
                fullWidth
                required
                placeholder='Tulis Deskripsi Keperluan'
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
              />
              {errors.deskripsi && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.deskripsi.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Deskripsi Keperluan harus diisi' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='dokumenUrl'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Berkas
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
                        const file = await getDocument(`skak_${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('dokumenUrl', file)
                        }
                      }}
                      loading={isLoadFile}
                      disabled={isLoadFile}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
              />
              {errors.dokumenUrl && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.dokumenUrl.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Deskripsi Keperluan harus diisi' }}
        />
      </Grid>
    </Grid>
  )
}

export default AddForm
