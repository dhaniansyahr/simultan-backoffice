// ** Type Imports
import { AbilityBuilder, PureAbility, AbilityClass } from '@casl/ability'

// ** Subject Types
export type Subjects =
  | 'all'
  | 'SURAT_KETERANGAN_KULIAH'
  | 'CUTI_SEMENTARA'
  | 'PENGAJUAN_YUDISIUM'
  | 'LEGALISIR_IJAZAH'
  | 'USER_MANAGEMENT'
  | 'ACL'

// ** Action Types
export type Actions = 'CREATE' | 'UPDATE' | 'VIEW' | 'EXPORT' | 'VERIFICATION'

// ** Define AppAbility type
export type AppAbility = PureAbility<[Actions, Subjects]>

// ** Define AppAbility class
export class AppAbilityClass extends PureAbility<[Actions, Subjects]> {}

// ** Define ability builder
export const buildAbilityFor = (permissions: Array<{ feature: Subjects; actions: Actions[] }>) => {
  const { can, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>)

  permissions.forEach(({ feature, actions }) => {
    actions.forEach(action => {
      can(action, feature)
    })
  })

  return build()
}

// ** Default ACL object - using 'all' subject for default pages
export const defaultACLObj = {
  action: 'VIEW' as Actions,
  subject: 'all' as Subjects
}
