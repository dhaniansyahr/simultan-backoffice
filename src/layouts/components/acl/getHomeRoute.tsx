/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  else return '/surat-keterangan-aktif-kuliah'
}

export default getHomeRoute
