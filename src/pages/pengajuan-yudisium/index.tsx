import PengajuanYudisiumContainer from 'src/libs/pengajuan-yudisium/containers'

const PengajuanYudisiumPage = () => {
  return <PengajuanYudisiumContainer />
}

PengajuanYudisiumPage.acl = {
  subject: 'PENGAJUAN_YUDISIUM',
  action: 'VIEW'
}

export default PengajuanYudisiumPage
