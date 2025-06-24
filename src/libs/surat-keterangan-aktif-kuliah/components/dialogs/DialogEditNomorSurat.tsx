import { TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import React, { ReactElement, Ref, forwardRef, useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import { setRefresher } from 'src/stores/college-certificate/certificateLegalizationSlice'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'
import ActionDialog from 'src/components/shared/dialog/action-dialog'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface EditNomorSuratDialogProps {
  open: boolean
  onClose: (v: boolean) => void
  values: any
}

const EditNomorSuratDialog = ({ open, onClose, values }: EditNomorSuratDialogProps) => {
  const dispatch: AppDispatch = useDispatch()

  const { handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      noSurat: ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  // Set default value ketika dialog dibuka
  useEffect(() => {
    if (open && values?.nomorSurat) {
      setValue('noSurat', values.nomorSurat)
    }
  }, [open, values, setValue])

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)
    toast.loading('Updating...')

    const body: any = {
      nomorSurat: value?.noSurat
    }

    // @ts-ignore
    await dispatch(updateNomorSurat({ data: body, id: values?.ulid })).then(res => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.message)
        setIsLoading(false)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)
      handleClose()
    })
  })

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { borderRadius: '0px' } }}
    >
      <HeaderDialog title='Edit Nomor Surat' onClose={handleClose} />

      <form onSubmit={onSubmit}>
        <DialogContent
          sx={{
            pb: 6,
            px: { xs: 8, sm: 15 },
            pt: { xs: 8, sm: 12.5 },
            position: 'relative'
          }}
          style={{ paddingTop: '5px' }}
        >
          {/* Info Section */}
          <Grid
            container
            spacing={4}
            sx={{
              borderBottom: '1px solid #4C4E641F',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Nama Mahasiswa'
                value={values?.user?.nama || '-'}
                disabled
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='NPM'
                value={values?.user?.npm || '-'}
                disabled
                variant='outlined'
              />
            </Grid>
          </Grid>

          {/* Edit Form Section */}
          <Grid
            container
            spacing={4}
            sx={{
              borderBottom: '1px solid #4C4E641F',
              paddingBottom: '24px'
            }}
          >
            <Grid item xs={12}>
              <Controller
                name='noSurat'
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextField
                    fullWidth
                    label='Nomor Surat'
                    placeholder='Masukan Nomor Surat'
                    value={field.value || ''}
                    onChange={field.onChange}
                    error={!!errors?.noSurat}
                    helperText={errors?.noSurat?.message as string}
                    variant='outlined'
                  />
                )}
                rules={{
                  required: 'Nomor Surat Wajib Diisi',
                  minLength: {
                    value: 3,
                    message: 'Nomor Surat minimal 3 karakter'
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <ActionDialog isDefault={true} onClose={handleClose} isLoading={isLoading} />
      </form>
    </Dialog>
  )
}

export default EditNomorSuratDialog