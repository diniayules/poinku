import { useState } from 'react'
import type { AppData, Reward, RewardTipe } from '../../types'
import {
  REWARD_TIPE_ICON,
  REWARD_TIPE_LABEL,
  uid,
} from '../../storage'
import { REWARD_ICONS } from '../../constants'
import { EmojiOrImg } from '../../components/EmojiOrImg'

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
  const [childId, setChildId] = useState<string>(
    data.children[0]?.id ?? '',
  )
  const [editId, setEditId] = useState<string | null>(null)
  const [judul, setJudul] = useState('')
  const [harga, setHarga] = useState(50)
  const [ikon, setIkon] = useState(REWARD_ICONS[0])
  const [tipe, setTipe] = useState<RewardTipe>('harian')
  const [showSuggest, setShowSuggest] = useState(false)

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

  function hapus(id: string) {
    if (!confirm('Hapus hadiah ini?')) return
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
          {editId ? 'Ubah Hadiah' : 'Tambah Hadiah'}
        </div>
        <div className="suggest-wrap">
          <input
            className="input"
            placeholder="Contoh: Screen time 1 jam"
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
                    onClick={() => applyFromReward(s)}
                  >
                    <span className="suggest-ikon">{s.ikon}</span>
                    <span className="suggest-main">
                      <span className="suggest-judul">{s.judul}</span>
                      <span className="suggest-meta">
                        {ownerChild
                          ? `${ownerChild.avatar} ${ownerChild.nama} · `
                          : ''}
                        {REWARD_TIPE_ICON[s.tipe]} {REWARD_TIPE_LABEL[s.tipe]}
                        {' · '}
                        {s.harga} poin
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
            <div className="label">Harga (poin)</div>
            <input
              className="input"
              type="number"
              min={1}
              value={harga}
              onChange={(e) => setHarga(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <div className="label">Tipe</div>
            <div className="select-chip-row">
              {TIPE_OPSI.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`select-chip ${tipe === t ? 'active' : ''}`}
                  onClick={() => setTipe(t)}
                >
                  {REWARD_TIPE_ICON[t]} {REWARD_TIPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="label">Ikon</div>
          <div
            className="emoji-picker"
            style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}
          >
            {REWARD_ICONS.map((i) => (
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
            disabled={!judul.trim() || !childId || harga <= 0}
            style={{
              opacity: !judul.trim() || !childId || harga <= 0 ? 0.5 : 1,
            }}
            onClick={save}
          >
            {editId ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>

      <div>
        <div className="label">Daftar hadiah</div>
        <div className="task-list">
          {rewardsForChild.length === 0 && (
            <div className="empty-state">Belum ada hadiah</div>
          )}
          {rewardsForChild.map((r) => (
            <div key={r.id} className="row">
              <span style={{ fontSize: 28 }}>{r.ikon}</span>
              <div className="main">
                <div className="title-text">{r.judul}</div>
                <div className="meta">
                  {REWARD_TIPE_ICON[r.tipe]} {REWARD_TIPE_LABEL[r.tipe]} ·{' '}
                  {r.harga} poin
                </div>
              </div>
              <div className="row-actions">
                <button className="icon-btn" onClick={() => startEdit(r)}>
                  Ubah
                </button>
                <button className="icon-btn reject" onClick={() => hapus(r.id)}>
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
