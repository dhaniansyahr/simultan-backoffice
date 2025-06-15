export interface CreateCutiPayload {
  suratPersetujuanOrangTuaUrl: string
  bebasPustakaUrl: string
  bssFormUrl: string
  reason: string
}

export interface VerificationCutiPayload {
  action: 'DISETUJUI' | 'DITOLAK'
  alasanPenolakan?: string
  noSurat?: string
}
