import { configureStore } from '@reduxjs/toolkit'

import auth from 'src/stores/auth/authSlice'
import acl from 'src/stores/acl/aclSlice'
import users from 'src/stores/user/userSlice'
import collegeCertificate from 'src/stores/college-certificate/collegeCertificateSlice'

export const store = configureStore({
  reducer: {
    auth,
    acl,
    users,
    collegeCertificate
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
