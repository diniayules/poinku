import { useState } from 'react'
import { hashPin, uid } from '../storage'
import type { AppData } from '../types'
import { AVATAR_EMOJIS } from '../constants'
import { PinPad } from '../components/PinPad'

type Props = {
  data: AppData
  onFinish: (data: AppData) => void
}

type Step = 'welcome' | 'pin' | 'pin-confirm' | 'child'

export function Setup({ data, onFinish }: Props) {
  const [step, setStep] = useState<Step>('welcome')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [pinErr, setPinErr] = useState('')
  const [nama, setNama] = useState('')
  const [avatar, setAvatar] = useState(AVATAR_EMOJIS[0])

  async function handleFinish() {
    if (!nama.trim()) return
    const pinHash = await hashPin(pin)
    const next: AppData = {
      ...data,
      pinHash,
      children: [
        ...data.children,
        {
          id: uid(),
          nama: nama.trim(),
          avatar,
          totalPoin: 0,
        },
      ],
    }
    onFinish(next)
  }

  if (step === 'welcome') {
    return (
      <div className="screen setup">
        <h1 className="screen-title">
          Halo, Kapten! <span className="emoji">🚀</span>
        </h1>
        <p className="screen-subtitle">
          Selamat datang di Petualangan Poin. Ayo kita siapkan akunnya dulu.
        </p>
        <button className="btn" onClick={() => setStep('pin')}>
          Mulai Petualangan
        </button>
      </div>
    )
  }

  if (step === 'pin') {
    return (
      <div className="screen setup">
        <h2 className="screen-title">Buat PIN Orang Tua</h2>
        <p className="screen-subtitle">
          PIN 4 digit untuk orang tua (untuk konfirmasi tugas & atur poin).
        </p>
        <PinPad value={pin} onChange={setPin} />
        <button
          className="btn"
          disabled={pin.length !== 4}
          style={{ opacity: pin.length !== 4 ? 0.5 : 1 }}
          onClick={() => {
            setPinConfirm('')
            setPinErr('')
            setStep('pin-confirm')
          }}
        >
          Lanjut
        </button>
      </div>
    )
  }

  if (step === 'pin-confirm') {
    return (
      <div className="screen setup">
        <h2 className="screen-title">Ketik Ulang PIN</h2>
        <p className="screen-subtitle">Pastikan tidak salah ketik.</p>
        <PinPad value={pinConfirm} onChange={setPinConfirm} />
        <p className="pin-error">{pinErr}</p>
        <div className="btn-row">
          <button
            className="btn btn-ghost"
            onClick={() => {
              setPin('')
              setPinConfirm('')
              setPinErr('')
              setStep('pin')
            }}
          >
            Ganti PIN
          </button>
          <button
            className="btn"
            disabled={pinConfirm.length !== 4}
            style={{ opacity: pinConfirm.length !== 4 ? 0.5 : 1 }}
            onClick={() => {
              if (pin !== pinConfirm) {
                setPinErr('PIN tidak sama. Coba lagi.')
                setPinConfirm('')
                return
              }
              setStep('child')
            }}
          >
            Lanjut
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen setup">
      <h2 className="screen-title">Tambah Anak Pertama</h2>
      <p className="screen-subtitle">
        Siapa astronot pertama kita?
      </p>
      <div>
        <div className="label">Nama</div>
        <input
          className="input"
          placeholder="Contoh: Adik"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          autoFocus
        />
      </div>
      <div>
        <div className="label">Avatar</div>
        <div className="emoji-picker">
          {AVATAR_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              className={avatar === e ? 'active' : ''}
              onClick={() => setAvatar(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <button
        className="btn"
        disabled={!nama.trim()}
        style={{ opacity: !nama.trim() ? 0.5 : 1 }}
        onClick={handleFinish}
      >
        Selesai — Mulai Main!
      </button>
    </div>
  )
}
