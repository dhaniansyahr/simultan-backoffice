import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'
import { downloadBlob } from 'src/utils'

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
      const response = await api.put(`/pengajuan-yudisium/${id}/verification`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const exportGraduationSubmission = createAsyncThunk(
  'GraduationSubmission/export',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      console.log('Fetching PDF for ID:', id)
      const response = await api.get(`/pengajuan-yudisium/${id}/cetak-bukti-pengajuan`, {
        responseType: 'blob'
      })

      console.log('Response headers:', response.headers)
      console.log('Response data size:', response.data.size)
      console.log('Response data type:', response.data.type)

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
          filename: 'bukti-pengajuan-yudisium.pdf',
          headers: response.headers
        })

        return {
          url: result.url,
          filename: result.filename,
          message: 'Successfully printed bukti pengajuan yudisium!'
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
