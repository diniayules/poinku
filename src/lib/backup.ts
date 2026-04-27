import type { AppData } from '../types'
import { todayKey } from '../storage'

const BACKUP_VERSION = 1

type BackupFile = {
  app: 'system-point-anak'
  version: number
  exportedAt: string
  data: AppData
}

function makeFilename(): string {
  const d = new Date()
  const time = `${String(d.getHours()).padStart(2, '0')}${String(
    d.getMinutes(),
  ).padStart(2, '0')}`
  return `poinku-backup-${todayKey(d)}-${time}.json`
}

export function exportData(data: AppData): void {
  const payload: BackupFile = {
    app: 'system-point-anak',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = makeFilename()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function importData(file: File): Promise<AppData> {
  const text = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON')
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid backup')
  }
  const obj = parsed as Partial<BackupFile>
  if (obj.app !== 'system-point-anak') {
    throw new Error('Wrong app')
  }
  const d = obj.data
  if (
    !d ||
    typeof d !== 'object' ||
    !Array.isArray((d as AppData).children) ||
    !Array.isArray((d as AppData).tasks)
  ) {
    throw new Error('Invalid data shape')
  }
  const data = d as Partial<AppData>
  return {
    children: data.children ?? [],
    tasks: data.tasks ?? [],
    completions: data.completions ?? [],
    adjustments: data.adjustments ?? [],
    proposals: data.proposals ?? [],
    rewards: data.rewards ?? [],
    rewardClaims: data.rewardClaims ?? [],
    pinHash: data.pinHash ?? null,
    tema: data.tema ?? 'luar-angkasa',
    bahasa: data.bahasa ?? 'id',
  }
}
