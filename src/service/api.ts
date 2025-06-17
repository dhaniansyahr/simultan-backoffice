import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config

//     // If error is 401 and we haven't tried to refresh token yet
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         // Attempt to refresh token
//         const refreshToken = localStorage.getItem('refreshToken')
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-token`, {
//           refreshToken
//         })

//         // If refresh successful, update tokens
//         if (response.data.token) {
//           localStorage.setItem('token', response.data.token)
//           localStorage.setItem('refreshToken', response.data.refreshToken)

//           // Retry original request with new token
//           api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

//           return api(originalRequest)
//         }
//       } catch (refreshError) {
//         // If refresh token fails, clear storage and redirect to login
//         localStorage.clear()
//         window.location.href = '/login'

//         return Promise.reject(refreshError)
//       }
//     }

//     return Promise.reject(error)
//   }
// )

export default api
