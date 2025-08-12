import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/getAll',
  async (params: any, { rejectWithValue }) => {
    try {
      let query = ''
      if (params) {
        query = new URLSearchParams(params).toString()
      }

      const response = await api.get(`/rekomendasi-beasiswa?${query}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/get',
  async ({ id }: any, { rejectWithValue }) => {
    try {
      const response = await api.get(`/rekomendasi-beasiswa/${id}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/create',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/rekomendasi-beasiswa', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/update',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/rekomendasi-beasiswa/' + id, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verificationRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/rekomendasi-beasiswa/${id}/verification`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
