import { Box, TextField } from '@mui/material'
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
import { processCertificateLegalization } from 'src/stores/certificate-legalization/certificateLegalizationAction'
import { setRefresher } from 'src/stores/certificate-legalization/certificateLegalizationSlice'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'
import ActionDialog from 'src/components/shared/dialog/action-dialog'
import DatePickerInput from 'src/components/shared/date-input'
import moment from 'moment'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface RejectVerificatioProps {
  open: boolean
  onClose: () => void
  values: any
}

const DialogProses = ({ open, onClose, values }: RejectVerificatioProps) => {
  const dispatch: AppDispatch = useDispatch()

  const { control, handleSubmit, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose()

    // @ts-ignore
    dispatch(setRefresher())
  }

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Verification...')

    const body: any = Object.assign({}, value, {
      tanggalPengambilan: moment(value?.tanggalPengambilan).format('YYYY-MM-DD')
    })

    // @ts-ignore
    await dispatch(processCertificateLegalization({ data: body, id: values?.ulid })).then(res => {
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
      PaperProps={{
        sx: {
          borderRadius: '0px'
        }
      }}
    >
      <HeaderDialog title='Penolakan Pengajuan' onClose={handleClose} />

      <form action='submit' onSubmit={onSubmit}>
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
              <DatePickerInput
                name='tanggalPengambilian'
                control={control}
                rules={{ required: 'Tanggal pengambilan harus diisi!' }}
                label='Tanggal Pengambilan'
                placeholder='YYYY-MM-DD'
                dateFormat='yyyy-MM-dd'
                popperContainer={({ children }) => <Box sx={{ position: 'fixed', zIndex: 99999 }}>{children}</Box>}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='tempatPengambilan'
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    required
                    label='Tempat Pengambilan'
                    placeholder='Masukan Tempat Pengambilan'
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
                rules={{ required: 'Tempat pengambilan harus diisi!' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <ActionDialog isDefault={true} isLoading={isLoading} onClose={handleClose} />
      </form>
    </Dialog>
  )
}

export default DialogProses
