export interface VerificationSuratPayload {
  action: 'DITOLAK' | 'DISETUJUI'
  noSurat?: string
  reason?: string
}
