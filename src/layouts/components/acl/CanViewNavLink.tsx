// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Actions, Subjects } from 'src/configs/acl'
import { useAbility } from 'src/context/AbilityContext'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useAbility()

  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    return ability && ability.can(navLink?.action as Actions, navLink?.subject as Subjects) ? <>{children}</> : null
  }
}

export default CanViewNavLink
