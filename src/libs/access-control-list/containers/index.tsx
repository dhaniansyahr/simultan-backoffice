import { Grid } from '@mui/material'
import React from 'react'
import AclTable from '../components/table/AclTable'

const MainContainer = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AclTable />
      </Grid>
    </Grid>
  )
}

export default MainContainer
