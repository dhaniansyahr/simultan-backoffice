import { Box, CircularProgress } from '@mui/material'

const LoadData = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress />
    </Box>
  )
}

export default LoadData
