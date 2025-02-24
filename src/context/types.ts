export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  identityNumber: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  nama: string
  nomorIdentitas: string
  aksesLevelId: number
  role: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
