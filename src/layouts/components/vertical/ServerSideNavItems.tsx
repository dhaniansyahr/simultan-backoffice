// ** React Imports
import { useEffect, useState } from 'react'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'
import api from 'src/service/api'

const ServerSideNavItems = () => {
  const { user } = useAuth()

  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    api.get(`/acl/menu/${user?.aksesLevelId}`).then(response => {
      const menuArray = response.data.content

      setMenuItems(menuArray)
    })
  }, [user?.aksesLevelId])

  return { menuItems }
}

export default ServerSideNavItems
