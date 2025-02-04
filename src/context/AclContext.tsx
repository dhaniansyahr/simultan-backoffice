import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from 'src/hooks/useAuth'
import { getFeatureByUserLevel } from 'src/stores/acl/aclAction'
import { setAclRoles } from 'src/stores/acl/aclSlice'

interface TAclContextProps {
  children: React.ReactNode
  fallback: JSX.Element
}

const actionsMap = ['CREATE', 'VIEW', 'UPDATE', 'DELETE', 'EXPORT', 'VERIFICATION']

const AclContext = ({ children, fallback }: TAclContextProps) => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const queryParams = new URLSearchParams(window.location.search)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleGetAcl = async () => {
    setIsLoading(false)

    // @ts-ignore
    await dispatch(getFeatureByUserLevel({ id: user?.userLevelId })).then((res: any) => {
      const data = res?.payload?.content

      const mappedData = data?.reduce((acc: any, item: any) => {
        acc[item.feature] = actionsMap.reduce((actionAcc: any, action: string) => {
          actionAcc[action] = item.actions.includes(action)

          return actionAcc
        }, {})

        // If actions array is empty, set all actions to false
        if (item.actions.length === 0) {
          actionsMap.forEach(action => {
            acc[item.feature][action] = false
          })
        }

        return acc
      }, {})

      dispatch(setAclRoles(mappedData))
      setIsLoading(true)
    })
  }

  useEffect(() => {
    if (user) {
      handleGetAcl()
    }
  }, [user])

  useEffect(() => {
    if (queryParams.get('isHome') && window.location.pathname?.includes('modul-analitik/level-principal')) {
      window.location.href = '/modul-analitik/level-principal'
    }
  }, [])

  if (!isLoading && user !== null) {
    return fallback
  }

  return <>{children}</>
}

export default AclContext
