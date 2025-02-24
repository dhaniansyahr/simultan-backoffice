import { createSlice } from '@reduxjs/toolkit'
import { getAllGraduationSubmission } from './graduationSubmissionAction'

const initialState: any = {
  refresher: false
}

const graduationSubmissionSlice = createSlice({
  name: 'graduationSubmissionSlice',
  initialState,
  reducers: {
    setRefresher: state => {
      state.refresher = !state.refresher
    }
  },
  extraReducers: builder => {
    //@ts-ignore
    builder.addCase(getAllGraduationSubmission.fulfilled, null)

    //@ts-ignore
    builder.addCase(getAllGraduationSubmission.rejected, null)
  }
})

export const { setRefresher } = graduationSubmissionSlice.actions

export default graduationSubmissionSlice.reducer
