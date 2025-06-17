import { Grid } from '@mui/material'
import React from 'react'
import TableLegalisirIjazah from '../components/table/TableLegalisirIjazah'

const CertificateLegalizationContainer = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableLegalisirIjazah />
      </Grid>
    </Grid>
  )
}

export default CertificateLegalizationContainer
