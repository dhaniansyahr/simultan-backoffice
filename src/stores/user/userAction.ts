import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllUsers = createAsyncThunk('users/getAll', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.get('/users', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createUsers = createAsyncThunk('user/create', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/users', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateUsers = createAsyncThunk('user/update', async ({ data, id }: any, { rejectWithValue }) => {
  try {
    const response = await api.put('/users/' + id, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const deleteUsers = createAsyncThunk('user/delete', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.delete('/users/', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
