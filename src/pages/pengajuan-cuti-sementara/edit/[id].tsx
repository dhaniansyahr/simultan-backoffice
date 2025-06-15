import EditContainer from 'src/libs/pengajuan-cuti-sementara/containers/Edit'

const EditPage = () => {
  return <EditContainer />
}

EditPage.acl = {
  subject: 'CUTI_SEMENTARA',
  action: 'UPDATE'
}

export default EditPage
