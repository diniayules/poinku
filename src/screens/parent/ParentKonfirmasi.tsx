import { useState } from 'react'
import type { AppData } from '../../types'
import {
  POIN_LATE_PARTIAL_LIMIT,
  REWARD_TIPE_DICT_KEY,
  REWARD_TIPE_ICON,
  REWARD_TIPE_LOWER_KEY,
  formatJam,
  hitungLewat,
  hitungPoinAktual,
  persenPoinDariLewat,
  todayKey,
  tomorrowKey,
} from '../../storage'
import { EmojiOrImg } from '../../components/EmojiOrImg'
import { useT } from '../../i18n'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentKonfirmasi({ data, setData }: Props) {
  const t = useT()
  const pendingCompletions = data.completions.filter(
    (c) => c.status === 'menunggu',
  )
  const pendingProposals = data.proposals.filter((p) => p.status === 'menunggu')
  const pendingClaims = data.rewardClaims.filter((c) => c.status === 'menunggu')

  const today = todayKey()
  const pendingDeliveries = data.rewardClaims
    .filter(
      (c) =>
        c.status === 'disetujui' &&
        (!c.tundaSampai || c.tundaSampai <= today),
    )
    .slice()
    .sort((a, b) => a.diklaimPada.localeCompare(b.diklaimPada))

  const [poinUsul, setPoinUsul] = useState<Record<string, number>>({})

  function handleCompletion(completionId: string, approve: boolean) {
    const comp = data.completions.find((c) => c.id === completionId)
    if (!comp) return
    const task = data.tasks.find((t) => t.id === comp.taskId)
    if (!task) return

    const lewat = hitungLewat(task.jam, task.durasiMenit, comp.selesaiPada)
    const poinAktual = hitungPoinAktual(task.poin, lewat)

    const completions = data.completions.map((c) =>
      c.id === completionId
        ? {
            ...c,
            status: approve ? ('disetujui' as const) : ('ditolak' as const),
            poinSaatDisetujui: approve ? poinAktual : undefined,
          }
        : c,
    )
    const children =
      approve && poinAktual > 0
        ? data.children.map((ch) =>
            ch.id === comp.childId
              ? { ...ch, totalPoin: ch.totalPoin + poinAktual }
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

  function handleClaim(claimId: string, approve: boolean) {
    const rewardClaims = data.rewardClaims.map((c) =>
      c.id === claimId
        ? approve
          ? {
              ...c,
              status: 'disetujui' as const,
              tundaSampai: tomorrowKey(),
            }
          : { ...c, status: 'ditolak' as const }
        : c,
    )
    setData({ ...data, rewardClaims })
  }

  function markGiven(claimId: string) {
    const rewardClaims = data.rewardClaims.map((c) =>
      c.id === claimId ? { ...c, status: 'diberikan' as const } : c,
    )
    setData({ ...data, rewardClaims })
  }

  function deferDelivery(claimId: string) {
    const rewardClaims = data.rewardClaims.map((c) =>
      c.id === claimId ? { ...c, tundaSampai: tomorrowKey() } : c,
    )
    setData({ ...data, rewardClaims })
  }

  if (
    pendingCompletions.length === 0 &&
    pendingProposals.length === 0 &&
    pendingClaims.length === 0 &&
    pendingDeliveries.length === 0
  ) {
    return <div className="empty-state">{t('noPending')}</div>
  }

  return (
    <div className="task-list">
      {pendingDeliveries.length > 0 && (
        <div className="delivery-section">
          <div className="delivery-head">
            <span className="delivery-title">
              🎁 {t('pendingDeliveryTitle')} ({pendingDeliveries.length})
            </span>
            <span className="delivery-hint">{t('pendingDeliveryHint')}</span>
          </div>
          {pendingDeliveries.map((c) => {
            const reward = data.rewards.find((r) => r.id === c.rewardId)
            const child = data.children.find((ch) => ch.id === c.childId)
            if (!reward || !child) return null
            return (
              <div key={c.id} className="row row-delivery">
                <span className="avatar" style={{ fontSize: 28 }}>
                  <EmojiOrImg value={child.avatar} imgSize={36} />
                </span>
                <div className="main">
                  <div className="title-text">
                    <EmojiOrImg
                      value={reward.ikon}
                      imgSize={22}
                      imgRadius={6}
                    />{' '}
                    {reward.judul}
                  </div>
                  <div className="meta">
                    {child.nama} · {REWARD_TIPE_ICON[reward.tipe]}{' '}
                    {t(REWARD_TIPE_DICT_KEY[reward.tipe])} ·{' '}
                    {c.hargaSaatItu} {t('pointsShort')}
                  </div>
                </div>
                <div className="row-actions">
                  <button
                    className="icon-btn approve"
                    onClick={() => markGiven(c.id)}
                  >
                    {t('markGivenBtn')}
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => deferDelivery(c.id)}
                  >
                    {t('deferToTomorrow')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {pendingCompletions.map((c) => {
        const task = data.tasks.find((t) => t.id === c.taskId)
        const child = data.children.find((ch) => ch.id === c.childId)
        if (!task || !child) return null
        const lewat = hitungLewat(task.jam, task.durasiMenit, c.selesaiPada)
        const persen = persenPoinDariLewat(lewat)
        const poinAktual = hitungPoinAktual(task.poin, lewat)
        const jamSelesai = formatJam(c.selesaiPada)
        return (
          <div key={c.id} className="row">
            <span className="avatar" style={{ fontSize: 28 }}>
              <EmojiOrImg value={child.avatar} imgSize={36} />
            </span>
            <div className="main">
              <div className="title-text">
                <EmojiOrImg value={task.ikon} imgSize={22} imgRadius={6} />{' '}
                {task.judul}
              </div>
              <div className="meta">
                {child.nama} · +{task.poin} {t('pointsShort')}
                {task.jam && ` · 🕐 ${task.jam}`}
                {task.durasiMenit &&
                  ` · ⏱️ ${task.durasiMenit} ${t('minutesShort')}`}
              </div>
              <div className="meta" style={{ marginTop: 4 }}>
                {t('finishedAt', { jam: jamSelesai })}
                {lewat !== null && lewat > 0 && (
                  <span className="late-badge">
                    {t('lateBy', { n: lewat })}
                  </span>
                )}
                {lewat !== null && lewat <= 0 && (
                  <span className="ontime-badge">{t('onTime')}</span>
                )}
              </div>
              {c.varianDipilih && (
                <div className="meta" style={{ marginTop: 4 }}>
                  <span className="varian-badge">
                    ✨ {t('chosenVariant', { varian: c.varianDipilih })}
                  </span>
                </div>
              )}
              <div
                className={`award-note award-${
                  persen === 100 ? 'full' : persen === 0 ? 'zero' : 'partial'
                }`}
              >
                {persen === 100 && t('awardFull', { n: poinAktual })}
                {persen > 0 &&
                  persen < 100 &&
                  t('awardPartial', { n: poinAktual, pct: persen })}
                {persen === 0 &&
                  t('awardZero', { limit: POIN_LATE_PARTIAL_LIMIT })}
              </div>
            </div>
            <div className="row-actions">
              <button
                className="icon-btn approve"
                onClick={() => handleCompletion(c.id, true)}
              >
                {t('approveWith', { n: poinAktual })}
              </button>
              <button
                className="icon-btn reject"
                onClick={() => handleCompletion(c.id, false)}
              >
                ✗ {t('reject')}
              </button>
            </div>
          </div>
        )
      })}

      {pendingClaims.map((c) => {
        const reward = data.rewards.find((r) => r.id === c.rewardId)
        const child = data.children.find((ch) => ch.id === c.childId)
        if (!reward || !child) return null
        return (
          <div key={c.id} className="row row-claim">
            <span className="avatar" style={{ fontSize: 28 }}>
              <EmojiOrImg value={child.avatar} imgSize={36} />
            </span>
            <div className="main">
              <div className="title-text">
                <span className="badge-claim">{t('rewardClaimBadge')}</span>{' '}
                <EmojiOrImg value={reward.ikon} imgSize={22} imgRadius={6} />{' '}
                {reward.judul}
              </div>
              <div className="meta">
                {child.nama} · {REWARD_TIPE_ICON[reward.tipe]}{' '}
                {t(REWARD_TIPE_DICT_KEY[reward.tipe])} ·{' '}
                {c.hargaSaatItu} {t('pointsShort')}
              </div>
              <div className="meta" style={{ marginTop: 4 }}>
                {t('claimedAt', { jam: formatJam(c.diklaimPada) })} ·{' '}
                {t('pointsAt', {
                  periode: t(REWARD_TIPE_LOWER_KEY[reward.tipe]),
                })}
                : <strong>{c.poinPeriodeSaatItu}</strong>
              </div>
            </div>
            <div className="row-actions">
              <button
                className="icon-btn approve"
                onClick={() => handleClaim(c.id, true)}
              >
                ✓ {t('give')}
              </button>
              <button
                className="icon-btn reject"
                onClick={() => handleClaim(c.id, false)}
              >
                ✗ {t('reject')}
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
            <span className="avatar" style={{ fontSize: 28 }}>
              <EmojiOrImg value={child.avatar} imgSize={36} />
            </span>
            <div className="main">
              <div className="title-text">
                <span className="badge-usul">{t('proposalBadge')}</span> ✨{' '}
                {p.judul}
              </div>
              <div className="meta">
                {child.nama} · {t('sentAt', { jam: formatJam(p.dibuatPada) })}
              </div>
              <div className="poin-input-row">
                <span className="label-inline">{t('givePoints')}</span>
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
                {t('approveWithPoints', { n: poin || 0 })}
              </button>
              <button
                className="icon-btn reject"
                onClick={() => handleProposal(p.id, false)}
              >
                ✗ {t('reject')}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
