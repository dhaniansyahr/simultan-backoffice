import CollegeCertificate from 'src/libs/surat-keterangan-aktif-kuliah/containers'

const CollegeCertificatePage = () => {
  return <CollegeCertificate />
}

CollegeCertificatePage.acl = {
  subject: 'SURAT_KETERANGAN_KULIAH',
  action: 'VIEW'
}

export default CollegeCertificatePage
