import CreateContainer from 'src/libs/pengajuan-yudisium/containers/Create'

const CreatePage = () => {
  return <CreateContainer />
}

CreatePage.acl = {
  subject: 'PENGAJUAN_YUDISIUM',
  action: 'CREATE'
}

export default CreatePage
