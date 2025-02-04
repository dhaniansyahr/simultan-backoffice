import { Grid } from '@mui/material'
import React from 'react'
import CollegeCertificateTable from '../components/table/CollegeCertificateTable'

const CollegeCertificate = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CollegeCertificateTable />
      </Grid>
    </Grid>
  )
}

export default CollegeCertificate
