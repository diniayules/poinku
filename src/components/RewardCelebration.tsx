import { useEffect, useMemo, useState } from 'react'
import type { AppData, Reward, RewardTipe } from '../types'
import {
  REWARD_TIPE_ICON,
  REWARD_TIPE_LABEL,
  periodKey,
  poinDalamPeriode,
  semuaTugasHariIniSelesai,
  uid,
} from '../storage'

const TIPE_ORDER: RewardTipe[] = ['harian', 'mingguan', 'bulanan']

const DISMISS_KEY = 'system-point-anak:dismiss:v2'

type DismissMap = Record<string, number>

function loadDismiss(): DismissMap {
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveDismiss(m: DismissMap): void {
  localStorage.setItem(DISMISS_KEY, JSON.stringify(m))
}

function dismissKeyOf(childId: string, tipe: RewardTipe, period: string): string {
  return `${childId}::${tipe}::${period}`
}

type Props = {
  data: AppData
  childId: string
  setData: (d: AppData) => void
}

type EligibleGroup = {
  tipe: RewardTipe
  rewards: Reward[]
  poin: number
  period: string
}

export function RewardCelebration({ data, childId, setData }: Props) {
  const [dismissed, setDismissed] = useState<DismissMap>(() => loadDismiss())
  const [closed, setClosed] = useState(false)
  const now = useMemo(() => new Date(), [])

  const tugasSelesai = semuaTugasHariIniSelesai(data, childId, now)

  const groups = useMemo<EligibleGroup[]>(() => {
    if (!tugasSelesai) return []
    const out: EligibleGroup[] = []
    for (const tipe of TIPE_ORDER) {
      const period = periodKey(tipe, now)
      const dKey = dismissKeyOf(childId, tipe, period)

      const aktif = data.rewardClaims.find(
        (c) =>
          c.childId === childId &&
          c.tipe === tipe &&
          c.periodKey === period &&
          c.status !== 'ditolak',
      )
      if (aktif) continue

      const poin = poinDalamPeriode(data, childId, tipe, now)
      const eligible = data.rewards.filter(
        (r) => r.childId === childId && r.tipe === tipe && r.harga <= poin,
      )
      if (eligible.length === 0) continue

      const dismissedAt = dismissed[dKey]
      if (typeof dismissedAt === 'number' && poin <= dismissedAt) continue

      out.push({
        tipe,
        rewards: eligible.slice().sort((a, b) => a.harga - b.harga),
        poin,
        period,
      })
    }
    return out
  }, [data, childId, dismissed, now, tugasSelesai])

  useEffect(() => {
    if (groups.length > 0) setClosed(false)
  }, [groups])

  if (groups.length === 0 || closed) return null

  function dismissAll() {
    const next = { ...dismissed }
    for (const g of groups) {
      next[dismissKeyOf(childId, g.tipe, g.period)] = g.poin
    }
    setDismissed(next)
    saveDismiss(next)
    setClosed(true)
  }

  function claim(reward: Reward) {
    const period = periodKey(reward.tipe, now)
    const poinNow = poinDalamPeriode(data, childId, reward.tipe, now)
    setData({
      ...data,
      rewardClaims: [
        ...data.rewardClaims,
        {
          id: uid(),
          rewardId: reward.id,
          childId,
          tipe: reward.tipe,
          periodKey: period,
          diklaimPada: now.toISOString(),
          hargaSaatItu: reward.harga,
          poinPeriodeSaatItu: poinNow,
          status: 'menunggu',
        },
      ],
    })
    const next = {
      ...dismissed,
      [dismissKeyOf(childId, reward.tipe, period)]: poinNow,
    }
    setDismissed(next)
    saveDismiss(next)
  }

  return (
    <div className="celebration-overlay" onClick={dismissAll}>
      <div className="confetti">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} style={{ left: `${(i * 4.2) % 100}%` }}>
            {['🎉', '🎊', '⭐', '✨', '🌟'][i % 5]}
          </span>
        ))}
      </div>
      <div
        className="celebration-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="celebration-head">
          <div className="celebration-emoji">🎁</div>
          <h2 className="celebration-title">HADIAH TERSEDIA!</h2>
          <p className="celebration-sub">
            Pilih satu hadiah untuk di-klaim. Orang tua akan konfirmasi dulu.
          </p>
        </div>

        {groups.map((g) => (
          <div key={g.tipe} className="celebration-grup">
            <div className="celebration-grup-head">
              <span>
                {REWARD_TIPE_ICON[g.tipe]} {REWARD_TIPE_LABEL[g.tipe]}
              </span>
              <span className="celebration-grup-poin">⭐ {g.poin} poin</span>
            </div>
            <div className="celebration-grup-rewards">
              {g.rewards.map((r) => (
                <button
                  key={r.id}
                  className="celebration-reward"
                  onClick={() => claim(r)}
                >
                  <span className="celebration-reward-ikon">{r.ikon}</span>
                  <span className="celebration-reward-judul">{r.judul}</span>
                  <span className="celebration-reward-harga">
                    {r.harga} poin
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="btn btn-ghost" onClick={dismissAll}>
          Nanti dulu
        </button>
      </div>
    </div>
  )
}
