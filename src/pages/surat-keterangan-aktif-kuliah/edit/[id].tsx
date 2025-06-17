import EditContainer from 'src/libs/surat-keterangan-aktif-kuliah/containers/Edit'

const EditPage = () => {
  return <EditContainer />
}

EditPage.acl = {
  action: 'UPDATE',
  subject: 'SURAT_KETERANGAN_KULIAH'
}

export default EditPage
