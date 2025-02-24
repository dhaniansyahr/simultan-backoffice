import { Grid } from '@mui/material'
import React from 'react'
import TemporaryLeaveRequestTable from '../components/table/TemporaryLeaveRequestTable'

const TemporaryLeaveRequest = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TemporaryLeaveRequestTable />
      </Grid>
    </Grid>
  )
}

export default TemporaryLeaveRequest
