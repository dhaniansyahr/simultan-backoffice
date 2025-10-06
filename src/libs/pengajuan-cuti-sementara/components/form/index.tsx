import { LoadingButton } from '@mui/lab'
import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'

// import DownloadIcon from '@mui/icons-material/Download'
import { Control, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import { getDocument, getFileNamefromURL } from 'src/utils'

interface FormSectionProps {
  control: Control<any>
  handleUploadDocument: (key: string, file: File) => void
  isLoadFile: string
}

const FormSection = ({ control, handleUploadDocument, isLoadFile }: FormSectionProps) => {
  const { user } = useAuth()

  const handleDownloadTemplate = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent default behavior
    e.stopPropagation() // Stop event propagation
    
    // Replace with actual template URL
    const templateUrl = '/templates/template-surat-persetujuan-orang-tua.docx'
    
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = templateUrl
    link.download = 'Template Surat Persetujuan Orang Tua.docx'
    link.target = '_blank' // Open in new tab if needed
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Add new function for BSS template download
  const handleDownloadBSSTemplate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const templateUrl = '/templates/Formulir_BSS_Pengajuan_Cuti_Sementara.docx'
    
    const link = document.createElement('a')
    link.href = templateUrl
    link.download = 'Template Formulir BSS.docx'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  <Grid item xs={12}>
        <Controller
          control={control}
          name='suratBss'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Formulir BSS
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
                  }
                }}
                helperText='Format file: PDF, Max 10MB'
                InputProps={{
                  endAdornment: (
                    <LoadingButton
                      sx={{ whiteSpace: 'nowrap' }}
                      variant='outlined'
                      color='primary'
                      onClick={async () => {
                        const file = await getDocument(`${user?.nama}-${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratBss', file)
                        }
                      }}
                      loading={isLoadFile === 'suratBss'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
              />
              {errors.suratBss && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratBss.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Formulir BSS harus diupload' }}
        />
      </Grid>

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Controller
          control={control}
          name='suratPersetujuanOrangTua'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Surat Persetujuan Orang Tua
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
                  }
                }}
                helperText='Format file: PDF, Max 10MB'
                InputProps={{
                  endAdornment: (
                    <LoadingButton
                      sx={{ whiteSpace: 'nowrap' }}
                      variant='outlined'
                      color='primary'
                      onClick={async () => {
                        const file = await getDocument(`${user?.nama}-${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratPersetujuanOrangTua', file)
                        }
                      }}
                      loading={isLoadFile === 'suratPersetujuanOrangTua'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
              />
              {errors.suratPersetujuanOrangTua && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratPersetujuanOrangTua.message as string}
                </Typography>
              )}
              
              {/* Template Download Section */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
                {/* <DownloadIcon sx={{ fontSize: 18, color: 'primary.main' }} /> */}
                <Button
                  variant="text"
                  size="small"
                  onClick={handleDownloadTemplate}
                  sx={{
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Unduh Template Surat Persetujuan Orang Tua
                </Button>
              </Box>
            </>
          )}
          rules={{ required: 'Surat Persetujuan Orang Tua harus diupload' }}
        />
      </Grid>

      

            <Grid item xs={12}>
        <Controller
          control={control}
          name='suratBebasPustaka'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Surat Bebas Pustaka
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
                  }
                }}
                helperText='Format file: PDF, Max 10MB'
                InputProps={{
                  endAdornment: (
                    <LoadingButton
                      sx={{ whiteSpace: 'nowrap' }}
                      variant='outlined'
                      color='primary'
                      onClick={async () => {
                        const file = await getDocument(`${user?.nama}-${user?.nomorIdentitas}`)
      
                        console.log(file)
      
                        if (file) {
                          handleUploadDocument('suratBebasPustaka', file)
                        }
                      }}
                      loading={isLoadFile === 'suratBebasPustaka'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
              />
              {errors.suratBebasPustaka && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratBebasPustaka.message as string}
                </Typography>
              )}
              
              {/* Direct Link to ETD USK */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    window.open('https://etd.usk.ac.id/index.php?p=login', '_blank')
                  }}
                  sx={{
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Akses ETD USK untuk Surat Bebas Pustaka
                </Button>
              </Box>
            </>
          )}
          rules={{ required: 'Surat Bebas Pustaka harus diupload' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='suratBss'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Upload Formulir BSS
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
                  }
                }}
                helperText='Format file: PDF, Max 10MB'
                InputProps={{
                  endAdornment: (
                    <LoadingButton
                      sx={{ whiteSpace: 'nowrap' }}
                      variant='outlined'
                      color='primary'
                      onClick={async () => {
                        const file = await getDocument(`${user?.nama}-${user?.nomorIdentitas}`)

                        console.log(file)

                        if (file) {
                          handleUploadDocument('suratBss', file)
                        }
                      }}
                      loading={isLoadFile === 'suratBss'}
                      disabled={isLoadFile !== ''}
                      loadingIndicator={<CircularProgress size={20} />}
                    >
                      Pilih File
                    </LoadingButton>
                  )
                }}
              />
              {errors.suratBss && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.suratBss.message as string}
                </Typography>
              )}
              
              {/* BSS Template Download Section */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={handleDownloadBSSTemplate}
                  sx={{
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Unduh Template Formulir BSS
                </Button>
              </Box>
            </>
          )}
          rules={{ required: 'Formulir BSS harus diupload' }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name='reason'
          render={({ field, formState: { errors } }) => (
            <>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                Alasan Pengambilan Cuti
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                type='text'
                placeholder='Masukan Alasan Pengambilan Cuti'
                value={field.value ?? ''}
                onChange={e => {
                  const words = e.target.value.trim().split(/\s+/)
                  if (words.length <= 50) {
                    field.onChange(e.target.value)
                  }
                }}
                 helperText='Maksimal 50 Kata'
              />
              {errors.reason && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  {errors.reason.message as string}
                </Typography>
              )}
            </>
          )}
          rules={{ required: 'Alasan Pengambilan Cuti harus diisi' }}
        />
      </Grid>
    </Grid>
  )
}

export default FormSection
