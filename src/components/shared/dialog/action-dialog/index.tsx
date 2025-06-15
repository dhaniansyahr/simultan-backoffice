import { LoadingButton } from '@mui/lab'
import { CircularProgress, DialogActions } from '@mui/material'
import { Button } from '@mui/material'

interface ActionDialogProps {
  isDefault?: boolean
  isLoading: boolean
  children?: React.ReactNode
  onClose: () => void
}

const ActionDialog = (props: ActionDialogProps) => {
  const { isDefault, isLoading, children, onClose } = props

  return (
    <DialogActions
      sx={{
        pb: { xs: 8, sm: 12.5 },
        justifyContent: 'end',
        px: { xs: 8, sm: 15 },
        gap: { xs: 2, sm: 4 }
      }}
    >
      {isDefault ? (
        <>
          <Button variant='outlined' color='secondary' disabled={isLoading} onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            loadingIndicator={<CircularProgress size={20} />}
            type='submit'
            variant='contained'
            color='primary'
            disabled={isLoading}
          >
            Submit
          </LoadingButton>
        </>
      ) : (
        children
      )}
    </DialogActions>
  )
}

export default ActionDialog
