import type { AppData, Jadwal, RewardTipe, Task, Tema } from './types'

const KEY = 'system-point-anak:data:v1'

const EMPTY: AppData = {
  children: [],
  tasks: [],
  completions: [],
  adjustments: [],
  proposals: [],
  rewards: [],
  rewardClaims: [],
  pinHash: null,
  tema: 'luar-angkasa',
  bahasa: 'id',
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
      rewards: parsed.rewards ?? [],
      rewardClaims: parsed.rewardClaims ?? [],
      pinHash: parsed.pinHash ?? null,
      tema: parsed.tema ?? 'luar-angkasa',
      bahasa: parsed.bahasa ?? 'id',
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

export function isWeekend(d: Date = new Date()): boolean {
  const day = d.getDay()
  return day === 0 || day === 6
}

export function taskBerlakuHariIni(task: Task, d: Date = new Date()): boolean {
  const jadwal: Jadwal = task.jadwal ?? 'setiap-hari'
  if (jadwal === 'setiap-hari') return true
  const weekend = isWeekend(d)
  if (jadwal === 'akhir-pekan') return weekend
  return !weekend
}

export const JADWAL_LABEL: Record<Jadwal, string> = {
  'setiap-hari': 'Setiap hari',
  'hari-sekolah': 'Hari sekolah',
  'akhir-pekan': 'Akhir pekan',
}

export const JADWAL_DICT_KEY: Record<
  Jadwal,
  'jadwalSetiap' | 'jadwalSekolah' | 'jadwalAkhir'
> = {
  'setiap-hari': 'jadwalSetiap',
  'hari-sekolah': 'jadwalSekolah',
  'akhir-pekan': 'jadwalAkhir',
}

export const JADWAL_ICON: Record<Jadwal, string> = {
  'setiap-hari': '📆',
  'hari-sekolah': '🎒',
  'akhir-pekan': '🏖️',
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

export const TEMA_LABEL: Record<Tema, string> = {
  'luar-angkasa': 'Luar Angkasa',
  hutan: 'Hutan Petualangan',
  'bawah-laut': 'Bawah Laut',
  permen: 'Negeri Permen',
  ceria: 'Ceria',
}

export const TEMA_IKON: Record<Tema, string> = {
  'luar-angkasa': '🚀',
  hutan: '🌳',
  'bawah-laut': '🐠',
  permen: '🍭',
  ceria: '🌈',
}

export const TEMA_HOME_EMOJI: Record<Tema, string> = {
  'luar-angkasa': '👩‍🚀',
  hutan: '🦊',
  'bawah-laut': '🐠',
  permen: '🍭',
  ceria: '🦄',
}

export const TEMA_HOME_TITLE_KEY: Record<
  Tema,
  | 'homeTitleLuarAngkasa'
  | 'homeTitleHutan'
  | 'homeTitleBawahLaut'
  | 'homeTitlePermen'
  | 'homeTitleCeria'
> = {
  'luar-angkasa': 'homeTitleLuarAngkasa',
  hutan: 'homeTitleHutan',
  'bawah-laut': 'homeTitleBawahLaut',
  permen: 'homeTitlePermen',
  ceria: 'homeTitleCeria',
}

export const TEMA_FLOATERS: Record<Tema, string[]> = {
  'luar-angkasa': ['🪐', '🛸', '🌟', '☄️', '👾'],
  hutan: ['🦊', '🐿️', '🍄', '🦋', '🐞'],
  'bawah-laut': ['🐙', '🦀', '🐚', '🐡', '🐳'],
  permen: ['🍩', '🍦', '🍰', '🧁', '🍬'],
  ceria: ['🌈', '🎈', '🎀', '🦄', '🎨'],
}

export const TEMA_OPSI: Tema[] = [
  'luar-angkasa',
  'hutan',
  'bawah-laut',
  'permen',
  'ceria',
]

export const REWARD_TIPE_DICT_KEY: Record<
  RewardTipe,
  'rewardTipeHarian' | 'rewardTipeMingguan' | 'rewardTipeBulanan'
> = {
  harian: 'rewardTipeHarian',
  mingguan: 'rewardTipeMingguan',
  bulanan: 'rewardTipeBulanan',
}

export const REWARD_TIPE_LOWER_KEY: Record<
  RewardTipe,
  'periodeHarianLower' | 'periodeMingguanLower' | 'periodeBulananLower'
> = {
  harian: 'periodeHarianLower',
  mingguan: 'periodeMingguanLower',
  bulanan: 'periodeBulananLower',
}

export const REWARD_TIPE_LABEL: Record<RewardTipe, string> = {
  harian: 'Harian',
  mingguan: 'Mingguan',
  bulanan: 'Bulanan',
}

export const REWARD_TIPE_ICON: Record<RewardTipe, string> = {
  harian: '☀️',
  mingguan: '📅',
  bulanan: '🗓️',
}

export function startOfWeek(d: Date = new Date()): Date {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function startOfMonth(d: Date = new Date()): Date {
  const m = new Date(d.getFullYear(), d.getMonth(), 1)
  return m
}

export function periodKey(tipe: RewardTipe, d: Date = new Date()): string {
  if (tipe === 'harian') return todayKey(d)
  if (tipe === 'mingguan') return `W-${todayKey(startOfWeek(d))}`
  return `M-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function dateInRange(tanggal: string, start: string, end: string): boolean {
  return tanggal >= start && tanggal <= end
}

export function periodRange(
  tipe: RewardTipe,
  d: Date = new Date(),
): { start: string; end: string } {
  if (tipe === 'harian') {
    const k = todayKey(d)
    return { start: k, end: k }
  }
  if (tipe === 'mingguan') {
    const start = startOfWeek(d)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start: todayKey(start), end: todayKey(end) }
  }
  const start = startOfMonth(d)
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return { start: todayKey(start), end: todayKey(end) }
}

export function semuaTugasHariIniSelesai(
  data: AppData,
  childId: string,
  d: Date = new Date(),
): boolean {
  const today = todayKey(d)
  const tasks = data.tasks.filter(
    (t) => t.childId === childId && taskBerlakuHariIni(t, d),
  )
  if (tasks.length === 0) return true
  return tasks.every((t) =>
    data.completions.some(
      (c) =>
        c.taskId === t.id &&
        c.tanggal === today &&
        c.status !== 'ditolak',
    ),
  )
}

export function poinDalamPeriode(
  data: AppData,
  childId: string,
  tipe: RewardTipe,
  d: Date = new Date(),
): number {
  const { start, end } = periodRange(tipe, d)
  let total = 0
  for (const c of data.completions) {
    if (c.childId !== childId) continue
    if (c.status !== 'disetujui') continue
    if (!dateInRange(c.tanggal, start, end)) continue
    const t = data.tasks.find((tt) => tt.id === c.taskId)
    total += c.poinSaatDisetujui ?? t?.poin ?? 0
  }
  for (const a of data.adjustments) {
    if (a.childId !== childId) continue
    if (!dateInRange(a.tanggal, start, end)) continue
    total += a.poin
  }
  for (const p of data.proposals) {
    if (p.childId !== childId) continue
    if (p.status !== 'disetujui') continue
    if (!dateInRange(p.tanggal, start, end)) continue
    total += p.poin ?? 0
  }
  return Math.max(0, total)
}

export async function hashPin(pin: string): Promise<string> {
  const bytes = new TextEncoder().encode(`spa-salt::${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
