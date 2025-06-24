import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'
import { downloadBlob } from 'src/utils'

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

// untuk menampilkan seluruh data (history)
export const getAllCollegeCertificateHistory = createAsyncThunk(
  'collegeCertificate/getAllHistory',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/surat-keterangan-kuliah/history', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getCollegeCertificate = createAsyncThunk(
  'collegeCertificate/getDetail',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/surat-keterangan-kuliah/${id}`)

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

export const inputNomorSurat = createAsyncThunk(
  'collegeCertificate/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/surat-keterangan-kuliah/${id}/input-nomor-surat`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

//edit nomor surat
export const editNomorSurat = createAsyncThunk(
  'collegeCertificate/editNomorSurat',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/surat-keterangan-kuliah/${id}/nomor-surat`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const printCollegeCertificate = createAsyncThunk(
  'collegeCertificate/print',
  async ({ id }: any, { rejectWithValue }) => {
    try {
      // Set the responseType to 'blob' to properly handle PDF responses
      const response = await api.get(`/surat-keterangan-kuliah/${id}/cetak-surat`, {
        responseType: 'blob'
      })

      // Check if the response is actually an error (some APIs return JSON errors with 200 status)
      if (response.data.type && response.data.type.includes('application/json')) {
        const errorText = await response.data.text()
        try {
          const errorJson = JSON.parse(errorText)

          return rejectWithValue({
            message: errorJson.message || 'Error in response',
            response: { data: errorJson }
          })
        } catch (e) {
          // If it's not valid JSON but still has application/json type, something's wrong
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
          filename: 'surat-keterangan-kuliah.pdf',
          headers: response.headers
        })

        return {
          url: result.url,
          filename: result.filename,
          message: 'Successfully printed surat keterangan kuliah!'
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
          } catch (e) {
            // Not valid JSON
            return rejectWithValue({
              message: 'Error reading response',
              response: { data: { message: errorText } }
            })
          }
        } catch (e) {
          // Error reading blob
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
