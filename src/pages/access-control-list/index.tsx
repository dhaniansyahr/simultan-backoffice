import MainContainer from 'src/libs/access-control-list/containers'
import { checkAccess } from 'src/utils/checkAccess'
import Error401 from '../401'

export default function Index() {
  return checkAccess('SURAT_KETERANGAN_KULIAH', 'VIEW') ? <MainContainer /> : <Error401 />
}
