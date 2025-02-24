import { Grid } from '@mui/material'
import React from 'react'
import CertificateLegalizationTable from '../components/table/CertificateLegalizationTable'

const CertificateLegalizationContainer = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CertificateLegalizationTable />
      </Grid>
    </Grid>
  )
}

export default CertificateLegalizationContainer
