import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllCollegeCertificate = createAsyncThunk(
  'collegeCertificate/getAll',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/surat-keterangan-kuliah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createCollegeCertificate = createAsyncThunk(
  'collegeCertificate/create',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/surat-keterangan-kuliah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateCollegeCertificate = createAsyncThunk(
  'collegeCertificate/update',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/surat-keterangan-kuliah/' + id, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verificationCollegeCertificate = createAsyncThunk(
  'collegeCertificate/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/surat-keterangan-kuliah/${id}/verification`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const printCollegeCertificate = createAsyncThunk(
  'collegeCertificate/print',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.get(`/surat-keterangan-kuliah/${id}/cetak`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
