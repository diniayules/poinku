import { useEffect, useState } from 'react'
import { hashPin } from '../storage'
import { PinPad } from '../components/PinPad'
import { useT } from '../i18n'

type Props = {
  pinHash: string
  onSuccess: () => void
  onCancel: () => void
}

export function PinGate({ pinHash, onSuccess, onCancel }: Props) {
  const t = useT()
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
        setErr(t('pinWrong'))
        setPin('')
      }
    })
    return () => {
      cancelled = true
    }
  }, [pin, pinHash, onSuccess, t])

  return (
    <div className="screen setup">
      <button className="back-btn" onClick={onCancel}>
        ← {t('cancel')}
      </button>
      <h2 className="screen-title">
        {t('enterPin')} <span className="emoji">🔒</span>
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
