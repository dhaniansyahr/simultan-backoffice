import { LoadingButton } from '@mui/lab'
import { Button, Box, Grid, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'

interface ActionPageProps {
  isLoading: boolean
}

const ActionPage = (props: ActionPageProps) => {
  const { isLoading } = props

  const router = useRouter()

  const onBack = () => router.back()

  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 2, alignItems: 'center' }}>
        <Button type='button' variant='contained' color='secondary' size='medium' onClick={onBack}>
          Batal
        </Button>
         <LoadingButton type='submit' variant='contained' loading={isLoading} disabled={isLoading} loadingIndicator={<CircularProgress size={24} />}>
          Simpan
        </LoadingButton>
      </Box>
    </Grid>
  )
}

export default ActionPage
