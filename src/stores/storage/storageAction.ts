import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const uploadToStorage = createAsyncThunk('uploadFile', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(`https://api.labskill.net/upload-file`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
