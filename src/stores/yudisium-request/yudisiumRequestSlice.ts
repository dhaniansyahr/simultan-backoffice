import { createSlice } from '@reduxjs/toolkit'
import { getAllYudisiumRequest } from './yudisiumRequestAction'

const initialState: any = {
  refresher: false
}

const yudisiumRequestSlice = createSlice({
  name: 'yudisiumRequestSlice',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = !state.refresher
    }
  },
  extraReducers: builder => {
    //@ts-ignore
    builder.addCase(getAllYudisiumRequest.fulfilled, null)

    //@ts-ignore
    builder.addCase(getAllYudisiumRequest.rejected, null)
  }
})

export const { setRefresher } = yudisiumRequestSlice.actions

export default yudisiumRequestSlice.reducer
