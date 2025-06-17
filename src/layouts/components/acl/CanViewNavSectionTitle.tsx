// ** React Imports
import { ReactNode } from 'react'

// ** Component Imports

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'
import { Actions, Subjects } from 'src/configs/acl'
import { useAbility } from 'src/context/AbilityContext'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props

  // ** Hook
  const ability = useAbility()

  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else {
    return ability && ability.can(navTitle?.action as Actions, navTitle?.subject as Subjects) ? <>{children}</> : null
  }
}

export default CanViewNavSectionTitle
