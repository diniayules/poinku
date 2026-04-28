import { useState } from 'react'
import { isWeekend, taskBerlakuHariIni, todayKey, uid } from '../storage'
import type { AppData, Completion, Proposal } from '../types'
import { HadiahSection } from '../components/HadiahSection'
import { RewardCelebration } from '../components/RewardCelebration'
import { EmojiOrImg } from '../components/EmojiOrImg'
import { useT } from '../i18n'

type Props = {
  data: AppData
  childId: string
  setData: (d: AppData) => void
  onBack: () => void
}

export function ChildDashboard({ data, childId, setData, onBack }: Props) {
  const t = useT()
  const [usulOpen, setUsulOpen] = useState(false)
  const [usulJudul, setUsulJudul] = useState('')
  const [pickingTaskId, setPickingTaskId] = useState<string | null>(null)

  const child = data.children.find((c) => c.id === childId)
  if (!child) return null

  const today = todayKey()
  const now = new Date()
  const weekendNow = isWeekend(now)
  const tasks = data.tasks
    .filter(
      (task) => task.childId === childId && taskBerlakuHariIni(task, now),
    )
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

  function markDone(taskId: string, varianDipilih?: string) {
    const existing = findCompletion(taskId)
    if (existing) {
      setPickingTaskId(null)
      return
    }
    const task = data.tasks.find((t2) => t2.id === taskId)
    if (task?.varian && task.varian.length === 2 && !varianDipilih) {
      setPickingTaskId(taskId)
      return
    }
    const completion: Completion = {
      id: uid(),
      taskId,
      childId,
      tanggal: today,
      selesaiPada: new Date().toISOString(),
      status: 'menunggu',
      varianDipilih,
    }
    setData({
      ...data,
      completions: [...data.completions, completion],
    })
    setPickingTaskId(null)
  }

  const pickingTask = pickingTaskId
    ? data.tasks.find((tk) => tk.id === pickingTaskId)
    : null

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
        ← {t('changeProfile')}
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

      <div className="dash-columns">
        <div className="dash-col">
          <h3 className="dash-section-title">
            {t('todaysTasks')}
            <span className="badge-hari">
              {weekendNow ? `🏖️ ${t('weekend')}` : `🎒 ${t('schoolDay')}`}
            </span>
          </h3>
          <div className="task-list">
            {tasks.length === 0 && proposalsHariIni.length === 0 && (
              <div className="empty-state">{t('noTasksToday')}</div>
            )}
            {tasks.map((task) => {
          const comp = findCompletion(task.id)
          const status = comp?.status
          const disabled = !!comp
          return (
            <button
              key={task.id}
              className={`task-item ${status ?? ''}`}
              onClick={() => markDone(task.id)}
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
                    <EmojiOrImg
                      value={task.ikon}
                      imgSize={36}
                      imgRadius={10}
                    />
                  </span>
                  <span className="judul-teks">{task.judul}</span>
                  {!status && (
                    <span className="poin-badge">+{task.poin}</span>
                  )}
                </span>
                {(task.jam || task.durasiMenit) && (
                  <span className="jam-badge">
                    {task.jam && `🕐 ${task.jam}`}
                    {task.jam && task.durasiMenit && ' · '}
                    {task.durasiMenit &&
                      `⏱️ ${task.durasiMenit} ${t('minutesShort')}`}
                  </span>
                )}
                {comp?.varianDipilih && (
                  <span className="varian-badge">
                    ✨ {comp.varianDipilih}
                  </span>
                )}
                {status === 'menunggu' && (
                  <span className="status-text menunggu">
                    {t('waitingParent')}
                  </span>
                )}
                {status === 'disetujui' && (
                  <span className="status-text disetujui">
                    {t('approvedPoints', { poin: task.poin })}
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
                      <span className="badge-usul">
                        {t('proposalBadge')}
                      </span>
                    </span>
                    {status === 'menunggu' && (
                      <span className="status-text menunggu">
                        {t('waitingPointSet')}
                      </span>
                    )}
                    {status === 'disetujui' && (
                      <span className="status-text disetujui">
                        {t('approvedPoints', { poin: p.poin ?? 0 })}
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
              {t('addExtraTask')}
            </button>
          ) : (
            <div className="card form usul-form">
              <div className="label">{t('extraTaskLabel')}</div>
              <input
                className="input"
                autoFocus
                placeholder={t('extraTaskPlaceholder')}
                value={usulJudul}
                onChange={(e) => setUsulJudul(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') kirimUsul()
                }}
              />
              <p className="usul-hint">{t('extraTaskHint')}</p>
              <div className="btn-row">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setUsulOpen(false)
                    setUsulJudul('')
                  }}
                >
                  {t('cancel')}
                </button>
                <button
                  className="btn"
                  disabled={!usulJudul.trim()}
                  style={{ opacity: !usulJudul.trim() ? 0.5 : 1 }}
                  onClick={kirimUsul}
                >
                  {t('sendToParent')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="dash-col">
          <HadiahSection data={data} childId={childId} setData={setData} />
        </div>
      </div>

      {pickingTask?.varian && (
        <div
          className="picker-overlay"
          onClick={() => setPickingTaskId(null)}
        >
          <div
            className="picker-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="picker-emoji">
              <EmojiOrImg value={pickingTask.ikon} imgSize={56} imgRadius={14} />
            </div>
            <h3 className="picker-title">{t('pickerTitle')}</h3>
            <p className="picker-task-name">{pickingTask.judul}</p>
            <div className="picker-options">
              {pickingTask.varian.map((v, i) => (
                <button
                  key={v}
                  className={`picker-option picker-option-${
                    i === 0 ? 'a' : 'b'
                  }`}
                  onClick={() => markDone(pickingTask.id, v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setPickingTaskId(null)}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      <RewardCelebration data={data} childId={childId} setData={setData} />
    </div>
  )
}
