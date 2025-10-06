import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { verificationSuratKeteranganLulus } from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusAction'
import { setRefresher } from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusSlice'

interface DialogVerifikasiProps {
  open: boolean
  onClose: () => void
  values: any
}

const DialogVerifikasi = ({ open, onClose, values }: DialogVerifikasiProps) => {
  const dispatch = useDispatch()

  const { handleSubmit, control, reset } = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Memproses verifikasi...')

    const body = {
      action: 'DISETUJUI',
      catatanVerifikasi: value?.catatanVerifikasi || ''
    }

    // @ts-ignore
    await dispatch(verificationSuratKeteranganLulus({ data: body, id: values?.ulid })).then((res: any) => {
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
      onClose()
    })
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Verifikasi Surat Keterangan Lulus</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Apakah Anda yakin ingin menyetujui pengajuan surat keterangan lulus ini?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='catatanVerifikasi'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Catatan Verifikasi (Opsional)'
                    multiline
                    rows={3}
                    placeholder='Tambahkan catatan verifikasi jika diperlukan'
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
          <LoadingButton type='submit' variant='contained' loading={isLoading}>
            Setujui
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogVerifikasi
