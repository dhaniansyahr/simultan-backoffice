export interface CreateCutiPayload {
  suratPersetujuanOrangTuaUrl: string
  bebasPustakaUrl: string
  bssFormUrl: string
  reason: string
}

export interface VerificationCutiPayload {
  action: 'USULAN_DISETUJUI' | 'USULAN_DITOLAK'
  reason?: string
  noSurat?: string
}
