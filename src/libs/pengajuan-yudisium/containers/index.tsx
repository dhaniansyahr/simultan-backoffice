import { Grid } from '@mui/material'
import TableYudisium from '../components/table/TableYudisium'

const PengajuanYudisiumContainer = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableYudisium />
      </Grid>
    </Grid>
  )
}

export default PengajuanYudisiumContainer
