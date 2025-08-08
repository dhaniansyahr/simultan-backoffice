// import { createAsyncThunk } from '@reduxjs/toolkit'
// import api from 'src/service/api'

// export const getAllRekomendasiMahasiswa = createAsyncThunk(
//   'rekomendasiMahasiswa/getAll',
//   async ({ data }: any, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/rekomendasi-mahasiswa', data)

//       return response.data
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   }
// )

// export const getRekomendasiMahasiswa = createAsyncThunk(
//   'rekomendasiMahasiswa/get',
//   async ({ id }: any, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/rekomendasi-mahasiswa/' + id)

//       return response.data
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   }
// )

// export const createRekomendasiMahasiswa = createAsyncThunk(
//   'rekomendasiMahasiswa/create',
//   async ({ data }: any, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/rekomendasi-mahasiswa', data)

//       return response.data
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   }
// )

// export const updateRekomendasiMahasiswa = createAsyncThunk(
//   'rekomendasiMahasiswa/update',
//   async ({ data, id }: any, { rejectWithValue }) => {
//     try {
//       const response = await api.put('/rekomendasi-mahasiswa/' + id, data)

//       return response.data
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   }
// )

// export const verificationRekomendasiMahasiswa = createAsyncThunk(
//   'rekomendasiMahasiswa/verification',
//   async ({ data, id }: any, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/rekomendasi-mahasiswa/${id}/verification`, data)

//       return response.data
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   }
// )

// export const updateNomorSuratRekomendasiMahasiswa = createAsyncThunk(
//   'rekomendasiMahasiswa/updateNomorSurat',
//   async ({ data, id }: any, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/rekomendasi-mahasiswa/${id}/edit-nomor-surat`, data)

//       return response.data
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   }
// )
