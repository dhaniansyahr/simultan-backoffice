// ** React Imports
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

// ** Types
import api from 'src/service/api'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import { setAclRoles } from 'src/stores/acl/aclSlice'
import { useAuth } from 'src/hooks/useAuth'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

// ** Types
interface AclContextType {
  menuItems: any[]
  aclRoles: any
  fetchMenu: () => Promise<void>
  fetchAclRoles: () => Promise<void>
}

const defaultProvider: AclContextType = {
  menuItems: [],
  aclRoles: {},
  fetchMenu: () => Promise.resolve(),
  fetchAclRoles: () => Promise.resolve()
}

const AclContext = createContext<AclContextType>(defaultProvider)

type Props = {
  children: ReactNode
}

const AclProvider = ({ children }: Props) => {
  const dispatch: AppDispatch = useDispatch()
  const { user } = useAuth()

  // ** States
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType[]>([])
  const [aclRoles, setAclRolesState] = useState<any>({})

  const fetchAclRoles = async () => {
    if (!user?.aksesLevelId) return

    try {
      const response = await api.get(`/acl/${user.aksesLevelId}`)
      const data = response?.data?.content

      // const mappedData = data?.reduce((acc: any, item: any) => {
      //   acc[item.feature] = actionsMap.reduce((actionAcc: any, action: string) => {
      //     actionAcc[action] = item.actions.includes(action)

      //     return actionAcc
      //   }, {})

      //   // If actions array is empty, set all actions to false
      //   if (item.actions.length === 0) {
      //     actionsMap.forEach(action => {
      //       acc[item.feature][action] = false
      //     })
      //   }

      //   return acc
      // }, {})

      dispatch(setAclRoles(data))
      setAclRolesState(data)
    } catch (error) {
      console.error('Error fetching ACL roles:', error)
    }
  }

  const fetchMenu = async () => {
    if (!user?.aksesLevelId) return

    try {
      const response = await api.get(`/acl/menu/${user.aksesLevelId}`)
      const data = response.data?.content || []

      setMenuItems(data)
      window.localStorage.setItem('menuRole', JSON.stringify(data))
    } catch (error) {
      console.error('Error fetching menu:', error)
    }
  }

  useEffect(() => {
    if (user?.aksesLevelId) {
      fetchAclRoles()
      fetchMenu()
    }
  }, [user?.aksesLevelId])

  const values = {
    menuItems,
    aclRoles,
    fetchMenu,
    fetchAclRoles
  }

  return <AclContext.Provider value={values}>{children}</AclContext.Provider>
}

export const useAcl = () => useContext(AclContext)
export { AclContext, AclProvider }
