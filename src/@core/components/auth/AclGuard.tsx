// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { Actions, Subjects } from 'src/configs/acl'

// ** Component Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'

import Spinner from 'src/@core/components/spinner'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import { useAbility } from 'src/context/AbilityContext'
import { useAcl } from 'src/context/AclContext'

interface ACLObj {
  action: Actions
  subject: Subjects
}

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { children, guestGuard = false } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const ability = useAbility()
  const { aclRoles } = useAcl()

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (guestGuard || router.route === '/404' || router.route === '/500' || router.route === '/') {
    return <>{children}</>
  }

  // If user is not logged in, let AuthGuard handle it
  if (!auth.user) {
    return <>{children}</>
  }

  // If user is logged in but ACL roles are still loading, show spinner
  if (auth.user && (!aclRoles || Object.keys(aclRoles).length === 0)) {
    return <Spinner />
  }

  // Check the access of current user and render pages
  if (auth.user && ability.can(props.aclAbilities.action, props.aclAbilities.subject)) {
    return <>{children}</>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
