import { Icon } from '@iconify/react'
import { Autocomplete, DialogTitle, InputAdornment, OutlinedInput, Switch, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const VerificationCollegeCertificateDialog = ({ open, onClose }: any) => {
  //   const dispatch = useDispatch()
  const { user } = useAuth()
  const { watch, setValue, handleSubmit, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  return (
    <Dialog fullWidth open={open} maxWidth='sm' scroll='body' TransitionComponent={Transition}>
      <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: '#F7F7F9' }}>
        <IconButton
          onClick={() => {
            handleClose()
          }}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='material-symbols:close' />
        </IconButton>
        <Box>
          <Typography variant='h5' align='center'>
            Verifikasi Pengajuan
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          pb: 6,
          px: { xs: 8, sm: 15 },
          pt: { xs: 8, sm: 12.5 },
          position: 'relative'
        }}
        style={{ paddingTop: '5px' }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            borderBottom: '1px solid #4C4E641F',
            paddingBottom: '24px'
          }}
        >
          {user?.UserLevel?.name === 'KASUBBAG_KEMAHASISWAAN' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label='Nomor Surat'
                placeholder='Masukan Nomor Surat'
                value={watch('noSurat') ?? ''}
                onChange={(e: any) => {
                  setValue('noSurat', e.target.value)
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center', px: { xs: 8, sm: 15 } }}>
        <Button
          variant='contained'
          color='error'
          size='medium'
          disabled={isLoading}
          sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
          onClick={() => handleClose()}
        >
          Tolak
        </Button>
        <Button
          type='submit'
          variant='contained'
          color='success'
          disabled={isLoading}
          sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
          onClick={e => {
            e.preventDefault()

            //   handleSubmit(handleCreate)()
          }}
        >
          Verifikasi
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VerificationCollegeCertificateDialog
