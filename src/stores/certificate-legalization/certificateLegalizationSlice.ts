import { createSlice } from '@reduxjs/toolkit'
import { getAllCertificateLegalization } from './certificateLegalizationAction'

const initialState: any = {
  refresher: false
}

const certicateLegalizationSlice = createSlice({
  name: 'certicateLegalizationSlice',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = !state.refresher
    }
  },
  extraReducers: builder => {
    //@ts-ignore
    builder.addCase(getAllCertificateLegalization.fulfilled, null)

    //@ts-ignore
    builder.addCase(getAllCertificateLegalization.rejected, null)
  }
})

export const { setRefresher } = certicateLegalizationSlice.actions

export default certicateLegalizationSlice.reducer
