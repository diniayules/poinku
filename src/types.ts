export type Child = {
  id: string
  nama: string
  avatar: string
  totalPoin: number
}

export type Task = {
  id: string
  childId: string
  judul: string
  poin: number
  ikon: string
  jam?: string
  durasiMenit?: number
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

export type AppData = {
  children: Child[]
  tasks: Task[]
  completions: Completion[]
  adjustments: Adjustment[]
  proposals: Proposal[]
  pinHash: string | null
}
