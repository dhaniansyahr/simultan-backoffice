import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { inputNomorSurat } from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusAction'
import { setRefresher } from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusSlice'

interface InputNomorSuratDialogProps {
  open: boolean
  onClose: () => void
  values: any
}

const InputNomorSuratDialog = ({ open, onClose, values }: InputNomorSuratDialogProps) => {
  const dispatch = useDispatch()

  const { handleSubmit, control, reset } = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Menyimpan nomor surat...')

    const body = {
      nomorSurat: value?.nomorSurat
    }

    // @ts-ignore
    await dispatch(inputNomorSurat({ data: body, id: values?.ulid })).then((res: any) => {
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
      <DialogTitle>Input Nomor Surat</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Masukkan nomor surat untuk surat keterangan lulus ini.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='nomorSurat'
                control={control}
                rules={{ required: 'Nomor surat harus diisi' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Nomor Surat *'
                    placeholder='Masukkan nomor surat (contoh: 001/SKL/2025)'
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
          <LoadingButton type='submit' variant='contained' loading={isLoading}>
            Simpan
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default InputNomorSuratDialog
