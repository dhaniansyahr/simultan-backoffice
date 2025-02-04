import { Grid } from '@mui/material'
import React from 'react'
import UserManagementTable from '../components/table/UseManagementTable'

const UserManagement = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserManagementTable />
      </Grid>
    </Grid>
  )
}

export default UserManagement
