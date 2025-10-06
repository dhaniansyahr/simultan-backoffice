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
    setIsRefresh: (state, action) => {
      // Use state and action or replace with _
      state.isRefresh = action.payload
    }
  },
  extraReducers: builder => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
      // Optionally handle fulfilled state, e.g., set isRefresh to true
      state.isRefresh = true
    })
    builder.addCase(resetPassword.rejected, (state) => {
      // Optionally handle rejected state, e.g., set isRefresh to false
      state.isRefresh = false
    })
  }
})

export const { setIsRefresh } = authSlice.actions

export default authSlice.reducer
