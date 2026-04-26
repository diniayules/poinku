import { useState } from 'react'
import type { AppData, Jadwal, Task } from '../../types'
import { JADWAL_ICON, JADWAL_LABEL, uid } from '../../storage'
import { TASK_ICONS } from '../../constants'
import { EmojiPickerWithUpload } from '../../components/EmojiPickerWithUpload'
import { EmojiOrImg } from '../../components/EmojiOrImg'

const JADWAL_OPSI: Jadwal[] = ['setiap-hari', 'hari-sekolah', 'akhir-pekan']

function dedupeByJudul(tasks: Task[]): Task[] {
  const seen = new Set<string>()
  const out: Task[] = []
  for (const t of tasks) {
    const key = t.judul.toLowerCase().trim()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentTugas({ data, setData }: Props) {
  const [childId, setChildId] = useState<string>(
    data.children[0]?.id ?? '',
  )
  const [editId, setEditId] = useState<string | null>(null)
  const [judul, setJudul] = useState('')
  const [poin, setPoin] = useState(10)
  const [ikon, setIkon] = useState(TASK_ICONS[0])
  const [jam, setJam] = useState('')
  const [durasi, setDurasi] = useState<number | ''>('')
  const [jadwal, setJadwal] = useState<Jadwal>('setiap-hari')
  const [showSuggest, setShowSuggest] = useState(false)

  const suggestions =
    !editId && judul.trim().length >= 2
      ? dedupeByJudul(
          data.tasks.filter(
            (t) =>
              t.childId !== childId &&
              t.judul.toLowerCase().includes(judul.trim().toLowerCase()) &&
              t.judul.toLowerCase() !== judul.trim().toLowerCase(),
          ),
        ).slice(0, 5)
      : []

  function applyFromTask(t: Task) {
    setJudul(t.judul)
    setPoin(t.poin)
    setIkon(t.ikon)
    setJam(t.jam ?? '')
    setDurasi(t.durasiMenit ?? '')
    setJadwal(t.jadwal ?? 'setiap-hari')
    setShowSuggest(false)
  }

  function resetForm() {
    setEditId(null)
    setJudul('')
    setPoin(10)
    setIkon(TASK_ICONS[0])
    setJam('')
    setDurasi('')
    setJadwal('setiap-hari')
  }

  function startEdit(t: Task) {
    setEditId(t.id)
    setJudul(t.judul)
    setPoin(t.poin)
    setIkon(t.ikon)
    setJam(t.jam ?? '')
    setDurasi(t.durasiMenit ?? '')
    setJadwal(t.jadwal ?? 'setiap-hari')
    setChildId(t.childId)
  }

  function save() {
    if (!judul.trim() || !childId) return
    const jamValue = jam.trim() || undefined
    const durasiValue =
      typeof durasi === 'number' && durasi > 0 ? durasi : undefined
    if (editId) {
      setData({
        ...data,
        tasks: data.tasks.map((t) =>
          t.id === editId
            ? {
                ...t,
                judul: judul.trim(),
                poin,
                ikon,
                childId,
                jam: jamValue,
                durasiMenit: durasiValue,
                jadwal,
              }
            : t,
        ),
      })
    } else {
      const task: Task = {
        id: uid(),
        childId,
        judul: judul.trim(),
        poin,
        ikon,
        jam: jamValue,
        durasiMenit: durasiValue,
        jadwal,
      }
      setData({ ...data, tasks: [...data.tasks, task] })
    }
    resetForm()
  }

  function hapus(id: string) {
    if (!confirm('Hapus tugas ini?')) return
    setData({
      ...data,
      tasks: data.tasks.filter((t) => t.id !== id),
    })
    if (editId === id) resetForm()
  }

  const tasksForChild = data.tasks
    .filter((t) => t.childId === childId)
    .slice()
    .sort((a, b) => {
      if (a.jam && b.jam) return a.jam.localeCompare(b.jam)
      if (a.jam) return -1
      if (b.jam) return 1
      return 0
    })

  return (
    <div className="screen" style={{ gap: 16 }}>
      <div>
        <div className="label">Untuk anak</div>
        <div className="select-chip-row">
          {data.children.map((c) => (
            <button
              key={c.id}
              className={`select-chip ${childId === c.id ? 'active' : ''}`}
              onClick={() => {
                setChildId(c.id)
                resetForm()
              }}
            >
              <EmojiOrImg value={c.avatar} imgSize={20} /> {c.nama}
            </button>
          ))}
        </div>
      </div>

      <div className="card form">
        <div className="label">
          {editId ? 'Ubah Tugas' : 'Tambah Tugas Rutinitas Harian'}
        </div>
        <div className="suggest-wrap">
          <input
            className="input"
            placeholder="Contoh: Gosok gigi"
            value={judul}
            onChange={(e) => {
              setJudul(e.target.value)
              setShowSuggest(true)
            }}
            onFocus={() => setShowSuggest(true)}
            onBlur={() =>
              window.setTimeout(() => setShowSuggest(false), 150)
            }
          />
          {showSuggest && suggestions.length > 0 && (
            <div className="suggest-list">
              <div className="suggest-hint">
                Sudah pernah dibuat untuk anak lain — klik untuk menyalin
              </div>
              {suggestions.map((s) => {
                const ownerChild = data.children.find(
                  (c) => c.id === s.childId,
                )
                return (
                  <button
                    key={s.id}
                    type="button"
                    className="suggest-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyFromTask(s)}
                  >
                    <span className="suggest-ikon">
                      <EmojiOrImg value={s.ikon} imgSize={26} imgRadius={8} />
                    </span>
                    <span className="suggest-main">
                      <span className="suggest-judul">{s.judul}</span>
                      <span className="suggest-meta">
                        {ownerChild && (
                          <>
                            <EmojiOrImg
                              value={ownerChild.avatar}
                              imgSize={14}
                            />{' '}
                            {ownerChild.nama} ·{' '}
                          </>
                        )}
                        +{s.poin} poin
                        {s.jam ? ` · 🕐 ${s.jam}` : ''}
                        {s.durasiMenit ? ` · ⏱️ ${s.durasiMenit}m` : ''}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div className="form-row form-row-3">
          <div>
            <div className="label">Poin</div>
            <input
              className="input"
              type="number"
              min={1}
              value={poin}
              onChange={(e) => setPoin(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <div className="label">Jam (opsional)</div>
            <input
              className="input"
              type="time"
              value={jam}
              onChange={(e) => setJam(e.target.value)}
            />
          </div>
          <div>
            <div className="label">Durasi (menit)</div>
            <input
              className="input"
              type="number"
              min={1}
              placeholder="mis. 30"
              value={durasi}
              onChange={(e) => {
                const v = e.target.value
                setDurasi(v === '' ? '' : Number(v) || 0)
              }}
            />
          </div>
        </div>
        <div>
          <div className="label">Berlaku pada</div>
          <div className="select-chip-row">
            {JADWAL_OPSI.map((j) => (
              <button
                key={j}
                type="button"
                className={`select-chip ${jadwal === j ? 'active' : ''}`}
                onClick={() => setJadwal(j)}
              >
                {JADWAL_ICON[j]} {JADWAL_LABEL[j]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="label">Ikon (foto atau pilih emoji)</div>
          <EmojiPickerWithUpload
            emojis={TASK_ICONS}
            value={ikon}
            onChange={setIkon}
            columns={9}
          />
        </div>
        <div className="btn-row">
          {editId && (
            <button className="btn btn-ghost" onClick={resetForm}>
              Batal
            </button>
          )}
          <button
            className="btn"
            disabled={!judul.trim() || !childId}
            style={{ opacity: !judul.trim() || !childId ? 0.5 : 1 }}
            onClick={save}
          >
            {editId ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>

      <div>
        <div className="label">Daftar tugas</div>
        <div className="task-list">
          {tasksForChild.length === 0 && (
            <div className="empty-state">Belum ada tugas</div>
          )}
          {tasksForChild.map((t) => (
            <div key={t.id} className="row">
              <span className="ikon" style={{ fontSize: 28 }}>
                <EmojiOrImg value={t.ikon} imgSize={36} imgRadius={10} />
              </span>
              <div className="main">
                <div className="title-text">{t.judul}</div>
                <div className="meta">
                  {JADWAL_ICON[t.jadwal ?? 'setiap-hari']}{' '}
                  {JADWAL_LABEL[t.jadwal ?? 'setiap-hari']}
                  {t.jam ? ` · 🕐 ${t.jam}` : ''}
                  {t.durasiMenit ? ` · ⏱️ ${t.durasiMenit} menit` : ''}
                  {' · '}+{t.poin} poin
                </div>
              </div>
              <div className="row-actions">
                <button className="icon-btn" onClick={() => startEdit(t)}>
                  Ubah
                </button>
                <button
                  className="icon-btn reject"
                  onClick={() => hapus(t.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
