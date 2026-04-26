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

type Props = {
  data: AppData
  childId: string
  setData: (d: AppData) => void
}

export function HadiahSection({ data, childId, setData }: Props) {
  const now = new Date()
  const rewards = data.rewards.filter((r) => r.childId === childId)
  if (rewards.length === 0) return null

  const tugasSelesai = semuaTugasHariIniSelesai(data, childId, now)
  const claims = data.rewardClaims.filter((c) => c.childId === childId)

  const claimAktif = (tipe: RewardTipe) =>
    claims.find(
      (c) =>
        c.tipe === tipe &&
        c.periodKey === periodKey(tipe, now) &&
        c.status !== 'ditolak',
    )

  function claimReward(reward: Reward) {
    const aktif = claimAktif(reward.tipe)
    if (aktif) return
    const poinNow = poinDalamPeriode(data, childId, reward.tipe, now)
    if (poinNow < reward.harga) return
    setData({
      ...data,
      rewardClaims: [
        ...data.rewardClaims,
        {
          id: uid(),
          rewardId: reward.id,
          childId,
          tipe: reward.tipe,
          periodKey: periodKey(reward.tipe, now),
          diklaimPada: now.toISOString(),
          hargaSaatItu: reward.harga,
          poinPeriodeSaatItu: poinNow,
          status: 'menunggu',
        },
      ],
    })
  }

  return (
    <>
      <h3 className="dash-section-title hadiah-title">Hadiah</h3>
      {!tugasSelesai && (
        <div className="hadiah-gate">
          🔒 Selesaikan dulu semua tugas hari ini, baru kamu bisa klaim hadiah!
        </div>
      )}
      <div className="hadiah-progress-grid">
        {TIPE_ORDER.map((t) => {
          const poin = poinDalamPeriode(data, childId, t, now)
          const max =
            rewards
              .filter((r) => r.tipe === t)
              .reduce((m, r) => Math.max(m, r.harga), 0) || 0
          const pct = max > 0 ? Math.min(100, (poin / max) * 100) : 0
          return (
            <div key={t} className={`hadiah-progress hadiah-${t}`}>
              <div className="hadiah-progress-head">
                <span>
                  {REWARD_TIPE_ICON[t]} {REWARD_TIPE_LABEL[t]}
                </span>
                <span className="hadiah-progress-num">
                  {poin}
                  {max > 0 ? ` / ${max}` : ''}
                </span>
              </div>
              <div className="hadiah-bar">
                <div
                  className="hadiah-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="hadiah-list">
        {TIPE_ORDER.map((t) => {
          const list = rewards
            .filter((r) => r.tipe === t)
            .slice()
            .sort((a, b) => a.harga - b.harga)
          if (list.length === 0) return null
          const poin = poinDalamPeriode(data, childId, t, now)
          const aktif = claimAktif(t)
          return (
            <div key={t} className="hadiah-grup">
              <div className="hadiah-grup-title">
                {REWARD_TIPE_ICON[t]} {REWARD_TIPE_LABEL[t]}
              </div>
              {list.map((r) => {
                const eligible = poin >= r.harga
                const claimedThis =
                  aktif && aktif.rewardId === r.id ? aktif : null
                const lockedByOther = !!aktif && !claimedThis
                const dapatDiklaim =
                  eligible && !lockedByOther && !claimedThis && tugasSelesai
                return (
                  <div
                    key={r.id}
                    className={`hadiah-item ${
                      claimedThis
                        ? `claimed ${claimedThis.status}`
                        : dapatDiklaim
                          ? 'eligible'
                          : 'locked'
                    }`}
                  >
                    <span className="hadiah-ikon">{r.ikon}</span>
                    <div className="hadiah-main">
                      <div className="hadiah-judul">{r.judul}</div>
                      <div className="hadiah-meta">{r.harga} poin</div>
                      {claimedThis?.status === 'menunggu' && (
                        <div className="status-text menunggu">
                          ⏳ Menunggu konfirmasi orang tua
                        </div>
                      )}
                      {claimedThis?.status === 'diberikan' && (
                        <div className="status-text disetujui">
                          🎉 Sudah diberikan!
                        </div>
                      )}
                      {!claimedThis && lockedByOther && (
                        <div className="status-text locked">
                          🔒 Sudah pilih hadiah lain periode ini
                        </div>
                      )}
                      {!claimedThis &&
                        !lockedByOther &&
                        !eligible && (
                          <div className="status-text locked">
                            🔒 Butuh {r.harga - poin} poin lagi
                          </div>
                        )}
                      {!claimedThis &&
                        !lockedByOther &&
                        eligible &&
                        !tugasSelesai && (
                          <div className="status-text locked">
                            🔒 Selesaikan tugas hari ini dulu
                          </div>
                        )}
                    </div>
                    {dapatDiklaim && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => claimReward(r)}
                      >
                        Klaim
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}
