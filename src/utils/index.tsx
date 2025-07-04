import moment from 'moment'

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

export function getStatus(value: string): { text: string; color: string } {
  if (!value) return { text: '-', color: 'default' }

  const formattedValue = value.split('_').join(' ')

  if (formattedValue.includes('DIPROSES') || formattedValue.includes('SURAT_DIPROSES')) {
    return { text: 'DIPROSES', color: '#FFA500' }
  } else if (formattedValue.includes('DISETUJUI')) {
    return { text: 'DISETUJUI', color: '#008000' }
  } else if (formattedValue.includes('DITOLAK')) {
    return { text: 'DITOLAK', color: '#FF0000' }
  }

  return { text: formattedValue, color: '#6D788D' }
}

export function generateUlid() {
  const timestamp = Date.now()
  const timestampPart = timestamp.toString(32).padStart(10, '0')

  const randomPart = Array.from({ length: 16 }, () => Math.floor(Math.random() * 32).toString(32)).join('')

  return (timestampPart + randomPart).toUpperCase()
}

export const getDocument = (prefix: string, accept = 'application/pdf'): Promise<File | null> => {
  return new Promise(resolve => {
    const inputFile = document.createElement('input')

    inputFile.type = 'file'
    inputFile.accept = accept
    inputFile.style.display = 'none'

    document.body.appendChild(inputFile)
    inputFile.click()

    inputFile.addEventListener('change', (e: any) => {
      const file = e.target.files?.[0]

      let newFile = null

      if (file) {
        newFile = new File([file], `${prefix}_${createTimestamp()}.${file?.name?.split('.')[1]}`, { type: file.type })
      }

      document.body.removeChild(inputFile)
      resolve(newFile)
    })
  })
}

export function getFileNamefromURL(url: string) {
  return url?.split('/')?.pop()?.replace(/%20/g, ' ')
}

export function createTimestamp() {
  return moment().format('YYYYMMDDHHmmss').toString()
}

export interface DownloadBlobOptions {
  data: Blob
  filename: string
  headers?: any
}

export interface DownloadBlobResult {
  url: string
  filename: string
  message: string
}

export const downloadBlob = (options: DownloadBlobOptions): DownloadBlobResult => {
  const { data, filename: defaultFilename, headers } = options

  console.log('Download blob data size:', data.size)
  console.log('Download blob data type:', data.type)

  // Check if response data is empty
  if (!data || data.size === 0) {
    throw new Error('PDF response is empty. Please check if the document exists.')
  }

  let filename = defaultFilename

  // Try to get filename from content-disposition if available
  if (headers?.['content-disposition']) {
    const disposition = headers['content-disposition']
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = filenameRegex.exec(disposition)
    if (matches && matches[1]) {
      filename = matches[1].replace(/['"]/g, '')
    }
  }

  // Create download link and trigger click
  const blob = new Blob([data], { type: data.type || 'application/pdf' })
  console.log('Created blob size:', blob.size)

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a) // This line is important for some browsers
  a.click()
  document.body.removeChild(a) // Clean up
  URL.revokeObjectURL(url)

  return {
    url,
    filename,
    message: `Successfully downloaded ${filename}!`
  }
}
