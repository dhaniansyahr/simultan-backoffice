import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllSuratKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/getAll',
  async (params: any, { rejectWithValue }) => {
    try {
      let query = ''
      if (params) {
        query = new URLSearchParams(params).toString()
      }

      const response = await api.get(`/surat-keterangan-lulus?${query}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAllSuratKeteranganLulusHistory = createAsyncThunk(
  'suratKeteranganLulus/getAllHistory',
  async (params: any, { rejectWithValue }) => {
    try {
      let query = ''
      if (params) {
        query = new URLSearchParams(params).toString()
      }

      const response = await api.get(`/surat-keterangan-lulus/history?${query}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getSuratKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/getDetail',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/surat-keterangan-lulus/${id}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createSuratKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/create',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/surat-keterangan-lulus', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateSuratKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/update',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/surat-keterangan-lulus/' + id, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verificationSuratKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/surat-keterangan-lulus/${id}/verification`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verifikasiKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/verifikasi',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/surat-keterangan-lulus/${id}/verifikasi`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const inputNomorSurat = createAsyncThunk(
  'collegeCertificate/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/surat-keterangan-lulus/${id}/input-nomor-surat`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateNomorSuratKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/updateNomorSurat',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/surat-keterangan-lulus/${id}/edit-nomor-surat`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
