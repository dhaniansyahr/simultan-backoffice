import { TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import { setRefresher } from 'src/stores/college-certificate/certificateLegalizationSlice'
import ActionDialog from 'src/components/shared/dialog/action-dialog'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'
import { verificationGraduationSubmission } from 'src/stores/graduation-submission/graduationSubmissionAction'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface RejectVerificatioProps {
  open: boolean
  onClose: (v: boolean) => void
  values: any
}

const DialogPenolakan = ({ open, onClose, values }: RejectVerificatioProps) => {
  const dispatch: AppDispatch = useDispatch()

  // const { user } = useAuth()
  const { watch, setValue, handleSubmit, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  const onSubmit = handleSubmit(async (value: any) => {
    setIsLoading(true)
    toast.loading('Waiting ...')

    const body: any = Object.assign({}, value, {
      action: 'DITOLAK'
    })

    // @ts-ignore
    await dispatch(verificationGraduationSubmission({ data: body, id: values?.ulid })).then(res => {
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
    <Dialog fullWidth open={open} maxWidth='sm' scroll='body' TransitionComponent={Transition}>
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
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label='Alasan'
                placeholder='Masukan Alasan'
                value={watch('reason') ?? ''}
                onChange={(e: any) => {
                  setValue('reason', e.target.value)
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={handleClose} />
      </form>
    </Dialog>
  )
}

export default DialogPenolakan
