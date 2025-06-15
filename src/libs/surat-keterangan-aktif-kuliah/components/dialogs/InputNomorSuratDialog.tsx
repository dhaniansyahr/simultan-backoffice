import { TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import { inputNomorSurat } from 'src/stores/college-certificate/collegeCertificateAction'
import { setRefresher } from 'src/stores/college-certificate/certificateLegalizationSlice'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'
import ActionDialog from 'src/components/shared/dialog/action-dialog'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface VerificatioDialogProps {
  open: boolean
  onClose: (v: boolean) => void
  values: any
}

const InputNomorSuratDialog = ({ open, onClose, values }: VerificatioDialogProps) => {
  const dispatch: AppDispatch = useDispatch()

  const { handleSubmit, reset, control } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)
    toast.loading('Inputing...')

    const body: any = {
      nomorSurat: value?.noSurat
    }

    // @ts-ignore
    await dispatch(inputNomorSurat({ data: body, id: values?.ulid })).then(res => {
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
      <HeaderDialog title='Input Nomor Surat' onClose={handleClose} />

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
          <Grid
            container
            spacing={4}
            sx={{
              borderBottom: '1px solid #4C4E641F',
              paddingBottom: '24px'
            }}
          >
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Controller
                  name='noSurat'
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextField
                      fullWidth
                      label='Nomor Surat'
                      placeholder='Masukan Nomor Surat'
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors?.noSurat}
                      helperText={errors?.noSurat?.message as string}
                    />
                  )}
                  rules={{
                    required: 'Nomor Surat Wajib Diisi'
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <ActionDialog isDefault={true} onClose={handleClose} isLoading={isLoading} />
      </form>
    </Dialog>
  )
}

export default InputNomorSuratDialog
