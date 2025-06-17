import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import { verificationGraduationSubmission } from 'src/stores/graduation-submission/graduationSubmissionAction'
import { setRefresher } from 'src/stores/graduation-submission/graduationSubmissionSlice'
import ActionDialog from 'src/components/shared/dialog/action-dialog'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'

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

const DialogVerifikasi = ({ open, onClose, values }: VerificatioDialogProps) => {
  const dispatch: AppDispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  const onSubmit = async () => {
    setIsLoading(true)
    toast.loading('Verification...')

    const body: any = {
      action: 'DISETUJUI'
    }

    // @ts-ignore
    await dispatch(verificationGraduationSubmission({ data: body, id: values?.ulid })).then(res => {
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
    })
  }

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      scroll='body'
      TransitionComponent={Transition}
      PaperProps={{ sx: { borderRadius: '0px' } }}
    >
      <HeaderDialog title='Verifikasi Pengajuan' onClose={handleClose} />

      <form
        action='submit'
        onSubmit={e => {
          e.preventDefault()

          onSubmit()
        }}
      >
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
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    width: '72px',
                    height: '72px',
                    backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.12),
                    borderRadius: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon='solar:clipboard-check-bold' width={48} color='#CA8A04' />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5' align='center'>
                Apakah anda yakin ingin melakukan verifikasi pada pengajuan ini?
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={handleClose} isDefault={true} />
      </form>
    </Dialog>
  )
}

export default DialogVerifikasi
