import SuratKeteranganLulus from 'src/libs/surat-keterangan-lulus/containers'

const SuratKeteranganLulusPage = () => {
  return <SuratKeteranganLulus />
}

SuratKeteranganLulusPage.acl = {
  subject: 'SURAT_KETERANGAN_LULUS',
  action: 'VIEW'
}

export default SuratKeteranganLulusPage
