import TemporaryLeaveRequest from 'src/libs/pengajuan-cuti-sementara/containers'

const TemporaryLeaveRequestPage = () => {
  return <TemporaryLeaveRequest />
}

TemporaryLeaveRequestPage.acl = {
  subject: 'CUTI_SEMENTARA',
  action: 'VIEW'
}

export default TemporaryLeaveRequestPage
