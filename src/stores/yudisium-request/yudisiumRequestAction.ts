import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllYudisiumRequest = createAsyncThunk(
  'yudisiumRequest/getAll',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/surat-keterangan-kuliah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createYudisiumRequest = createAsyncThunk(
  'yudisiumRequest/create',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/surat-keterangan-kuliah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateYudisiumRequest = createAsyncThunk(
  'yudisiumRequest/update',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/surat-keterangan-kuliah/' + id, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const verificationYudisiumRequest = createAsyncThunk(
  'yudisiumRequest/verification',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/surat-keterangan-kuliah/${id}/verification`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const printYudisiumRequest = createAsyncThunk(
  'yudisiumRequest/print',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      // Set the responseType to 'blob' to properly handle PDF responses
      const response = await api.get(`/surat-keterangan-kuliah/${id}/cetak`, {
        ...data,
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

      // Handle successful PDF blob
      let filename = 'surat-keterangan-kuliah.pdf'

      // Try to get filename from content-disposition if available
      const disposition = response.headers['content-disposition']
      if (disposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(disposition)
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '')
        }
      }

      // Create download link and trigger click
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a) // This line is important for some browsers
      a.click()
      document.body.removeChild(a) // Clean up
      URL.revokeObjectURL(url)

      return {
        url,
        filename,
        message: 'Successfully printed surat keterangan kuliah!'
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
