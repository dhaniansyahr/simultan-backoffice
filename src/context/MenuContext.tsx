// src/contexts/MenuContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import api from 'src/service/api'

const MenuContext = createContext<{ menu: VerticalNavItemsType }>({ menu: [] })

export const useMenu = () => useContext(MenuContext)

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [menu, setMenu] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    if (user?.aksesLevelId) {
      api.get(`/acl/menu/${user.aksesLevelId}`).then(res => {
        setMenu(res.data)
        window.localStorage.setItem('menuRole', JSON.stringify(res.data.content))
      })
    }
  }, [user?.aksesLevelId])

  return <MenuContext.Provider value={{ menu }}>{children}</MenuContext.Provider>
}
