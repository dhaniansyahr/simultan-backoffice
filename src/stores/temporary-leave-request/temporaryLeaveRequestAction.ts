import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllTemporaryLeaveRequest = createAsyncThunk(
  'temporaryLeaveRequest/getAll',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/cuti-sementara', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getTemporaryLeaveRequest = createAsyncThunk(
  'temporaryLeaveRequest/get',
  async ({ id }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/cuti-sementara/' + id)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createTemporaryLeaveRequest = createAsyncThunk(
  'temporaryLeaveRequest/create',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/cuti-sementara', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateTemporaryLeaveRequest = createAsyncThunk(
  'temporaryLeaveRequest/update',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/cuti-sementara/' + id, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verificationTemporaryLeaveRequest = createAsyncThunk(
  'temporaryLeaveRequest/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cuti-sementara/${id}/verifikasi`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
