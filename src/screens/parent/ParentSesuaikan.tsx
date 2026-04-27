import { useState } from 'react'
import type { AppData, Adjustment } from '../../types'
import { todayKey, uid } from '../../storage'
import { EmojiOrImg } from '../../components/EmojiOrImg'
import { useT } from '../../i18n'
import { useDialog } from '../../components/DialogProvider'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentSesuaikan({ data, setData }: Props) {
  const t = useT()
  const dialog = useDialog()
  const [childId, setChildId] = useState<string>(data.children[0]?.id ?? '')
  const [tipe, setTipe] = useState<'plus' | 'minus'>('plus')
  const [jumlah, setJumlah] = useState(5)
  const [alasan, setAlasan] = useState('')
  const [pesan, setPesan] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

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
        ? t('addedToChild', { n: jumlah })
        : t('subtractedFromChild', { n: jumlah }),
    )
    setTimeout(() => setPesan(''), 2500)
  }

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
      message: t('confirmBulkDeleteAdjustment', { n: selected.size }),
      emoji: '🗑️',
      variant: 'danger',
      confirmText: t('delete'),
      cancelText: t('cancel'),
    })
    if (!ok) return
    const deltaByChild: Record<string, number> = {}
    for (const a of data.adjustments) {
      if (selected.has(a.id)) {
        deltaByChild[a.childId] = (deltaByChild[a.childId] || 0) + a.poin
      }
    }
    const children = data.children.map((c) =>
      deltaByChild[c.id]
        ? { ...c, totalPoin: c.totalPoin - deltaByChild[c.id] }
        : c,
    )
    setData({
      ...data,
      adjustments: data.adjustments.filter((a) => !selected.has(a.id)),
      children,
    })
    exitSelect()
  }

  async function hapusAdjustment(id: string) {
    const adj = data.adjustments.find((a) => a.id === id)
    if (!adj) return
    const ok = await dialog.confirm({
      title: t('dialogConfirmTitle'),
      message: t('confirmDeleteAdjustment'),
      emoji: '🗑️',
      variant: 'danger',
      confirmText: t('delete'),
      cancelText: t('cancel'),
    })
    if (!ok) return
    const children = data.children.map((c) =>
      c.id === adj.childId
        ? { ...c, totalPoin: c.totalPoin - adj.poin }
        : c,
    )
    setData({
      ...data,
      adjustments: data.adjustments.filter((a) => a.id !== id),
      children,
    })
  }

  const child = data.children.find((c) => c.id === childId)

  return (
    <div className="screen" style={{ gap: 16 }}>
      <div>
        <div className="label">{t('forChild')}</div>
        <div className="select-chip-row">
          {data.children.map((c) => (
            <button
              key={c.id}
              className={`select-chip ${childId === c.id ? 'active' : ''}`}
              onClick={() => setChildId(c.id)}
            >
              <EmojiOrImg value={c.avatar} imgSize={20} /> {c.nama}{' '}
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
            {t('addPoints')}
          </button>
          <button
            className={`${tipe === 'minus' ? 'active minus' : ''}`}
            onClick={() => setTipe('minus')}
          >
            {t('subtractPoints')}
          </button>
        </div>

        <div>
          <div className="label">{t('pointAmount')}</div>
          <input
            className="input"
            type="number"
            min={1}
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value) || 0)}
          />
        </div>

        <div>
          <div className="label">{t('reason')}</div>
          <input
            className="input"
            placeholder={
              tipe === 'plus'
                ? t('reasonPlaceholderPlus')
                : t('reasonPlaceholderMinus')
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
            ? t('addPointsTo', { n: jumlah, nama: child?.nama ?? '' })
            : t('subtractPointsFrom', { n: jumlah, nama: child?.nama ?? '' })}
        </button>

        {pesan && (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
            {pesan}
          </p>
        )}
      </div>

      <div>
        {(() => {
          const items = data.adjustments
            .filter((a) => a.childId === childId)
            .slice()
            .reverse()
            .slice(0, 10)
          const allIds = items.map((a) => a.id)
          const allSelected =
            allIds.length > 0 && allIds.every((id) => selected.has(id))
          return (
            <>
              <div className="list-toolbar">
                <div className="label" style={{ margin: 0 }}>
                  {t('recentAdjustments')}
                </div>
                {!selectMode && items.length > 0 && (
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
                {items.map((a) => {
                  const isSel = selected.has(a.id)
                  return (
                    <div
                      key={a.id}
                      className={`row ${selectMode ? 'selectable' : ''} ${
                        isSel ? 'selected' : ''
                      }`}
                      onClick={
                        selectMode ? () => toggleSelect(a.id) : undefined
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
                      <span
                        className="avatar"
                        style={{
                          color:
                            a.poin > 0
                              ? 'var(--success)'
                              : 'var(--danger)',
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
                          color:
                            a.poin > 0
                              ? 'var(--success)'
                              : 'var(--danger)',
                          background:
                            a.poin > 0
                              ? 'rgba(107,255,158,0.15)'
                              : 'rgba(255,107,138,0.15)',
                        }}
                      >
                        {a.poin > 0 ? `+${a.poin}` : a.poin}
                      </span>
                      {!selectMode && (
                        <button
                          className="icon-btn reject"
                          onClick={() => hapusAdjustment(a.id)}
                          aria-label={t('delete')}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  )
                })}
                {items.length === 0 && (
                  <div className="empty-state">{t('noAdjustments')}</div>
                )}
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
