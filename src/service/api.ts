import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     if (error.response?.status === 401) {
//       localStorage.clear()
//       window.location.href = '/login'

//       return Promise.reject(error)
//     }

//     return Promise.reject(error)
//   }
// )

export default api
