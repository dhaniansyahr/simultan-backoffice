import { createSlice } from '@reduxjs/toolkit'
import { getAllCollegeCertificate } from './collegeCertificateAction'

const initialState: any = {
  refresher: false
}

const collegeCertificateSlice = createSlice({
  name: 'collegeCertificateSlice',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = !state.refresher
    }
  },
  extraReducers: builder => {
    //@ts-ignore
    builder.addCase(getAllCollegeCertificate.fulfilled, null)

    //@ts-ignore
    builder.addCase(getAllCollegeCertificate.rejected, null)
  }
})

export const { setRefresher } = collegeCertificateSlice.actions

export default collegeCertificateSlice.reducer
