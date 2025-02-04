import { createSlice } from '@reduxjs/toolkit'
import { getAllUsers } from './userAction'

const initialState: any = {
  refresher: false
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = !state.refresher
    }
  },
  extraReducers: builder => {
    //@ts-ignore
    builder.addCase(getAllUsers.fulfilled, null)

    //@ts-ignore
    builder.addCase(getAllUsers.rejected, null)
  }
})

export const { setRefresher } = userSlice.actions

export default userSlice.reducer
