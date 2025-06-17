import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllGraduationSubmission = createAsyncThunk(
  'GraduationSubmission/getAll',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/pengajuan-yudisium', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getGraduationSubmission = createAsyncThunk(
  'GraduationSubmission/getById',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pengajuan-yudisium/${id}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createGraduationSubmission = createAsyncThunk(
  'GraduationSubmission/create',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/pengajuan-yudisium', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateGraduationSubmission = createAsyncThunk(
  'GraduationSubmission/update',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pengajuan-yudisium/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verificationGraduationSubmission = createAsyncThunk(
  'GraduationSubmission/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pengajuan-yudisium/${id}/verifikasi`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
