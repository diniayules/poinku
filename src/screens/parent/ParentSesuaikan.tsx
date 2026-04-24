import { useState } from 'react'
import type { AppData, Adjustment } from '../../types'
import { todayKey, uid } from '../../storage'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentSesuaikan({ data, setData }: Props) {
  const [childId, setChildId] = useState<string>(data.children[0]?.id ?? '')
  const [tipe, setTipe] = useState<'plus' | 'minus'>('plus')
  const [jumlah, setJumlah] = useState(5)
  const [alasan, setAlasan] = useState('')
  const [pesan, setPesan] = useState('')

  function simpan() {
    if (!childId || jumlah <= 0 || !alasan.trim()) return
    const delta = tipe === 'plus' ? jumlah : -jumlah
    const adj: Adjustment = {
      id: uid(),
      childId,
      tanggal: todayKey(),
      poin: delta,
      alasan: alasan.trim(),
    }
    const children = data.children.map((c) =>
      c.id === childId ? { ...c, totalPoin: c.totalPoin + delta } : c,
    )
    setData({
      ...data,
      adjustments: [...data.adjustments, adj],
      children,
    })
    setAlasan('')
    setJumlah(5)
    setPesan(
      tipe === 'plus'
        ? `✨ +${jumlah} poin ditambahkan`
        : `⚠️ -${jumlah} poin dikurangi`,
    )
    setTimeout(() => setPesan(''), 2500)
  }

  const child = data.children.find((c) => c.id === childId)

  return (
    <div className="screen" style={{ gap: 16 }}>
      <div>
        <div className="label">Untuk anak</div>
        <div className="select-chip-row">
          {data.children.map((c) => (
            <button
              key={c.id}
              className={`select-chip ${childId === c.id ? 'active' : ''}`}
              onClick={() => setChildId(c.id)}
            >
              {c.avatar} {c.nama}{' '}
              <span style={{ opacity: 0.7 }}>⭐{c.totalPoin}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card form">
        <div className="adjust-toggle">
          <button
            className={`${tipe === 'plus' ? 'active plus' : ''}`}
            onClick={() => setTipe('plus')}
          >
            + Tambah Poin
          </button>
          <button
            className={`${tipe === 'minus' ? 'active minus' : ''}`}
            onClick={() => setTipe('minus')}
          >
            − Kurangi Poin
          </button>
        </div>

        <div>
          <div className="label">Jumlah poin</div>
          <input
            className="input"
            type="number"
            min={1}
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value) || 0)}
          />
        </div>

        <div>
          <div className="label">Alasan</div>
          <input
            className="input"
            placeholder={
              tipe === 'plus'
                ? 'Contoh: Bantu cuci piring'
                : 'Contoh: Telat tidur'
            }
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
          />
        </div>

        <button
          className={`btn ${tipe === 'minus' ? 'btn-danger' : 'btn-success'}`}
          disabled={!childId || jumlah <= 0 || !alasan.trim()}
          style={{
            opacity: !childId || jumlah <= 0 || !alasan.trim() ? 0.5 : 1,
          }}
          onClick={simpan}
        >
          {tipe === 'plus'
            ? `Tambah +${jumlah} ke ${child?.nama ?? ''}`
            : `Kurangi -${jumlah} dari ${child?.nama ?? ''}`}
        </button>

        {pesan && (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
            {pesan}
          </p>
        )}
      </div>

      <div>
        <div className="label">Riwayat penyesuaian (terbaru)</div>
        <div className="task-list">
          {data.adjustments
            .filter((a) => a.childId === childId)
            .slice()
            .reverse()
            .slice(0, 10)
            .map((a) => (
              <div key={a.id} className="row">
                <span
                  className="avatar"
                  style={{
                    color: a.poin > 0 ? 'var(--success)' : 'var(--danger)',
                    fontSize: 22,
                  }}
                >
                  {a.poin > 0 ? '＋' : '−'}
                </span>
                <div className="main">
                  <div className="title-text">{a.alasan}</div>
                  <div className="meta">{a.tanggal}</div>
                </div>
                <span
                  className="poin-badge"
                  style={{
                    color: a.poin > 0 ? 'var(--success)' : 'var(--danger)',
                    background:
                      a.poin > 0
                        ? 'rgba(107,255,158,0.15)'
                        : 'rgba(255,107,138,0.15)',
                  }}
                >
                  {a.poin > 0 ? `+${a.poin}` : a.poin}
                </span>
              </div>
            ))}
          {data.adjustments.filter((a) => a.childId === childId).length ===
            0 && <div className="empty-state">Belum ada penyesuaian</div>}
        </div>
      </div>
    </div>
  )
}
