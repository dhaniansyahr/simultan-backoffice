import { useContext } from 'react'
import { AclContext } from 'src/context/AclContext'

export const useAcl = () => useContext(AclContext)
