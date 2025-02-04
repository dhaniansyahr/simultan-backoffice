import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllUserLevels = createAsyncThunk('acl/getAllLevelAkses', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.get('/acl/level-akses', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createUserLevel = createAsyncThunk('acl/createUserLevel', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/user-levels', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getAllFeauture = createAsyncThunk('acl/getAllFeauture', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.get('/acl/features', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getFeatureByUserLevel = createAsyncThunk(
  'acl/getFeatureByUserLevel',
  async ({ id }: any, { rejectWithValue }) => {
    try {
      const response = await api.get(`/acl/${id}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createAcl = createAsyncThunk('acl/createAcl', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/acl', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
