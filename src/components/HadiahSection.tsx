import type { AppData, Reward, RewardTipe } from '../types'
import {
  REWARD_TIPE_DICT_KEY,
  REWARD_TIPE_ICON,
  periodKey,
  poinDalamPeriode,
  semuaTugasHariIniSelesai,
  uid,
} from '../storage'
import { EmojiOrImg } from './EmojiOrImg'
import { useT } from '../i18n'

const TIPE_ORDER: RewardTipe[] = ['harian', 'mingguan', 'bulanan']

type Props = {
  data: AppData
  childId: string
  setData: (d: AppData) => void
}

export function HadiahSection({ data, childId, setData }: Props) {
  const t = useT()
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
      <h3 className="dash-section-title hadiah-title">{t('rewardsTitle')}</h3>
      {!tugasSelesai && (
        <div className="hadiah-gate">{t('rewardsGate')}</div>
      )}
      <div className="hadiah-progress-grid">
        {TIPE_ORDER.map((tipe) => {
          const poin = poinDalamPeriode(data, childId, tipe, now)
          const max =
            rewards
              .filter((r) => r.tipe === tipe)
              .reduce((m, r) => Math.max(m, r.harga), 0) || 0
          const pct = max > 0 ? Math.min(100, (poin / max) * 100) : 0
          return (
            <div key={tipe} className={`hadiah-progress hadiah-${tipe}`}>
              <div className="hadiah-progress-head">
                <span>
                  {REWARD_TIPE_ICON[tipe]} {t(REWARD_TIPE_DICT_KEY[tipe])}
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
        {TIPE_ORDER.map((tipe) => {
          const list = rewards
            .filter((r) => r.tipe === tipe)
            .slice()
            .sort((a, b) => a.harga - b.harga)
          if (list.length === 0) return null
          const poin = poinDalamPeriode(data, childId, tipe, now)
          const aktif = claimAktif(tipe)
          return (
            <div key={tipe} className="hadiah-grup">
              <div className="hadiah-grup-title">
                {REWARD_TIPE_ICON[tipe]} {t(REWARD_TIPE_DICT_KEY[tipe])}
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
                    <span className="hadiah-ikon">
                      <EmojiOrImg value={r.ikon} imgSize={36} imgRadius={10} />
                    </span>
                    <div className="hadiah-main">
                      <div className="hadiah-judul">{r.judul}</div>
                      <div className="hadiah-meta">
                        {r.harga} {t('pointsShort')}
                      </div>
                      {claimedThis?.status === 'menunggu' && (
                        <div className="status-text menunggu">
                          {t('rewardWaiting')}
                        </div>
                      )}
                      {claimedThis?.status === 'disetujui' && (
                        <div className="status-text disetujui">
                          {t('rewardApproved')}
                        </div>
                      )}
                      {claimedThis?.status === 'diberikan' && (
                        <div className="status-text disetujui">
                          {t('rewardGiven')}
                        </div>
                      )}
                      {!claimedThis && lockedByOther && (
                        <div className="status-text locked">
                          {t('rewardLockedOther')}
                        </div>
                      )}
                      {!claimedThis &&
                        !lockedByOther &&
                        !eligible && (
                          <div className="status-text locked">
                            {t('rewardLockedNeed', { poin: r.harga - poin })}
                          </div>
                        )}
                      {!claimedThis &&
                        !lockedByOther &&
                        eligible &&
                        !tugasSelesai && (
                          <div className="status-text locked">
                            {t('rewardLockedToday')}
                          </div>
                        )}
                    </div>
                    {dapatDiklaim && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => claimReward(r)}
                      >
                        {t('rewardClaim')}
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
