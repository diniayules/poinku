import { useEffect, useState } from 'react'
import { hashPin } from '../storage'
import { PinPad } from '../components/PinPad'

type Props = {
  pinHash: string
  onSuccess: () => void
  onCancel: () => void
}

export function PinGate({ pinHash, onSuccess, onCancel }: Props) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    if (pin.length !== 4) return
    let cancelled = false
    hashPin(pin).then((h) => {
      if (cancelled) return
      if (h === pinHash) {
        onSuccess()
      } else {
        setErr('PIN salah. Coba lagi.')
        setPin('')
      }
    })
    return () => {
      cancelled = true
    }
  }, [pin, pinHash, onSuccess])

  return (
    <div className="screen setup">
      <button className="back-btn" onClick={onCancel}>
        ← Batal
      </button>
      <h2 className="screen-title">
        Masukkan PIN Orang Tua <span className="emoji">🔒</span>
      </h2>
      <PinPad
        value={pin}
        onChange={(v) => {
          setErr('')
          setPin(v)
        }}
      />
      <p className="pin-error">{err}</p>
    </div>
  )
}
