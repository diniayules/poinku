export type Child = {
  id: string
  nama: string
  avatar: string
  totalPoin: number
}

export type Jadwal = 'setiap-hari' | 'hari-sekolah' | 'akhir-pekan'

export type Task = {
  id: string
  childId: string
  judul: string
  poin: number
  ikon: string
  jam?: string
  durasiMenit?: number
  jadwal?: Jadwal
}

export type CompletionStatus = 'menunggu' | 'disetujui' | 'ditolak'

export type Completion = {
  id: string
  taskId: string
  childId: string
  tanggal: string
  selesaiPada: string
  status: CompletionStatus
  poinSaatDisetujui?: number
}

export type Adjustment = {
  id: string
  childId: string
  tanggal: string
  poin: number
  alasan: string
}

export type Proposal = {
  id: string
  childId: string
  judul: string
  tanggal: string
  dibuatPada: string
  status: CompletionStatus
  poin?: number
}

export type RewardTipe = 'harian' | 'mingguan' | 'bulanan'

export type Reward = {
  id: string
  childId: string
  judul: string
  ikon: string
  harga: number
  tipe: RewardTipe
}

export type RewardClaimStatus = 'menunggu' | 'diberikan' | 'ditolak'

export type RewardClaim = {
  id: string
  rewardId: string
  childId: string
  tipe: RewardTipe
  periodKey: string
  diklaimPada: string
  hargaSaatItu: number
  poinPeriodeSaatItu: number
  status: RewardClaimStatus
}

export type Tema =
  | 'luar-angkasa'
  | 'hutan'
  | 'bawah-laut'
  | 'permen'
  | 'ceria'

export type AppData = {
  children: Child[]
  tasks: Task[]
  completions: Completion[]
  adjustments: Adjustment[]
  proposals: Proposal[]
  rewards: Reward[]
  rewardClaims: RewardClaim[]
  pinHash: string | null
  tema: Tema
}
