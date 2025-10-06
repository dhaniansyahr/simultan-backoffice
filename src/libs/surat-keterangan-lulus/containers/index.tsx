import { Grid } from '@mui/material'
import React from 'react'
import SuratKeteranganLulusTable from 'src/libs/surat-keterangan-lulus/components/table/SuratKeteranganLulusTable'

const SuratKeteranganLulus = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SuratKeteranganLulusTable />
      </Grid>
    </Grid>
  )
}

export default SuratKeteranganLulus
