import type { AppData } from './types'

const KEY = 'system-point-anak:data:v1'

const EMPTY: AppData = {
  children: [],
  tasks: [],
  completions: [],
  adjustments: [],
  proposals: [],
  pinHash: null,
}

export function loadData(): AppData {
  const raw = localStorage.getItem(KEY)
  if (!raw) return structuredClone(EMPTY)
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      children: parsed.children ?? [],
      tasks: parsed.tasks ?? [],
      completions: parsed.completions ?? [],
      adjustments: parsed.adjustments ?? [],
      proposals: parsed.proposals ?? [],
      pinHash: parsed.pinHash ?? null,
    }
  } catch {
    return structuredClone(EMPTY)
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function resetData(): void {
  localStorage.removeItem(KEY)
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatJam(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes(),
  ).padStart(2, '0')}`
}

export function hitungLewat(
  jam: string | undefined,
  durasiMenit: number | undefined,
  selesaiPada: string,
): number | null {
  if (!jam || !durasiMenit) return null
  const selesai = new Date(selesaiPada)
  const [h, m] = jam.split(':').map(Number)
  const batas = new Date(selesai)
  batas.setHours(h, m + durasiMenit, 0, 0)
  const diffMenit = Math.round((selesai.getTime() - batas.getTime()) / 60000)
  return diffMenit
}

export async function hashPin(pin: string): Promise<string> {
  const bytes = new TextEncoder().encode(`spa-salt::${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
