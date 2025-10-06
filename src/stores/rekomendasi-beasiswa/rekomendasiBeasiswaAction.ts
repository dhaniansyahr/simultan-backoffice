import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'
import { downloadBlob } from 'src/utils'

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

// Get all history for rekomendasi beasiswa
export const getAllRekomendasiBeasiswaHistory = createAsyncThunk(
  'rekomendasiBeasiswa/getAllHistory',
  async (params: any, { rejectWithValue }) => {
    try {
      let query = ''
      if (params) {
        query = new URLSearchParams(params).toString()
      }

      const response = await api.get(`/rekomendasi-beasiswa/history${query ? `?${query}` : ''}`)

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

// Cetak surat rekomendasi beasiswa
export const printRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/print',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/rekomendasi-beasiswa/${id}/cetak-surat`, {
        responseType: 'blob'
      })

      if (response.data.type && response.data.type.includes('application/json')) {
        const errorText = await response.data.text()
        try {
          const errorJson = JSON.parse(errorText)
          return rejectWithValue({
            message: errorJson.message || 'Error in response',
            response: { data: errorJson }
          })
        } catch {
          return rejectWithValue({
            message: 'Invalid response format',
            response: { data: { message: errorText } }
          })
        }
      }

      try {
        const result = downloadBlob({
          data: response.data,
          filename: 'rekomendasi-beasiswa.pdf',
          headers: response.headers
        })

        return {
          url: result.url,
          filename: result.filename,
          message: 'Successfully printed rekomendasi beasiswa!'
        }
      } catch (downloadError: any) {
        return rejectWithValue({
          message: downloadError.message || 'An error occurred while downloading the document',
          response: { data: { message: downloadError.message } }
        })
      }
    } catch (error: any) {
      if (error.response?.data instanceof Blob) {
        try {
          const errorBlob = error.response.data
          const errorText = await errorBlob.text()
          try {
            const errorJson = JSON.parse(errorText)
            return rejectWithValue({
              message: errorJson.message || 'An error occurred while printing the document',
              response: { data: errorJson }
            })
          } catch {
            return rejectWithValue({
              message: 'Error reading response',
              response: { data: { message: errorText } }
            })
          }
        } catch {
          return rejectWithValue({
            message: 'Error processing response',
            response: error.response
          })
        }
      }

      return rejectWithValue({
        message: error.message || 'An error occurred while printing the document',
        response: error.response
      })
    }
  }
)

// Input nomor surat rekomendasi beasiswa
export const inputNomorSuratRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/inputNomorSurat',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/rekomendasi-beasiswa/${id}/input-nomor-surat`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// Edit nomor surat rekomendasi beasiswa
export const updateNomorSuratRekomendasiBeasiswa = createAsyncThunk(
  'rekomendasiBeasiswa/updateNomorSurat',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/rekomendasi-beasiswa/${id}/edit-nomor-surat`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
