import { Icon } from '@iconify/react'
import { Box, IconButton, Menu } from '@mui/material'

type ActionTableProps = {
  children: React.ReactNode
  isOpen: boolean
  onOpen: (event: React.MouseEvent<HTMLElement>) => void
  onClose: () => void
  anchorEl: HTMLElement | null
}

const ActionTable = (props: ActionTableProps) => {
  const { children, isOpen, onOpen, onClose, anchorEl } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={onOpen}>
        <Icon icon='mdi:ellipsis-vertical' />
      </IconButton>
      <Menu
        sx={{ borderRadius: '16px' }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </Menu>
    </Box>
  )
}

export default ActionTable
