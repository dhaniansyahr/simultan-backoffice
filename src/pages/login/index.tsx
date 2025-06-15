// ** React Imports
import { ReactNode, useState } from 'react'

// ** MUI Components
import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import themeConfig from 'src/configs/themeConfig'
import { useAuth } from 'src/hooks/useAuth'
import { LoginParams } from 'src/context/types'
import { Alert } from '@mui/material'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const Login = () => {
  const auth = useAuth()
  const { handleSubmit, control } = useForm()

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<any>([])

  const handleLogin = async (value: any) => {
    setIsLoading(true)

    const body: LoginParams = Object.assign({}, value)

    auth.login(body, (err: any) => {
      toast.dismiss()
      toast.error(err.response?.data?.errors?.[0]?.message)
      setErrors(err.response?.data?.errors)
      setIsLoading(false)

      return
    })
  }

  return (
    <Box className='content-center'>
      <Card sx={{ width: '100%', maxWidth: '480px', zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                priority
                src='/images/logo.png'
                height='480'
                width='480'
                alt='Hero'
                style={{ height: 'auto', width: '250px' }}
              />
            </Box>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
              {`Welcome to ${themeConfig.templateName}! 👋🏻`}
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            {errors.map((error: any, index: number) => (
              <Alert severity='error' sx={{ mb: 2 }} key={index}>
                {error.message}
              </Alert>
            ))}
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(handleLogin)}>
            <Controller
              control={control}
              name='identity'
              render={({ field, formState: { errors } }) => (
                <TextField
                  autoFocus
                  fullWidth
                  label='NIP/NPM'
                  sx={{ mb: 4 }}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  error={!!errors.identity}
                  helperText={errors.identity?.message as string}
                />
              )}
              rules={{
                required: 'NIP/NPM harus diisi'
              }}
            />

            <Controller
              control={control}
              name='password'
              render={({ field, formState: { errors } }) => (
                <TextField
                  fullWidth
                  label='Password'
                  sx={{ mb: 4 }}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password?.message as string}
                  type={isShowPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setIsShowPassword(!isShowPassword)}>
                          {isShowPassword ? <Icon icon='mdi:eye-outline' /> : <Icon icon='mdi:eye-off-outline' />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
              rules={{
                required: 'Password harus diisi'
              }}
            />

            <Box sx={{ mb: 4 }} />
            <Button fullWidth type='submit' variant='contained' size='large' sx={{ mb: 7 }} disabled={isLoading}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Login.guestGuard = true

export default Login
