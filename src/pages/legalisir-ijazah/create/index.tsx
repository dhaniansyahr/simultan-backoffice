import CreateContainer from 'src/libs/legalisit-ijazah/containers/CreateContainer'

const CreatePage = () => {
  return <CreateContainer />
}

CreatePage.acl = {
  action: 'CREATE',
  subject: 'LEGALISIR_IJAZAH'
}

export default CreatePage
