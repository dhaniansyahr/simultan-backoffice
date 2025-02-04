// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Surat Keterangan Kuliah',
      path: '/college-certificate'
    },
    {
      title: 'Permohonan Cuti Sementara',
      path: '/temporary-leave-request'
    },

    // {
    //   title: 'Permohonan Aktif Kembali',
    //   path: '/request-reactivation'
    // },
    // {
    //   title: 'Perubahan Mata Kuliah',
    //   path: '/change-of-course'
    // },
    // {
    //   title: 'Pembatalan Mata Kuliah',
    //   path: '/course-cancellation'
    // },
    {
      sectionTitle: 'Others'
    },
    {
      title: 'User Management',
      path: '/user-management',
      icon: 'ix:user-management'
    },
    {
      title: 'ACL',
      path: '/access-control-list',
      icon: 'bx:universal-access'
    }
  ]
}

export default navigation
