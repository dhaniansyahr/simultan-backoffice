import { Icon } from '@iconify/react'
import { Button, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import RejectVerificationDialog from './RejectVerificationDialog'
import { verificationGraduationSubmission } from 'src/stores/graduation-submission/graduationSubmissionAction'
import { setRefresher } from 'src/stores/graduation-submission/graduationSubmissionSlice'

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

const VerificationYudisiumRequestDialog = ({ open, onClose, values }: VerificatioDialogProps) => {
  const dispatch: AppDispatch = useDispatch()

  const [isReject, setIsReject] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  const handleVerification = async (action: 'USULAN_DITOLAK' | 'USULAN_DISETUJUI') => {
    setIsLoading(true)
    toast.loading('Verification...')

    const body: any = {
      action: action
    }

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
  }

  return (
    <>
      <Dialog fullWidth open={open} maxWidth='sm' scroll='body' TransitionComponent={Transition}>
        <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: '#F7F7F9' }}>
          <IconButton
            onClick={() => {
              handleClose()
            }}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='material-symbols:close' />
          </IconButton>
          <Box>
            <Typography variant='h5' align='center'>
              Verifikasi Pengajuan
            </Typography>
          </Box>
        </DialogTitle>

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
                Apakah anda ingin melakukan verifikasi pada surat ini?
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center', px: { xs: 8, sm: 15 } }}>
          <Button
            variant='contained'
            color='error'
            size='medium'
            disabled={isLoading}
            sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
            onClick={() => setIsReject(true)}
          >
            Tolak
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='success'
            disabled={isLoading}
            sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
            onClick={() => handleVerification('USULAN_DISETUJUI')}
          >
            Verifikasi
          </Button>
        </DialogActions>
      </Dialog>

      <RejectVerificationDialog
        open={isReject}
        onClose={(v: boolean) => setIsReject(v)}
        closeVerification={() => handleClose()}
      />
    </>
  )
}

export default VerificationYudisiumRequestDialog
