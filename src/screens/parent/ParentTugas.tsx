import { useState } from 'react'
import type { AppData, Task } from '../../types'
import { uid } from '../../storage'
import { TASK_ICONS } from '../../constants'

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

  function resetForm() {
    setEditId(null)
    setJudul('')
    setPoin(10)
    setIkon(TASK_ICONS[0])
    setJam('')
    setDurasi('')
  }

  function startEdit(t: Task) {
    setEditId(t.id)
    setJudul(t.judul)
    setPoin(t.poin)
    setIkon(t.ikon)
    setJam(t.jam ?? '')
    setDurasi(t.durasiMenit ?? '')
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
              {c.avatar} {c.nama}
            </button>
          ))}
        </div>
      </div>

      <div className="card form">
        <div className="label">
          {editId ? 'Ubah Tugas' : 'Tambah Tugas Rutinitas Harian'}
        </div>
        <input
          className="input"
          placeholder="Contoh: Gosok gigi"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />
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
          <div className="label">Ikon</div>
          <div
            className="emoji-picker"
            style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}
          >
            {TASK_ICONS.map((i) => (
              <button
                key={i}
                type="button"
                className={ikon === i ? 'active' : ''}
                onClick={() => setIkon(i)}
              >
                {i}
              </button>
            ))}
          </div>
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
                {t.ikon}
              </span>
              <div className="main">
                <div className="title-text">{t.judul}</div>
                <div className="meta">
                  {t.jam ? `🕐 ${t.jam} · ` : ''}
                  {t.durasiMenit ? `⏱️ ${t.durasiMenit} menit · ` : ''}+
                  {t.poin} poin
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
