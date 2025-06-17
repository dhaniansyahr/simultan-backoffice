import CertificateLegalizationContainer from 'src/libs/certificate-legalization/containers'

const CertificateLegalizationPage = () => {
  return <CertificateLegalizationContainer />
}

CertificateLegalizationPage.acl = {
  subject: 'LEGALISIR_IJAZAH',
  action: 'VIEW'
}

export default CertificateLegalizationPage
