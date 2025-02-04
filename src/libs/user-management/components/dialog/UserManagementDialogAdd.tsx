import { Icon } from '@iconify/react'
import { Autocomplete, DialogTitle, InputAdornment, OutlinedInput, Switch, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const UserManagementDialogAdd = ({ open, onClose, setOpen }: any) => {
  //   const dispatch = useDispatch()
  const { watch, setValue, handleSubmit, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)

  const [levels, setLevels] = useState<any>(null)

  //   const handleGetAllLevels = async () => {
  //     setIsLoading(true)

  //     const body: any = {
  //       params: {
  //         page: 1,
  //         rows: 1000
  //       }
  //     }

  //     // @ts-ignore
  //     await dispatch(getAllUserLevel({ data: body })).then((res: any) => {
  //       if (res?.meta?.requestStatus !== 'fulfilled') {
  //         toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
  //         setIsLoading(false)
  //         setLevels(null)

  //         return
  //       }

  //       setIsLoading(false)
  //       setLevels(res?.payload?.content?.entries)
  //     })
  //   }

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
    dispatch(setRefresher())
  }

  //   const handleCreate = async (value: any) => {
  //     setIsLoading(true)
  //     toast.loading('Waiting ...')

  //     const body = Object.assign(
  //       {},
  //       {
  //         fullName: value?.fullName,
  //         email: value?.email,
  //         password: value?.password,
  //         userLevelId: value?.level?.id
  //       }
  //     )

  //     // @ts-ignore
  //     await dispatch(createAdminUserSetting({ data: body })).then((res: any) => {
  //       if (res.meta.requestStatus !== 'fulfilled') {
  //         toast.dismiss()
  //         toast.error(res.payload?.response?.data?.errors?.[0]?.message ?? res.payload?.response?.data.message)
  //         setIsLoading(false)

  //         return
  //       }

  //       toast.dismiss()
  //       toast.success(res?.payload?.message)
  //       handleClose()
  //     })
  //   }

  //   useEffect(() => {
  //     if (open) {
  //       handleGetAllLevels()
  //     }
  //   }, [open])

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' TransitionComponent={Transition}>
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
          <Typography variant='h5'>Tambah User</Typography>
          <Typography>Isi formulir berikut untuk detail User baru</Typography>
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
            <TextField
              fullWidth
              required
              label='Nama'
              placeholder='Nama'
              value={watch('fullName') ?? ''}
              onChange={(e: any) => {
                setValue('fullName', e.target.value)
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='Email'
              placeholder='Email'
              value={watch('email') ?? ''}
              onChange={(e: any) => {
                setValue('email', e.target.value)
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <OutlinedInput
              fullWidth
              required
              label='Password'
              placeholder='Password'
              type={isShowPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    aria-label='toggle password visibility'
                  >
                    {isShowPassword ? <Icon icon='mdi:eye-outline' /> : <Icon icon='mdi:eye-off-outline' />}
                  </IconButton>
                </InputAdornment>
              }
              value={watch('password')}
              onChange={e => {
                setValue('password', e.target.value)
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={levels ?? []}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField {...params} label='Level' placeholder='Pilih Level' variant='outlined' />
              )}
              value={watch('level') ?? null}
              onChange={(_, value) => setValue('level', value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              Status
            </Typography>
            <Switch value={watch('status')} onChange={e => setValue('status', e.target.checked)} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
        <Button
          variant='contained'
          color='secondary'
          size='medium'
          disabled={isLoading}
          sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
          onClick={() => handleClose()}
        >
          Batal
        </Button>
        <Button
          type='submit'
          variant='contained'
          disabled={isLoading}
          sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
          onClick={e => {
            e.preventDefault()

            //   handleSubmit(handleCreate)()
          }}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserManagementDialogAdd
