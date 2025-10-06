import CreateSuratKeteranganLulus from 'src/libs/surat-keterangan-lulus/containers/SuratKeteranganLulusCreateContainer'

const CreateSuratKeteranganLulusPage = () => {
  return <CreateSuratKeteranganLulus />
}

CreateSuratKeteranganLulusPage.acl = {
  subject: 'SURAT_KETERANGAN_LULUS',
  action: 'CREATE'
}

export default CreateSuratKeteranganLulusPage
