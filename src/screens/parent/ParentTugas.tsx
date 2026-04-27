import { useState } from 'react'
import type { AppData, Jadwal, Task } from '../../types'
import {
  JADWAL_DICT_KEY,
  JADWAL_ICON,
  uid,
} from '../../storage'
import { TASK_ICONS } from '../../constants'
import { EmojiPickerWithUpload } from '../../components/EmojiPickerWithUpload'
import { EmojiOrImg } from '../../components/EmojiOrImg'
import { useT } from '../../i18n'

const JADWAL_OPSI: Jadwal[] = ['setiap-hari', 'hari-sekolah', 'akhir-pekan']

function dedupeByJudul(tasks: Task[]): Task[] {
  const seen = new Set<string>()
  const out: Task[] = []
  for (const tk of tasks) {
    const key = tk.judul.toLowerCase().trim()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(tk)
  }
  return out
}

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentTugas({ data, setData }: Props) {
  const t = useT()
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
            (tk) =>
              tk.childId !== childId &&
              tk.judul.toLowerCase().includes(judul.trim().toLowerCase()) &&
              tk.judul.toLowerCase() !== judul.trim().toLowerCase(),
          ),
        ).slice(0, 5)
      : []

  function applyFromTask(tk: Task) {
    setJudul(tk.judul)
    setPoin(tk.poin)
    setIkon(tk.ikon)
    setJam(tk.jam ?? '')
    setDurasi(tk.durasiMenit ?? '')
    setJadwal(tk.jadwal ?? 'setiap-hari')
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

  function startEdit(tk: Task) {
    setEditId(tk.id)
    setJudul(tk.judul)
    setPoin(tk.poin)
    setIkon(tk.ikon)
    setJam(tk.jam ?? '')
    setDurasi(tk.durasiMenit ?? '')
    setJadwal(tk.jadwal ?? 'setiap-hari')
    setChildId(tk.childId)
  }

  function save() {
    if (!judul.trim() || !childId) return
    const jamValue = jam.trim() || undefined
    const durasiValue =
      typeof durasi === 'number' && durasi > 0 ? durasi : undefined
    if (editId) {
      setData({
        ...data,
        tasks: data.tasks.map((tk) =>
          tk.id === editId
            ? {
                ...tk,
                judul: judul.trim(),
                poin,
                ikon,
                childId,
                jam: jamValue,
                durasiMenit: durasiValue,
                jadwal,
              }
            : tk,
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
    if (!confirm(t('confirmDeleteTask'))) return
    setData({
      ...data,
      tasks: data.tasks.filter((tk) => tk.id !== id),
    })
    if (editId === id) resetForm()
  }

  const tasksForChild = data.tasks
    .filter((tk) => tk.childId === childId)
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
        <div className="label">{t('forChild')}</div>
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
          {editId ? t('editTaskTitle') : t('addTaskTitle')}
        </div>
        <div className="suggest-wrap">
          <input
            className="input"
            placeholder={t('taskJudulPlaceholder')}
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
              <div className="suggest-hint">{t('suggestHint')}</div>
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
                      <EmojiOrImg
                        value={s.ikon}
                        imgSize={26}
                        imgRadius={8}
                      />
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
                        +{s.poin} {t('pointsShort')}
                        {s.jam ? ` · 🕐 ${s.jam}` : ''}
                        {s.durasiMenit
                          ? ` · ⏱️ ${s.durasiMenit}m`
                          : ''}
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
            <div className="label">{t('pointsTitle')}</div>
            <input
              className="input"
              type="number"
              min={1}
              value={poin}
              onChange={(e) => setPoin(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <div className="label">{t('taskJamOpt')}</div>
            <input
              className="input"
              type="time"
              value={jam}
              onChange={(e) => setJam(e.target.value)}
            />
          </div>
          <div>
            <div className="label">{t('taskDurasi')}</div>
            <input
              className="input"
              type="number"
              min={1}
              placeholder={t('durasiPlaceholder')}
              value={durasi}
              onChange={(e) => {
                const v = e.target.value
                setDurasi(v === '' ? '' : Number(v) || 0)
              }}
            />
          </div>
        </div>
        <div>
          <div className="label">{t('taskJadwal')}</div>
          <div className="select-chip-row">
            {JADWAL_OPSI.map((j) => (
              <button
                key={j}
                type="button"
                className={`select-chip ${jadwal === j ? 'active' : ''}`}
                onClick={() => setJadwal(j)}
              >
                {JADWAL_ICON[j]} {t(JADWAL_DICT_KEY[j])}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="label">{t('taskIkon')}</div>
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
              {t('cancel')}
            </button>
          )}
          <button
            className="btn"
            disabled={!judul.trim() || !childId}
            style={{ opacity: !judul.trim() || !childId ? 0.5 : 1 }}
            onClick={save}
          >
            {editId ? t('save') : t('add')}
          </button>
        </div>
      </div>

      <div>
        <div className="label">{t('taskListLabel')}</div>
        <div className="task-list">
          {tasksForChild.length === 0 && (
            <div className="empty-state">{t('noTasks')}</div>
          )}
          {tasksForChild.map((tk) => (
            <div key={tk.id} className="row">
              <span className="ikon" style={{ fontSize: 28 }}>
                <EmojiOrImg value={tk.ikon} imgSize={36} imgRadius={10} />
              </span>
              <div className="main">
                <div className="title-text">{tk.judul}</div>
                <div className="meta">
                  {JADWAL_ICON[tk.jadwal ?? 'setiap-hari']}{' '}
                  {t(JADWAL_DICT_KEY[tk.jadwal ?? 'setiap-hari'])}
                  {tk.jam ? ` · 🕐 ${tk.jam}` : ''}
                  {tk.durasiMenit
                    ? ` · ⏱️ ${tk.durasiMenit} ${t('minutesShort')}`
                    : ''}
                  {' · '}+{tk.poin} {t('pointsShort')}
                </div>
              </div>
              <div className="row-actions">
                <button className="icon-btn" onClick={() => startEdit(tk)}>
                  {t('edit')}
                </button>
                <button
                  className="icon-btn reject"
                  onClick={() => hapus(tk.id)}
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
