// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:home-outline'
    },
    {
      title: 'Surat Keterangan Kuliah',
      path: '/college-certificate'
    },
    {
      title: 'Permohonan Cuti Sementara',
      path: '/permmohonan-cuti-sementara',
      children: [
        {
          title: 'Pengajuan',
          path: '/pengajuan'
        },
        {
          title: 'Verifikasi Pengajuan',
          path: '/verifikasi-pengajuan'
        },
        {
          title: 'Persetujuan',
          path: '/persetujuan'
        },
        {
          title: 'Monitoring Progress',
          path: '/monitoring-progress'
        }
      ]
    },
    {
      title: 'Permohonan Aktif Kembali',
      path: '/permmohonan-aktif-kembali',
      children: [
        {
          title: 'Pengajuan',
          path: '/pengajuan'
        },
        {
          title: 'Verifikasi Pengajuan',
          path: '/verifikasi-pengajuan'
        },
        {
          title: 'Persetujuan',
          path: '/persetujuan'
        },
        {
          title: 'Monitoring Progress',
          path: '/monitoring-progress'
        }
      ]
    },
    {
      title: 'Perubahan Mata Kuliah',
      path: '/perubahan-mata-kuliah',
      children: [
        {
          title: 'Pengajuan',
          path: '/pengajuan'
        },
        {
          title: 'Persetujuan',
          path: '/persetujuan'
        },
        {
          title: 'Monitoring Progress',
          path: '/monitoring-progress'
        }
      ]
    },
    {
      title: 'Pembatalan Mata Kuliah',
      path: '/pembatalan-mata-kuliah',
      children: [
        {
          title: 'Pengajuan',
          path: '/pengajuan'
        },
        {
          title: 'Persetujuan',
          path: '/persetujuan'
        },
        {
          title: 'Monitoring Progress',
          path: '/monitoring-progress'
        }
      ]
    },
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
