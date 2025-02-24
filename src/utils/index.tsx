export const formatMoney = (amount: number, currency = 'IDR') => {
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: currency
  })
}

export const checkFileType = (file: string) => {
  const extension = file?.split('.').pop()?.toLowerCase()
  let fileType = null

  if (
    extension === 'jpg' ||
    extension === 'jpeg' ||
    extension === 'png' ||
    extension === 'gif' ||
    extension === 'bmp' ||
    extension === 'webp' ||
    extension === 'svg'
  ) {
    fileType = 'image'
  } else if (
    extension === 'mp4' ||
    extension === 'webm' ||
    extension === 'ogg' ||
    extension === 'avi' ||
    extension === 'mpeg' ||
    extension === 'mov' ||
    extension === 'flv'
  ) {
    fileType = 'video'
  } else {
    fileType = 'other'
  }

  return fileType
}

export function formatString(str: string): string {
  if (!str) return '-'

  return str
    .split('_')
    .filter(word => word)
    .map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(' ')
    .trim()
}

export function getStatus(value: string): string {
  if (!value) return '-'

  const formattedValue = value.split('_').join(' ')

  if (formattedValue.includes('DIPROSES') || formattedValue.includes('SURAT_DIPROSES')) {
    return 'DIPROSES'
  } else if (formattedValue.includes('DISETUJUI') || formattedValue.includes('USULAN_DISETUJUI')) {
    return 'DISETUJUI'
  } else if (formattedValue.includes('DITOLAK') || formattedValue.includes('USULAN_DITOLAK')) {
    return 'DITOLAK'
  }

  return formattedValue
}
