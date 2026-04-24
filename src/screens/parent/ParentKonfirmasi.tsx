import { useState } from 'react'
import type { AppData } from '../../types'
import { formatJam, hitungLewat } from '../../storage'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentKonfirmasi({ data, setData }: Props) {
  const pendingCompletions = data.completions.filter(
    (c) => c.status === 'menunggu',
  )
  const pendingProposals = data.proposals.filter((p) => p.status === 'menunggu')

  const [poinUsul, setPoinUsul] = useState<Record<string, number>>({})

  function handleCompletion(completionId: string, approve: boolean) {
    const comp = data.completions.find((c) => c.id === completionId)
    if (!comp) return
    const task = data.tasks.find((t) => t.id === comp.taskId)
    if (!task) return

    const completions = data.completions.map((c) =>
      c.id === completionId
        ? {
            ...c,
            status: approve ? ('disetujui' as const) : ('ditolak' as const),
            poinSaatDisetujui: approve ? task.poin : undefined,
          }
        : c,
    )
    const children = approve
      ? data.children.map((ch) =>
          ch.id === comp.childId
            ? { ...ch, totalPoin: ch.totalPoin + task.poin }
            : ch,
        )
      : data.children
    setData({ ...data, completions, children })
  }

  function handleProposal(proposalId: string, approve: boolean) {
    const p = data.proposals.find((x) => x.id === proposalId)
    if (!p) return
    const poin = poinUsul[proposalId] ?? 0
    if (approve && poin <= 0) return

    const proposals = data.proposals.map((x) =>
      x.id === proposalId
        ? {
            ...x,
            status: approve ? ('disetujui' as const) : ('ditolak' as const),
            poin: approve ? poin : undefined,
          }
        : x,
    )
    const children = approve
      ? data.children.map((ch) =>
          ch.id === p.childId
            ? { ...ch, totalPoin: ch.totalPoin + poin }
            : ch,
        )
      : data.children
    setData({ ...data, proposals, children })
    setPoinUsul((s) => {
      const next = { ...s }
      delete next[proposalId]
      return next
    })
  }

  if (pendingCompletions.length === 0 && pendingProposals.length === 0) {
    return (
      <div className="empty-state">
        Tidak ada tugas yang menunggu konfirmasi 🎉
      </div>
    )
  }

  return (
    <div className="task-list">
      {pendingCompletions.map((c) => {
        const task = data.tasks.find((t) => t.id === c.taskId)
        const child = data.children.find((ch) => ch.id === c.childId)
        if (!task || !child) return null
        const lewat = hitungLewat(task.jam, task.durasiMenit, c.selesaiPada)
        const jamSelesai = formatJam(c.selesaiPada)
        return (
          <div key={c.id} className="row">
            <span className="avatar">{child.avatar}</span>
            <div className="main">
              <div className="title-text">
                {task.ikon} {task.judul}
              </div>
              <div className="meta">
                {child.nama} · +{task.poin} poin
                {task.jam && ` · 🕐 ${task.jam}`}
                {task.durasiMenit && ` · ⏱️ ${task.durasiMenit} menit`}
              </div>
              <div className="meta" style={{ marginTop: 4 }}>
                Selesai pukul {jamSelesai}
                {lewat !== null && lewat > 0 && (
                  <span className="late-badge">⚠️ Lewat {lewat} menit</span>
                )}
                {lewat !== null && lewat <= 0 && (
                  <span className="ontime-badge">✓ Tepat waktu</span>
                )}
              </div>
            </div>
            <div className="row-actions">
              <button
                className="icon-btn approve"
                onClick={() => handleCompletion(c.id, true)}
              >
                ✓ Setuju
              </button>
              <button
                className="icon-btn reject"
                onClick={() => handleCompletion(c.id, false)}
              >
                ✗ Tolak
              </button>
            </div>
          </div>
        )
      })}

      {pendingProposals.map((p) => {
        const child = data.children.find((ch) => ch.id === p.childId)
        if (!child) return null
        const poin = poinUsul[p.id] ?? 0
        return (
          <div key={p.id} className="row row-usul">
            <span className="avatar">{child.avatar}</span>
            <div className="main">
              <div className="title-text">
                <span className="badge-usul">Usulan</span> ✨ {p.judul}
              </div>
              <div className="meta">
                {child.nama} · dikirim pukul {formatJam(p.dibuatPada)}
              </div>
              <div className="poin-input-row">
                <span className="label-inline">Beri poin:</span>
                <input
                  className="input poin-input"
                  type="number"
                  min={1}
                  placeholder="0"
                  value={poin || ''}
                  onChange={(e) =>
                    setPoinUsul((s) => ({
                      ...s,
                      [p.id]: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div className="row-actions">
              <button
                className="icon-btn approve"
                disabled={poin <= 0}
                style={{ opacity: poin <= 0 ? 0.5 : 1 }}
                onClick={() => handleProposal(p.id, true)}
              >
                ✓ Setuju +{poin || 0}
              </button>
              <button
                className="icon-btn reject"
                onClick={() => handleProposal(p.id, false)}
              >
                ✗ Tolak
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
