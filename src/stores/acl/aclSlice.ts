import { createSlice } from '@reduxjs/toolkit'
import { getAllUserLevels } from './aclAction'

const initialState: any = {
  refresher: false,
  aclRoles: {}
}

const aclSlice = createSlice({
  name: 'aclSlice',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = !state.refresher
    },
    setAclRoles: (state, action) => {
      state.aclRoles = action.payload

      localStorage.setItem('aclRoles', JSON.stringify(action.payload))
    },
    resetRoles: state => {
      state.aclRoles = []
      localStorage.removeItem('aclRoles')
    }
  },
  extraReducers: builder => {
    //@ts-ignore
    builder.addCase(getAllUserLevels.fulfilled, null)

    //@ts-ignore
    builder.addCase(getAllUserLevels.rejected, null)
  }
})

export const { setRefresher, setAclRoles, resetRoles } = aclSlice.actions

export default aclSlice.reducer
