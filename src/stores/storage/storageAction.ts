import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const uploadToStorage = createAsyncThunk('admin/storage/upload', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(`https://ctbstorage.nwappservice.com/storage`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (err) {
    return rejectWithValue(err)
  }
})
