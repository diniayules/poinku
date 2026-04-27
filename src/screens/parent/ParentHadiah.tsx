import { useState } from 'react'
import type { AppData, Reward, RewardTipe } from '../../types'
import {
  REWARD_TIPE_DICT_KEY,
  REWARD_TIPE_ICON,
  uid,
} from '../../storage'
import { REWARD_ICONS } from '../../constants'
import { EmojiOrImg } from '../../components/EmojiOrImg'
import { EmojiPickerWithUpload } from '../../components/EmojiPickerWithUpload'
import { useT } from '../../i18n'
import { useDialog } from '../../components/DialogProvider'

const TIPE_OPSI: RewardTipe[] = ['harian', 'mingguan', 'bulanan']

function dedupeByJudul(rewards: Reward[]): Reward[] {
  const seen = new Set<string>()
  const out: Reward[] = []
  for (const r of rewards) {
    const key = r.judul.toLowerCase().trim()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(r)
  }
  return out
}

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentHadiah({ data, setData }: Props) {
  const t = useT()
  const dialog = useDialog()
  const [childId, setChildId] = useState<string>(
    data.children[0]?.id ?? '',
  )
  const [editId, setEditId] = useState<string | null>(null)
  const [judul, setJudul] = useState('')
  const [harga, setHarga] = useState(50)
  const [ikon, setIkon] = useState(REWARD_ICONS[0])
  const [tipe, setTipe] = useState<RewardTipe>('harian')
  const [showSuggest, setShowSuggest] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggleSelect(id: string) {
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function exitSelect() {
    setSelectMode(false)
    setSelected(new Set())
  }

  async function bulkDelete() {
    if (selected.size === 0) return
    const ok = await dialog.confirm({
      title: t('dialogConfirmTitle'),
      message: t('confirmBulkDelete', { n: selected.size }),
      emoji: '🗑️',
      variant: 'danger',
      confirmText: t('delete'),
      cancelText: t('cancel'),
    })
    if (!ok) return
    setData({
      ...data,
      rewards: data.rewards.filter((r) => !selected.has(r.id)),
    })
    if (editId && selected.has(editId)) resetForm()
    exitSelect()
  }

  const suggestions =
    !editId && judul.trim().length >= 2
      ? dedupeByJudul(
          data.rewards.filter(
            (r) =>
              r.childId !== childId &&
              r.judul.toLowerCase().includes(judul.trim().toLowerCase()) &&
              r.judul.toLowerCase() !== judul.trim().toLowerCase(),
          ),
        ).slice(0, 5)
      : []

  function applyFromReward(r: Reward) {
    setJudul(r.judul)
    setHarga(r.harga)
    setIkon(r.ikon)
    setTipe(r.tipe)
    setShowSuggest(false)
  }

  function resetForm() {
    setEditId(null)
    setJudul('')
    setHarga(50)
    setIkon(REWARD_ICONS[0])
    setTipe('harian')
  }

  function startEdit(r: Reward) {
    setEditId(r.id)
    setJudul(r.judul)
    setHarga(r.harga)
    setIkon(r.ikon)
    setTipe(r.tipe)
    setChildId(r.childId)
  }

  function save() {
    if (!judul.trim() || !childId || harga <= 0) return
    if (editId) {
      setData({
        ...data,
        rewards: data.rewards.map((r) =>
          r.id === editId
            ? { ...r, judul: judul.trim(), harga, ikon, tipe, childId }
            : r,
        ),
      })
    } else {
      const reward: Reward = {
        id: uid(),
        childId,
        judul: judul.trim(),
        harga,
        ikon,
        tipe,
      }
      setData({ ...data, rewards: [...data.rewards, reward] })
    }
    resetForm()
  }

  async function hapus(id: string) {
    const ok = await dialog.confirm({
      title: t('dialogConfirmTitle'),
      message: t('confirmDeleteReward'),
      emoji: '🗑️',
      variant: 'danger',
      confirmText: t('delete'),
      cancelText: t('cancel'),
    })
    if (!ok) return
    setData({
      ...data,
      rewards: data.rewards.filter((r) => r.id !== id),
    })
    if (editId === id) resetForm()
  }

  const rewardsForChild = data.rewards
    .filter((r) => r.childId === childId)
    .slice()
    .sort((a, b) => {
      const order: RewardTipe[] = ['harian', 'mingguan', 'bulanan']
      const da = order.indexOf(a.tipe) - order.indexOf(b.tipe)
      if (da !== 0) return da
      return a.harga - b.harga
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
          {editId ? t('editRewardTitle') : t('addRewardTitle')}
        </div>
        <div className="suggest-wrap">
          <input
            className="input"
            placeholder={t('rewardJudulPlaceholder')}
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
                    onClick={() => applyFromReward(s)}
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
                        {REWARD_TIPE_ICON[s.tipe]}{' '}
                        {t(REWARD_TIPE_DICT_KEY[s.tipe])}
                        {' · '}
                        {s.harga} {t('pointsShort')}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="form-row">
          <div>
            <div className="label">{t('rewardHarga')}</div>
            <input
              className="input"
              type="number"
              min={1}
              value={harga}
              onChange={(e) => setHarga(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <div className="label">{t('rewardTipe')}</div>
            <div className="select-chip-row">
              {TIPE_OPSI.map((tp) => (
                <button
                  key={tp}
                  type="button"
                  className={`select-chip ${tipe === tp ? 'active' : ''}`}
                  onClick={() => setTipe(tp)}
                >
                  {REWARD_TIPE_ICON[tp]} {t(REWARD_TIPE_DICT_KEY[tp])}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="label">{t('taskIkon')}</div>
          <EmojiPickerWithUpload
            emojis={REWARD_ICONS}
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
            disabled={!judul.trim() || !childId || harga <= 0}
            style={{
              opacity: !judul.trim() || !childId || harga <= 0 ? 0.5 : 1,
            }}
            onClick={save}
          >
            {editId ? t('save') : t('add')}
          </button>
        </div>
      </div>

      <div>
        {(() => {
          const allIds = rewardsForChild.map((r) => r.id)
          const allSelected =
            allIds.length > 0 && allIds.every((id) => selected.has(id))
          return (
            <>
              <div className="list-toolbar">
                <div className="label" style={{ margin: 0 }}>
                  {t('rewardListLabel')}
                </div>
                {!selectMode && rewardsForChild.length > 0 && (
                  <button
                    className="select-btn"
                    onClick={() => setSelectMode(true)}
                  >
                    {t('selectMode')}
                  </button>
                )}
              </div>

              {selectMode && (
                <div className="select-toolbar">
                  <span className="select-count">
                    {t('selectedN', { n: selected.size })}
                  </span>
                  <button
                    className="select-btn"
                    onClick={() =>
                      setSelected(allSelected ? new Set() : new Set(allIds))
                    }
                  >
                    {allSelected ? t('unselectAll') : t('selectAll')}
                  </button>
                  <span className="spacer" />
                  <button
                    className="icon-btn reject"
                    disabled={selected.size === 0}
                    style={{ opacity: selected.size === 0 ? 0.5 : 1 }}
                    onClick={bulkDelete}
                  >
                    🗑️ {t('delete')}
                  </button>
                  <button className="icon-btn" onClick={exitSelect}>
                    {t('exitSelect')}
                  </button>
                </div>
              )}

              <div className="task-list">
                {rewardsForChild.length === 0 && (
                  <div className="empty-state">{t('noRewards')}</div>
                )}
                {rewardsForChild.map((r) => {
                  const isSel = selected.has(r.id)
                  return (
                    <div
                      key={r.id}
                      className={`row ${selectMode ? 'selectable' : ''} ${
                        isSel ? 'selected' : ''
                      }`}
                      onClick={
                        selectMode ? () => toggleSelect(r.id) : undefined
                      }
                    >
                      {selectMode && (
                        <span
                          className={`row-check ${isSel ? 'checked' : ''}`}
                          aria-hidden="true"
                        >
                          {isSel && <span className="check">✓</span>}
                        </span>
                      )}
                      <span style={{ fontSize: 28 }}>
                        <EmojiOrImg
                          value={r.ikon}
                          imgSize={36}
                          imgRadius={10}
                        />
                      </span>
                      <div className="main">
                        <div className="title-text">{r.judul}</div>
                        <div className="meta">
                          {REWARD_TIPE_ICON[r.tipe]}{' '}
                          {t(REWARD_TIPE_DICT_KEY[r.tipe])} · {r.harga}{' '}
                          {t('pointsShort')}
                        </div>
                      </div>
                      {!selectMode && (
                        <div className="row-actions">
                          <button
                            className="icon-btn"
                            onClick={() => startEdit(r)}
                          >
                            {t('edit')}
                          </button>
                          <button
                            className="icon-btn reject"
                            onClick={() => hapus(r.id)}
                          >
                            {t('delete')}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
