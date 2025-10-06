import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'
import { downloadBlob } from 'src/utils'

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

// cetak surat keterangan lulus
export const printSuratKeteranganLulus = createAsyncThunk(
  'suratKeteranganLulus/print',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      // Set the responseType to 'blob' to properly handle PDF responses
      const response = await api.get(`/surat-keterangan-lulus/${id}/cetak-surat`, {
        responseType: 'blob'
      })

      // If the response is a JSON error (API sometimes returns JSON with 200 status)
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

      // Use utility function to download blob
      try {
        const result = downloadBlob({
          data: response.data,
          filename: 'surat-keterangan-lulus.pdf',
          headers: response.headers
        })

        return {
          url: result.url,
          filename: result.filename,
          message: 'Successfully printed surat keterangan lulus!'
        }
      } catch (downloadError: any) {
        return rejectWithValue({
          message: downloadError.message || 'An error occurred while downloading the document',
          response: { data: { message: downloadError.message } }
        })
      }
    } catch (error: any) {
      // Handle error response if it's a blob
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

      // Handle other types of errors
      return rejectWithValue({
        message: error.message || 'An error occurred while printing the document',
        response: error.response
      })
    }
  }
)