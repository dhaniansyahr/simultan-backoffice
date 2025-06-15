// ** React Imports
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

// ** CASL Imports
import { AppAbility, buildAbilityFor, Subjects, Actions } from 'src/configs/acl'

// ** Types
import { useAcl } from './AclContext'
import { useAuth } from 'src/hooks/useAuth'

// ** Context
const AbilityContext = createContext<AppAbility | null>(null)

// ** Provider Props
type Props = {
  children: ReactNode
}

const AbilityProvider = ({ children }: Props) => {
  const { aclRoles } = useAcl()
  const { user } = useAuth()
  const [ability, setAbility] = useState<AppAbility | null>(null)

  console.log('aclRoles', aclRoles)

  useEffect(() => {
    if (user && aclRoles && typeof aclRoles === 'object' && Object.keys(aclRoles).length > 0) {
      // Transform aclRoles object to permissions array
      const permissions = Object.entries(aclRoles).map(([feature, actionsObj]: [string, any]) => ({
        feature: feature as Subjects,
        actions: Object.entries(actionsObj)
          .filter(([, allowed]) => allowed === true)
          .map(([action]) => action as Actions)
      }))

      console.log('Building ability with permissions:', permissions)
      const newAbility = buildAbilityFor(permissions)
      setAbility(newAbility)
    } else if (!user) {
      // User is not logged in, set empty ability
      setAbility(buildAbilityFor([]))
    }

    // If user exists but aclRoles is not ready yet, keep ability as null (loading state)
  }, [aclRoles, user])

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}

// ** Hook
export const useAbility = () => {
  const ability = useContext(AbilityContext)
  if (!ability) {
    // Return default ability instead of throwing error
    return buildAbilityFor([])
  }

  return ability
}

export { AbilityContext, AbilityProvider }
