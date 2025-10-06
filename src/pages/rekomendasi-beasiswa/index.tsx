import RekomendasiBeasiswa from 'src/libs/rekomendasi-beasiswa/containers'

const RekomendasiBeasiswaPage = () => {
  return <RekomendasiBeasiswa />
}

RekomendasiBeasiswaPage.acl = {
  subject: 'REKOMENDASI_BEASISWA',
  action: 'VIEW'
}

export default RekomendasiBeasiswaPage
