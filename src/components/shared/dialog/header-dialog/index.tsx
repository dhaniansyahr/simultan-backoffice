import { Icon } from '@iconify/react'
import { Box, DialogTitle, IconButton, Typography } from '@mui/material'

interface HeaderDialogProps {
  onClose: () => void
  title: string
}

const HeaderDialog = ({ onClose, title }: HeaderDialogProps) => {
  return (
    <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: 'primary.main' }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
        <Icon icon='material-symbols:close' color='white' />
      </IconButton>
      <Box>
        <Typography variant='h5' sx={{ color: 'white' }}>
          {title}
        </Typography>
      </Box>
    </DialogTitle>
  )
}

export default HeaderDialog
