import { configureStore } from '@reduxjs/toolkit'

import auth from 'src/stores/auth/authSlice'
import acl from 'src/stores/acl/aclSlice'
import users from 'src/stores/user/userSlice'
import collegeCertificate from 'src/stores/college-certificate/certificateLegalizationSlice'
import temporaryLeaveRequest from 'src/stores/temporary-leave-request/temporaryLeaveRequestSlice'
import graduationSubmission from 'src/stores/graduation-submission/graduationSubmissionSlice'
import certificateLegalization from 'src/stores/certificate-legalization/certificateLegalizationSlice'
import suratKeteranganLulus from 'src/stores/surat-keterangan-lulus/suratKeteranganLulusSlice'

// import rekomendasiMahasiswa from 'src/stores/rekomendasi-mahasiswa/rekomendasiMahasiswaSlice'

export const store = configureStore({
  reducer: {
    auth,
    acl,
    users,
    collegeCertificate,
    temporaryLeaveRequest,
    graduationSubmission,
    certificateLegalization,
    suratKeteranganLulus,
    
    // rekomendasiMahasiswa
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
