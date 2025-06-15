import { ReactNode } from 'react'
import { useAbility } from 'src/context/AbilityContext'
import { Actions, Subjects } from 'src/configs/acl'

interface CanProps {
  I: Actions
  a: Subjects
  children: ReactNode
  fallback?: ReactNode
}

const Can = ({ I, a, children, fallback = null }: CanProps) => {
  const ability = useAbility()

  if (ability.can(I, a)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

export default Can
