// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  // Get menu from localStorage
  const menuFromStorage = localStorage.getItem('menuRole')
  const menuItems = menuFromStorage ? JSON.parse(menuFromStorage) : []

  // Always return dashboard along with menu items, regardless if menuItems is empty
  return [
    {
      title: 'Dashboard',
      path: '/dashboard'
    },
    ...(menuItems || []) // Use nullish coalescing to ensure we spread an array
  ]
}
export default navigation
