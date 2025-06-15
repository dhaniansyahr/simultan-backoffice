import TemporaryLeaveRequestCreateContainer from 'src/libs/pengajuan-cuti-sementara/containers/TemporaryLeaveRequestCreateContainer'

const TemporaryLeaveRequestCreatePage = () => {
  return <TemporaryLeaveRequestCreateContainer />
}

TemporaryLeaveRequestCreatePage.acl = {
  subject: 'CUTI_SEMENTARA',
  action: 'CREATE'
}

export default TemporaryLeaveRequestCreatePage
