import { Grid } from '@mui/material'
import React from 'react'
import AccessControlListTable from '../components/table/AccessControlListTable'

const MainContainer = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AccessControlListTable />
      </Grid>
    </Grid>
  )
}

export default MainContainer
