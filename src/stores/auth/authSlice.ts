import { createSlice } from '@reduxjs/toolkit'
import { resetPassword } from './authAction'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsRefresh: (state, action) => {}
  },
  extraReducers: builder => {
    builder.addCase(resetPassword.fulfilled, (state, { payload }) => {})
    builder.addCase(resetPassword.rejected, state => {})
  }
})

export const { setIsRefresh } = authSlice.actions

export default authSlice.reducer
