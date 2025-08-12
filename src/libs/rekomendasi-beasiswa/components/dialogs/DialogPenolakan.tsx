import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { verificationRekomendasiBeasiswa } from 'src/stores/rekomendasi-beasiswa/rekomendasiBeasiswaAction'
import { setRefresher } from 'src/stores/rekomendasi-beasiswa/rekomendasiBeasiswaSlice'

interface DialogPenolakanProps {
  open: boolean
  onClose: () => void
  closeVerification: () => void
  values: any
}

const DialogPenolakan = ({ open, onClose, closeVerification, values }: DialogPenolakanProps) => {
  const dispatch = useDispatch()

  const { handleSubmit, control, reset } = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Memproses penolakan...')

    const body = {
      action: 'DITOLAK',
      alasanPenolakan: value?.alasanPenolakan
    }

    // @ts-ignore
    await dispatch(verificationRekomendasiBeasiswa({ data: body, id: values?.ulid })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        return
      }

      setIsLoading(false)
      toast.dismiss()
      toast.success(res?.payload?.message)

      // @ts-ignore
      dispatch(setRefresher())
      reset()
      closeVerification()
      onClose()
    })
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Tolak Pengajuan Rekomendasi Beasiswa</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ mb: 2, color: 'error.main' }}>
                Apakah Anda yakin ingin menolak pengajuan rekomendasi beasiswa ini?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='alasanPenolakan'
                control={control}
                rules={{ required: 'Alasan penolakan harus diisi' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Alasan Penolakan *'
                    multiline
                    rows={4}
                    placeholder='Jelaskan alasan penolakan pengajuan'
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Batal
          </Button>
          <LoadingButton type='submit' variant='contained' color='error' loading={isLoading}>
            Tolak
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogPenolakan
