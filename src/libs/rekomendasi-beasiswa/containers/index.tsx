import { Grid } from '@mui/material'
import React from 'react'
import RekomendasiBeasiswaTable from 'src/libs/rekomendasi-beasiswa/components/table/RekomendasiBeasiswaTable'

const RekomendasiBeasiswa = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RekomendasiBeasiswaTable />
      </Grid>
    </Grid>
  )
}

export default RekomendasiBeasiswa
