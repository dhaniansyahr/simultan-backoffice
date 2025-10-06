import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  refresher: 0
}

const rekomendasiBeasiswaSlice = createSlice({
  name: 'rekomendasiBeasiswa',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = state.refresher + 1
    }
  }
})

export const { setRefresher } = rekomendasiBeasiswaSlice.actions

export default rekomendasiBeasiswaSlice.reducer
