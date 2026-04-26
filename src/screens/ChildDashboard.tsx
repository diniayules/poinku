import { useState } from 'react'
import { isWeekend, taskBerlakuHariIni, todayKey, uid } from '../storage'
import type { AppData, Completion, Proposal } from '../types'
import { HadiahSection } from '../components/HadiahSection'
import { RewardCelebration } from '../components/RewardCelebration'
import { EmojiOrImg } from '../components/EmojiOrImg'

type Props = {
  data: AppData
  childId: string
  setData: (d: AppData) => void
  onBack: () => void
}

export function ChildDashboard({ data, childId, setData, onBack }: Props) {
  const [usulOpen, setUsulOpen] = useState(false)
  const [usulJudul, setUsulJudul] = useState('')

  const child = data.children.find((c) => c.id === childId)
  if (!child) return null

  const today = todayKey()
  const now = new Date()
  const weekendNow = isWeekend(now)
  const tasks = data.tasks
    .filter((t) => t.childId === childId && taskBerlakuHariIni(t, now))
    .slice()
    .sort((a, b) => {
      if (a.jam && b.jam) return a.jam.localeCompare(b.jam)
      if (a.jam) return -1
      if (b.jam) return 1
      return 0
    })

  const proposalsHariIni = data.proposals
    .filter(
      (p) =>
        p.childId === childId &&
        p.tanggal === today &&
        p.status !== 'ditolak',
    )
    .slice()
    .sort((a, b) => a.dibuatPada.localeCompare(b.dibuatPada))

  const findCompletion = (taskId: string): Completion | undefined =>
    data.completions.find(
      (c) =>
        c.taskId === taskId && c.tanggal === today && c.status !== 'ditolak',
    )

  function markDone(taskId: string) {
    const existing = findCompletion(taskId)
    if (existing) return
    const completion: Completion = {
      id: uid(),
      taskId,
      childId,
      tanggal: today,
      selesaiPada: new Date().toISOString(),
      status: 'menunggu',
    }
    setData({
      ...data,
      completions: [...data.completions, completion],
    })
  }

  function kirimUsul() {
    if (!usulJudul.trim()) return
    const proposal: Proposal = {
      id: uid(),
      childId,
      judul: usulJudul.trim(),
      tanggal: today,
      dibuatPada: new Date().toISOString(),
      status: 'menunggu',
    }
    setData({
      ...data,
      proposals: [...data.proposals, proposal],
    })
    setUsulJudul('')
    setUsulOpen(false)
  }

  return (
    <div className="screen">
      <button className="back-btn" onClick={onBack}>
        ← Ganti Profil
      </button>

      <div className="dash-header">
        <span className="avatar">
          <EmojiOrImg value={child.avatar} imgSize={88} />
        </span>
        <div className="info">
          <h2>{child.nama}</h2>
          <div className="poin-total">⭐ {child.totalPoin}</div>
        </div>
      </div>

      <h3 className="dash-section-title">
        Tugas Hari Ini
        <span className="badge-hari">
          {weekendNow ? '🏖️ Akhir Pekan' : '🎒 Hari Sekolah'}
        </span>
      </h3>
      <div className="task-list">
        {tasks.length === 0 && proposalsHariIni.length === 0 && (
          <div className="empty-state">
            Belum ada tugas hari ini. Kamu bisa menambahkan sendiri 👇
          </div>
        )}
        {tasks.map((t) => {
          const comp = findCompletion(t.id)
          const status = comp?.status
          const disabled = !!comp
          return (
            <button
              key={t.id}
              className={`task-item ${status ?? ''}`}
              onClick={() => markDone(t.id)}
              disabled={disabled}
            >
              <span
                className={`checkbox ${status ? 'checked' : ''} ${
                  status === 'disetujui' ? 'approved' : ''
                }`}
                aria-hidden="true"
              >
                {status && <span className="check">✓</span>}
              </span>
              <span className="task-body">
                <span className="judul-row">
                  <span className="ikon">
                    <EmojiOrImg value={t.ikon} imgSize={36} imgRadius={10} />
                  </span>
                  <span className="judul-teks">{t.judul}</span>
                  {!status && <span className="poin-badge">+{t.poin}</span>}
                </span>
                {(t.jam || t.durasiMenit) && (
                  <span className="jam-badge">
                    {t.jam && `🕐 ${t.jam}`}
                    {t.jam && t.durasiMenit && ' · '}
                    {t.durasiMenit && `⏱️ ${t.durasiMenit} menit`}
                  </span>
                )}
                {status === 'menunggu' && (
                  <span className="status-text menunggu">
                    ⏳ Menunggu konfirmasi orang tua…
                  </span>
                )}
                {status === 'disetujui' && (
                  <span className="status-text disetujui">
                    ✨ Disetujui! +{t.poin} poin masuk
                  </span>
                )}
              </span>
            </button>
          )
        })}

        {proposalsHariIni.map((p) => {
          const status = p.status
          return (
            <div key={p.id} className={`task-item ${status}`}>
              <span
                className={`checkbox checked ${
                  status === 'disetujui' ? 'approved' : ''
                }`}
                aria-hidden="true"
              >
                <span className="check">✓</span>
              </span>
              <span className="task-body">
                <span className="judul-row">
                  <span className="ikon">✨</span>
                  <span className="judul-teks">{p.judul}</span>
                  <span className="badge-usul">Usulan</span>
                </span>
                {status === 'menunggu' && (
                  <span className="status-text menunggu">
                    ⏳ Menunggu orang tua menentukan poinnya…
                  </span>
                )}
                {status === 'disetujui' && (
                  <span className="status-text disetujui">
                    ✨ Disetujui! +{p.poin ?? 0} poin masuk
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>

      {!usulOpen ? (
        <button
          className="btn-usul"
          onClick={() => setUsulOpen(true)}
          type="button"
        >
          ＋ Tambah tugas hari ini
        </button>
      ) : (
        <div className="card form usul-form">
          <div className="label">Tugas tambahan yang kamu kerjakan</div>
          <input
            className="input"
            autoFocus
            placeholder="Contoh: Membuatkan susu untuk adik"
            value={usulJudul}
            onChange={(e) => setUsulJudul(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') kirimUsul()
            }}
          />
          <p className="usul-hint">
            Poinnya akan ditentukan oleh orang tua saat mengkonfirmasi.
          </p>
          <div className="btn-row">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setUsulOpen(false)
                setUsulJudul('')
              }}
            >
              Batal
            </button>
            <button
              className="btn"
              disabled={!usulJudul.trim()}
              style={{ opacity: !usulJudul.trim() ? 0.5 : 1 }}
              onClick={kirimUsul}
            >
              Kirim ke Orang Tua
            </button>
          </div>
        </div>
      )}

      <HadiahSection data={data} childId={childId} setData={setData} />
      <RewardCelebration data={data} childId={childId} setData={setData} />
    </div>
  )
}
