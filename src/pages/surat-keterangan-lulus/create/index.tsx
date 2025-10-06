import React from 'react'
import { NextPage } from 'next'
import AclGuard from 'src/@core/components/auth/AclGuard'
import SuratKeteranganLulusCreateContainer from 'src/libs/surat-keterangan-lulus/containers/SuratKeteranganLulusCreateContainer'

const aclProperties = {
  action: 'CREATE' as const,
  subject: 'SURAT_KETERANGAN_LULUS' as const
}

const CreateSuratKeteranganLulus: NextPage = () => {
  return (
    <AclGuard aclAbilities={aclProperties} guestGuard={false} authGuard={true}>
      <SuratKeteranganLulusCreateContainer />
    </AclGuard>
  )
}

export default CreateSuratKeteranganLulus
