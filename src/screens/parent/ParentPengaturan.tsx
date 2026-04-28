import { useRef, useState } from 'react'
import type { AppData, Bahasa, Child, Tema } from '../../types'
import { hashPin, uid } from '../../storage'
import { AVATAR_EMOJIS } from '../../constants'
import { PinPad } from '../../components/PinPad'
import { EmojiPickerWithUpload } from '../../components/EmojiPickerWithUpload'
import { EmojiOrImg } from '../../components/EmojiOrImg'
import { TEMA_FLOATERS, TEMA_IKON, TEMA_OPSI } from '../../storage'
import { LANG_FLAG, LANG_LABEL, LANG_OPSI, useT } from '../../i18n'
import type { DictKey } from '../../i18n/dict'
import { exportData, importData } from '../../lib/backup'
import { useDialog } from '../../components/DialogProvider'

const TEMA_LABEL_KEY: Record<Tema, DictKey> = {
  'luar-angkasa': 'temaLuarAngkasa',
  hutan: 'temaHutan',
  'bawah-laut': 'temaBawahLaut',
  permen: 'temaPermen',
  ceria: 'temaCeria',
  spongebob: 'temaSpongebob',
}

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentPengaturan({ data, setData }: Props) {
  const t = useT()
  const dialog = useDialog()
  const [formMode, setFormMode] = useState<'closed' | 'add' | 'edit'>(
    'closed',
  )
  const [editId, setEditId] = useState<string | null>(null)
  const [nama, setNama] = useState('')
  const [avatar, setAvatar] = useState(AVATAR_EMOJIS[0])

  const [pinOpen, setPinOpen] = useState(false)
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [pinErr, setPinErr] = useState('')

  function bukaAdd() {
    setFormMode('add')
    setEditId(null)
    setNama('')
    setAvatar(AVATAR_EMOJIS[0])
  }

  function bukaEdit(c: Child) {
    setFormMode('edit')
    setEditId(c.id)
    setNama(c.nama)
    setAvatar(c.avatar)
  }

  function tutupForm() {
    setFormMode('closed')
    setEditId(null)
    setNama('')
    setAvatar(AVATAR_EMOJIS[0])
  }

  function simpanAnak() {
    if (!nama.trim()) return
    if (formMode === 'edit' && editId) {
      setData({
        ...data,
        children: data.children.map((c) =>
          c.id === editId ? { ...c, nama: nama.trim(), avatar } : c,
        ),
      })
    } else {
      const child: Child = {
        id: uid(),
        nama: nama.trim(),
        avatar,
        totalPoin: 0,
      }
      setData({ ...data, children: [...data.children, child] })
    }
    tutupForm()
  }

  async function hapusAnak(id: string) {
    const ch = data.children.find((c) => c.id === id)
    if (!ch) return
    const ok = await dialog.confirm({
      title: t('dialogConfirmTitle'),
      message: t('confirmDeleteChild', { nama: ch.nama }),
      emoji: '🗑️',
      variant: 'danger',
      confirmText: t('delete'),
      cancelText: t('cancel'),
    })
    if (!ok) return
    setData({
      ...data,
      children: data.children.filter((c) => c.id !== id),
      tasks: data.tasks.filter((t2) => t2.childId !== id),
      completions: data.completions.filter((c) => c.childId !== id),
      adjustments: data.adjustments.filter((a) => a.childId !== id),
      proposals: data.proposals.filter((p) => p.childId !== id),
      rewards: data.rewards.filter((r) => r.childId !== id),
      rewardClaims: data.rewardClaims.filter((rc) => rc.childId !== id),
    })
  }

  async function simpanPin() {
    if (pin1.length !== 4 || pin2.length !== 4) return
    if (pin1 !== pin2) {
      setPinErr(t('pinMismatch'))
      return
    }
    const pinHash = await hashPin(pin1)
    setData({ ...data, pinHash })
    setPin1('')
    setPin2('')
    setPinErr('')
    setPinOpen(false)
    await dialog.alert({
      title: t('dialogSuccessTitle'),
      message: t('pinChanged'),
      emoji: '🔐',
      variant: 'success',
      confirmText: t('ok'),
    })
  }

  function pilihTema(tema: Tema) {
    setData({ ...data, tema })
  }

  function pilihBahasa(bahasa: Bahasa) {
    setData({ ...data, bahasa })
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const ok = await dialog.confirm({
      title: t('dialogConfirmTitle'),
      message: t('restoreConfirm'),
      emoji: '📥',
      variant: 'info',
      confirmText: t('restoreBtn'),
      cancelText: t('cancel'),
    })
    if (!ok) return
    try {
      const restored = await importData(file)
      setData(restored)
      await dialog.alert({
        title: t('dialogSuccessTitle'),
        message: t('restoreDone'),
        emoji: '✅',
        variant: 'success',
        confirmText: t('ok'),
      })
    } catch {
      await dialog.alert({
        title: t('dialogErrorTitle'),
        message: t('restoreInvalid'),
        emoji: '⚠️',
        variant: 'danger',
        confirmText: t('ok'),
      })
    }
  }

  return (
    <div className="screen" style={{ gap: 16 }}>
      <div>
        <div className="label">{t('languageLabel')}</div>
        <div className="select-chip-row">
          {LANG_OPSI.map((b) => (
            <button
              key={b}
              type="button"
              className={`select-chip ${data.bahasa === b ? 'active' : ''}`}
              onClick={() => pilihBahasa(b)}
            >
              {LANG_FLAG[b]} {LANG_LABEL[b]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label">{t('themeLabel')}</div>
        <div className="tema-grid">
          {TEMA_OPSI.map((tema) => (
            <button
              key={tema}
              type="button"
              className={`tema-card tema-${tema} ${
                data.tema === tema ? 'active' : ''
              }`}
              onClick={() => pilihTema(tema)}
            >
              <span className="tema-ikon">{TEMA_IKON[tema]}</span>
              <span className="tema-nama">{t(TEMA_LABEL_KEY[tema])}</span>
              <span className="tema-floaters">
                {TEMA_FLOATERS[tema].slice(0, 4).join(' ')}
              </span>
              {data.tema === tema && (
                <span className="tema-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label">{t('childrenLabel')}</div>
        <div className="task-list">
          {data.children.map((c) => (
            <div key={c.id} className="row">
              <span className="avatar" style={{ fontSize: 28 }}>
                <EmojiOrImg value={c.avatar} imgSize={36} />
              </span>
              <div className="main">
                <div className="title-text">{c.nama}</div>
                <div className="meta">
                  ⭐ {c.totalPoin} {t('pointsShort')}
                </div>
              </div>
              <div className="row-actions">
                <button className="icon-btn" onClick={() => bukaEdit(c)}>
                  {t('edit')}
                </button>
                <button
                  className="icon-btn reject"
                  onClick={() => hapusAnak(c.id)}
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
        {formMode === 'closed' ? (
          <button
            className="btn"
            style={{ marginTop: 12 }}
            onClick={bukaAdd}
          >
            {t('addChild')}
          </button>
        ) : (
          <div className="card form" style={{ marginTop: 12 }}>
            <div className="label">
              {formMode === 'edit'
                ? t('editChildTitle')
                : t('addChildTitle')}
            </div>
            <input
              className="input"
              placeholder={t('fieldName')}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <div>
              <div className="label">{t('fieldAvatar')}</div>
              <EmojiPickerWithUpload
                emojis={AVATAR_EMOJIS}
                value={avatar}
                onChange={setAvatar}
              />
            </div>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={tutupForm}>
                {t('cancel')}
              </button>
              <button
                className="btn"
                disabled={!nama.trim()}
                style={{ opacity: !nama.trim() ? 0.5 : 1 }}
                onClick={simpanAnak}
              >
                {t('save')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="label">{t('backupRestoreLabel')}</div>
        <p className="usul-hint" style={{ marginBottom: 10 }}>
          {t('backupHint')}
        </p>
        <div className="btn-row">
          <button
            className="btn btn-ghost"
            onClick={() => exportData(data)}
          >
            {t('backupBtn')}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            {t('restoreBtn')}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      <div>
        <div className="label">{t('pinLabel')}</div>
        {!pinOpen ? (
          <button className="btn btn-ghost" onClick={() => setPinOpen(true)}>
            {t('changePin')}
          </button>
        ) : (
          <div className="card form">
            <div className="label">{t('pinNew')}</div>
            <PinPad value={pin1} onChange={setPin1} />
            <div className="label" style={{ marginTop: 8 }}>
              {t('pinRetype')}
            </div>
            <PinPad value={pin2} onChange={setPin2} />
            <p className="pin-error">{pinErr}</p>
            <div className="btn-row">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setPin1('')
                  setPin2('')
                  setPinErr('')
                  setPinOpen(false)
                }}
              >
                {t('cancel')}
              </button>
              <button
                className="btn"
                disabled={pin1.length !== 4 || pin2.length !== 4}
                style={{
                  opacity:
                    pin1.length !== 4 || pin2.length !== 4 ? 0.5 : 1,
                }}
                onClick={simpanPin}
              >
                {t('savePin')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
