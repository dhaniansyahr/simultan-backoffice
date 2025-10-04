import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { updateNomorSuratRekomendasiBeasiswa } from 'src/stores/rekomendasi-beasiswa/rekomendasiBeasiswaAction'
import { setRefresher } from 'src/stores/rekomendasi-beasiswa/rekomendasiBeasiswaSlice'

interface DialogEditNomorSuratProps {
  open: boolean
  onClose: () => void
  values: any
}

const DialogEditNomorSurat = ({ open, onClose, values }: DialogEditNomorSuratProps) => {
  const dispatch = useDispatch()

  const { handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      nomorSurat: values?.nomorSurat || ''
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Mengupdate nomor surat...')

    const body = {
      nomorSurat: value?.nomorSurat
    }

    // @ts-ignore
    await dispatch(updateNomorSuratRekomendasiBeasiswa({ data: body, id: values?.ulid })).then((res: any) => {
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

  // Set default value when values change
  if (values?.nomorSurat && open) {
    setValue('nomorSurat', values?.nomorSurat)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Nomor Surat</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={4}>
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
            Simpan Perubahan
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogEditNomorSurat
