import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  refresher: 0
}

const suratKeteranganLulusSlice = createSlice({
  name: 'suratKeteranganLulus',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = state.refresher + 1
    }
  }
})

export const { setRefresher } = suratKeteranganLulusSlice.actions

export default suratKeteranganLulusSlice.reducer
