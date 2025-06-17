// ** React Imports
import { ReactNode, createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import api from 'src/service/api'
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types'

import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'

import { setAclRoles } from 'src/stores/acl/aclSlice'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const dispatch: AppDispatch = useDispatch()

  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await api
          .post(authConfig.meEndpoint, {
            token: `${storedToken}`
          })
          .then(async () => {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            api.defaults.headers.common['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone

            setLoading(false)
            setUser(JSON.parse(localStorage.getItem('userData')!))
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    api
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.content?.token)
        window.localStorage.setItem(authConfig.onTokenExpiration, response.data.content?.refreshToken)

        setUser({
          id: response?.data?.content?.user?.id,
          nama: response.data.content?.user?.nama,
          nomorIdentitas: response.data.content?.user?.npm,
          role: response.data.content?.user?.aksesLevel?.name ?? 'ADMIN',
          aksesLevelId: response.data.content?.user?.aksesLevelId
        })
        await window.localStorage.setItem(
          'userData',
          JSON.stringify({
            id: response?.data?.content?.user?.id,
            nama: response.data.content?.user?.nama,
            nomorIdentitas: response.data.content?.user?.npm,
            role: response.data.content?.user?.aksesLevel?.name ?? 'ADMIN',
            aksesLevelId: response.data.content?.user?.aksesLevelId
          })
        )

        await api
          .get(`/acl/${response.data.content?.user?.aksesLevelId}`, {
            headers: {
              Authorization: `Bearer ${response.data.content?.token}`
            }
          })
          .then(res => {
            const data = res?.data?.content

            dispatch(setAclRoles(data))
          })

        await api
          .get(`/acl/menu/${response.data.content?.user?.aksesLevelId}`, {
            headers: {
              Authorization: `Bearer ${response.data.content?.token}`
            }
          })
          .then(res => {
            const data = res.data?.content

            window.localStorage.setItem('menuRole', JSON.stringify(data))
          })
      })
      .then(() => {
        api
          .post(authConfig.meEndpoint, {
            token: `${window.localStorage.getItem(authConfig.storageTokenKeyName)}`!
          })
          .then(async () => {
            const returnUrl = router.query.returnUrl

            api.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem(
              authConfig.storageTokenKeyName
            )}`
            api.defaults.headers.common['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

            window.location.href = redirectURL as string
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('aclRoles')
    window.localStorage.removeItem('menuRole')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.onTokenExpiration)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
