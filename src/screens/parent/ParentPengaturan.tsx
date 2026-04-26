import { useState } from 'react'
import type { AppData, Child } from '../../types'
import { hashPin, uid } from '../../storage'
import { AVATAR_EMOJIS } from '../../constants'
import { PinPad } from '../../components/PinPad'
import { EmojiPickerWithUpload } from '../../components/EmojiPickerWithUpload'
import { EmojiOrImg } from '../../components/EmojiOrImg'
import {
  TEMA_FLOATERS,
  TEMA_IKON,
  TEMA_LABEL,
  TEMA_OPSI,
} from '../../storage'
import type { Tema } from '../../types'

type Props = {
  data: AppData
  setData: (d: AppData) => void
}

export function ParentPengaturan({ data, setData }: Props) {
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

  function hapusAnak(id: string) {
    const ch = data.children.find((c) => c.id === id)
    if (!ch) return
    if (
      !confirm(
        `Hapus ${ch.nama}? Semua tugas, konfirmasi, dan riwayat poinnya juga ikut terhapus.`,
      )
    )
      return
    setData({
      ...data,
      children: data.children.filter((c) => c.id !== id),
      tasks: data.tasks.filter((t) => t.childId !== id),
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
      setPinErr('PIN tidak sama')
      return
    }
    const pinHash = await hashPin(pin1)
    setData({ ...data, pinHash })
    setPin1('')
    setPin2('')
    setPinErr('')
    setPinOpen(false)
    alert('PIN berhasil diubah ✅')
  }

  function pilihTema(t: Tema) {
    setData({ ...data, tema: t })
  }

  return (
    <div className="screen" style={{ gap: 16 }}>
      <div>
        <div className="label">Tema</div>
        <div className="tema-grid">
          {TEMA_OPSI.map((t) => (
            <button
              key={t}
              type="button"
              className={`tema-card tema-${t} ${
                data.tema === t ? 'active' : ''
              }`}
              onClick={() => pilihTema(t)}
            >
              <span className="tema-ikon">{TEMA_IKON[t]}</span>
              <span className="tema-nama">{TEMA_LABEL[t]}</span>
              <span className="tema-floaters">
                {TEMA_FLOATERS[t].slice(0, 4).join(' ')}
              </span>
              {data.tema === t && (
                <span className="tema-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label">Anak</div>
        <div className="task-list">
          {data.children.map((c) => (
            <div key={c.id} className="row">
              <span className="avatar" style={{ fontSize: 28 }}>
                <EmojiOrImg value={c.avatar} imgSize={36} />
              </span>
              <div className="main">
                <div className="title-text">{c.nama}</div>
                <div className="meta">⭐ {c.totalPoin} poin</div>
              </div>
              <div className="row-actions">
                <button className="icon-btn" onClick={() => bukaEdit(c)}>
                  Ubah
                </button>
                <button
                  className="icon-btn reject"
                  onClick={() => hapusAnak(c.id)}
                >
                  Hapus
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
            + Tambah Anak
          </button>
        ) : (
          <div className="card form" style={{ marginTop: 12 }}>
            <div className="label">
              {formMode === 'edit' ? 'Ubah Profil Anak' : 'Tambah Anak Baru'}
            </div>
            <input
              className="input"
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <div>
              <div className="label">Avatar (foto atau pilih emoji)</div>
              <EmojiPickerWithUpload
                emojis={AVATAR_EMOJIS}
                value={avatar}
                onChange={setAvatar}
              />
            </div>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={tutupForm}>
                Batal
              </button>
              <button
                className="btn"
                disabled={!nama.trim()}
                style={{ opacity: !nama.trim() ? 0.5 : 1 }}
                onClick={simpanAnak}
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="label">PIN Orang Tua</div>
        {!pinOpen ? (
          <button className="btn btn-ghost" onClick={() => setPinOpen(true)}>
            Ganti PIN
          </button>
        ) : (
          <div className="card form">
            <div className="label">PIN Baru</div>
            <PinPad value={pin1} onChange={setPin1} />
            <div className="label" style={{ marginTop: 8 }}>
              Ketik Ulang
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
                Batal
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
                Simpan PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
