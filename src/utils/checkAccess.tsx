export function checkAccess(
  feature: string,
  action: 'CREATE' | 'VIEW' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'VERIFICATION'
) {
  const getAcl = typeof window !== 'undefined' ? localStorage.getItem('aclRoles') : null
  const aclRoles = getAcl ? JSON.parse(getAcl) : {}

  return aclRoles[feature]?.[action]
}
