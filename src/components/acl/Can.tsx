// ** React Imports
import { ReactNode } from 'react'

// ** CASL Imports
import { useAbility } from 'src/context/AbilityContext'
import { Actions, Subjects } from 'src/configs/acl'

// ** Types
interface Props {
  I: Actions
  a: Subjects
  children: ReactNode
  fallback?: ReactNode
}

const Can = ({ I, a, children, fallback = null }: Props) => {
  const ability = useAbility()

  if (ability.can(I, a)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

export default Can
