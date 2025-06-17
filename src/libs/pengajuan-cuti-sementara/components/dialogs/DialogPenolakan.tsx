import { TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import { setRefresher } from 'src/stores/temporary-leave-request/temporaryLeaveRequestSlice'
import { VerificationCutiPayload } from '../../consts/payload'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'
import ActionDialog from 'src/components/shared/dialog/action-dialog'
import { verificationTemporaryLeaveRequest } from 'src/stores/temporary-leave-request/temporaryLeaveRequestAction'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface RejectVerificatioProps {
  open: boolean
  onClose: () => void
  closeVerification: () => void
  values: any
}

const DialogPenolakan = ({ open, onClose, closeVerification, values }: RejectVerificatioProps) => {
  const dispatch: AppDispatch = useDispatch()

  const { handleSubmit, reset, control } = useForm()

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

    const body: VerificationCutiPayload = Object.assign({}, value, { action: 'DITOLAK' })

    // @ts-ignore
    await dispatch(verificationTemporaryLeaveRequest({ data: body, id: values?.ulid })).then(res => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.message)
        setIsLoading(false)

        return
      }

      setIsLoading(false)
      toast.dismiss()
      toast.success(res?.payload?.message)
      handleClose()
      closeVerification()
    })
  })

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      scroll='body'
      TransitionComponent={Transition}
      PaperProps={{ sx: { borderRadius: '0px' } }}
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
              <Controller
                control={control}
                name='alasanPenolakan'
                render={({ field, formState: { errors } }) => (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label='Alasan'
                      placeholder='Masukan Alasan'
                      value={field.value ?? ''}
                      onChange={(e: any) => {
                        field.onChange(e.target.value)
                      }}
                    />
                    {errors.alasanPenolakan && (
                      <Typography variant='body1' sx={{ color: 'red' }}>
                        {errors.alasanPenolakan.message as string}
                      </Typography>
                    )}
                  </>
                )}
                rules={{ required: 'Jika Anda ingin menolak pengajuan, Alasan Pengajuan harus diisi' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <ActionDialog isDefault={true} isLoading={isLoading} onClose={handleClose} />
      </form>
    </Dialog>
  )
}

export default DialogPenolakan
