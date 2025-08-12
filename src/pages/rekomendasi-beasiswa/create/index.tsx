import React from 'react'
import { NextPage } from 'next'
import AclGuard from 'src/@core/components/auth/AclGuard'
import RekomendasiBeasiswaCreateContainer from 'src/libs/rekomendasi-beasiswa/containers/RekomendasiBeasiswaCreateContainer'

const aclProperties = {
    action: 'CREATE' as const,
    subject: 'REKOMENDASI_BEASISWA' as const
}

const CreateRekomendasiBeasiswa: NextPage = () => {
    return (
        <AclGuard aclAbilities={aclProperties} guestGuard={false} authGuard={true}>
            <RekomendasiBeasiswaCreateContainer />
        </AclGuard>
    )
}

export default CreateRekomendasiBeasiswa