import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllCertificateLegalization = createAsyncThunk(
  'CertificateLegalization/getAll',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/legalisir-ijazah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getCertificateLegalization = createAsyncThunk(
  'CertificateLegalization/get',
  async ({ id }: any, { rejectWithValue }) => {
    try {
      const response = await api.get(`/legalisir-ijazah/${id}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createCertificateLegalization = createAsyncThunk(
  'CertificateLegalization/create',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/legalisir-ijazah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateCertificateLegalization = createAsyncThunk(
  'CertificateLegalization/update',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/legalisir-ijazah/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verificationCertificateLegalization = createAsyncThunk(
  'CertificateLegalization/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/legalisir-ijazah/${id}/verifikasi`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const processCertificateLegalization = createAsyncThunk(
  'CertificateLegalization/process',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/legalisir-ijazah/proses/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
