import RekomendasiBeasiswaEditContainer from '../../../libs/rekomendasi-beasiswa/containers/RekomendasiBeasiswaEditContainer'

const EditRekomendasiBeasiswaPage = () => {
  return <RekomendasiBeasiswaEditContainer />
}

EditRekomendasiBeasiswaPage.acl = {
  subject: 'REKOMENDASI_BEASISWA',
  action: 'UPDATE'
}

export default EditRekomendasiBeasiswaPage
