import { createSlice } from '@reduxjs/toolkit'
import { getAllTemporaryLeaveRequest } from './temporaryLeaveRequestAction'

const initialState: any = {
  refresher: false
}

const temporaryLeaveRequestSlice = createSlice({
  name: 'temporaryLeaveRequestSlice',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = !state.refresher
    }
  },
  extraReducers: builder => {
    //@ts-ignore
    builder.addCase(getAllTemporaryLeaveRequest.fulfilled, null)

    //@ts-ignore
    builder.addCase(getAllTemporaryLeaveRequest.rejected, null)
  }
})

export const { setRefresher } = temporaryLeaveRequestSlice.actions

export default temporaryLeaveRequestSlice.reducer
