import { Icon } from '@iconify/react'
import { Box, CardHeader, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'

interface HeaderPageProps {
  title: string
  isDetail?: boolean
  action?: React.ReactNode
}

const HeaderPage = (props: HeaderPageProps & Record<string, any>) => {
  const router = useRouter()

  const { title, isDetail, ...rest } = props

  const onBack = () => router.back()

  return (
    <CardHeader
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isDetail && (
            <IconButton onClick={onBack}>
              <Icon icon='mdi:arrow-left' />
            </IconButton>
          )}
          <Typography variant='h5' sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
      }
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'start', md: 'center' },
        borderBottom: '1px solid #f4f4f4'
      }}
      {...rest}
    />
  )
}

export default HeaderPage
