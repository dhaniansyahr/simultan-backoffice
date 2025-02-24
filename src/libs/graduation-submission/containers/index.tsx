import { Grid } from '@mui/material'
import React from 'react'
import YudisiumRequestTable from '../components/table/YudisiumRequestTable'

const YudisiumRequest = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <YudisiumRequestTable />
      </Grid>
    </Grid>
  )
}

export default YudisiumRequest
