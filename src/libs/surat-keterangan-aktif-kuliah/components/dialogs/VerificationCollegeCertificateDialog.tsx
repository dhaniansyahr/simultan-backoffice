import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { VerificationSuratPayload } from '../../consts/payload'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { verificationCollegeCertificate } from 'src/stores/college-certificate/collegeCertificateAction'
import RejectVerificationDialog from './RejectVerificationDialog'
import { setRefresher } from 'src/stores/college-certificate/certificateLegalizationSlice'
import HeaderDialog from 'src/components/shared/dialog/header-dialog'
import ActionDialog from 'src/components/shared/dialog/action-dialog'
import { useAppDispatch } from 'src/utils/dispatch'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface VerificatioDialogProps {
  open: boolean
  onClose: () => void
  values: any
}

const VerificationCollegeCertificateDialog = ({ open, onClose, values }: VerificatioDialogProps) => {
  const dispatch = useAppDispatch()

  // const { user } = useAuth()
  const { handleSubmit, reset } = useForm()

  const [isReject, setIsReject] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose()

    // @ts-ignore
    dispatch(setRefresher())
  }

  const handleVerification = async (value: any, action: 'DITOLAK' | 'DISETUJUI') => {
    setIsLoading(true)
    toast.loading('Verification...')

    const body: VerificationSuratPayload = {
      action: action,
      reason: value?.reason
    }

    // @ts-ignore
    await dispatch(verificationCollegeCertificate({ data: body, id: values?.ulid })).then(res => {
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
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        TransitionComponent={Transition}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '0px',
            padding: '0px !important'
          }
        }}
      >
        <HeaderDialog onClose={onClose} title='Verifikasi Pengajuan Surat Keterangan Aktif Kuliah' />

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

        <ActionDialog isDefault={false} isLoading={isLoading} onClose={handleClose}>
          <Button
            variant='outlined'
            color='error'
            onClick={handleSubmit(value => handleVerification(value, 'DITOLAK'))}
          >
            Tolak
          </Button>
          <Button
            variant='contained'
            color='success'
            onClick={handleSubmit(value => handleVerification(value, 'DISETUJUI'))}
          >
            Verifikasi
          </Button>
        </ActionDialog>
      </Dialog>

      <RejectVerificationDialog
        open={isReject}
        onClose={() => setIsReject(false)}
        closeVerification={() => handleClose()}
      />
    </>
  )
}

export default VerificationCollegeCertificateDialog
