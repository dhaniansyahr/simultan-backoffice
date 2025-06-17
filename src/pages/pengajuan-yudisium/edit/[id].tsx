import EditContainer from 'src/libs/pengajuan-yudisium/containers/Edit'

const EditPage = () => {
  return <EditContainer />
}

EditPage.acl = {
  subject: 'PENGAJUAN_YUDISIUM',
  action: 'UPDATE'
}

export default EditPage
