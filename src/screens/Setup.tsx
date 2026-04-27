import { useState } from 'react'
import { hashPin, uid } from '../storage'
import type { AppData } from '../types'
import { AVATAR_EMOJIS } from '../constants'
import { PinPad } from '../components/PinPad'
import { EmojiPickerWithUpload } from '../components/EmojiPickerWithUpload'
import { useT } from '../i18n'

type Props = {
  data: AppData
  onFinish: (data: AppData) => void
}

type Step = 'welcome' | 'pin' | 'pin-confirm' | 'child'

export function Setup({ data, onFinish }: Props) {
  const t = useT()
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
          {t('setupWelcomeTitle')} <span className="emoji">🚀</span>
        </h1>
        <p className="screen-subtitle">{t('setupWelcomeSub')}</p>
        <button className="btn" onClick={() => setStep('pin')}>
          {t('setupStart')}
        </button>
      </div>
    )
  }

  if (step === 'pin') {
    return (
      <div className="screen setup">
        <h2 className="screen-title">{t('setupCreatePinTitle')}</h2>
        <p className="screen-subtitle">{t('setupCreatePinSub')}</p>
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
          {t('next')}
        </button>
      </div>
    )
  }

  if (step === 'pin-confirm') {
    return (
      <div className="screen setup">
        <h2 className="screen-title">{t('setupRetypePinTitle')}</h2>
        <p className="screen-subtitle">{t('setupRetypePinSub')}</p>
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
            {t('changePin')}
          </button>
          <button
            className="btn"
            disabled={pinConfirm.length !== 4}
            style={{ opacity: pinConfirm.length !== 4 ? 0.5 : 1 }}
            onClick={() => {
              if (pin !== pinConfirm) {
                setPinErr(t('pinMismatch'))
                setPinConfirm('')
                return
              }
              setStep('child')
            }}
          >
            {t('next')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen setup">
      <h2 className="screen-title">{t('setupAddFirstTitle')}</h2>
      <p className="screen-subtitle">{t('setupAddFirstSub')}</p>
      <div>
        <div className="label">{t('fieldName')}</div>
        <input
          className="input"
          placeholder={t('namePlaceholder')}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          autoFocus
        />
      </div>
      <div>
        <div className="label">{t('fieldAvatar')}</div>
        <EmojiPickerWithUpload
          emojis={AVATAR_EMOJIS}
          value={avatar}
          onChange={setAvatar}
        />
      </div>
      <button
        className="btn"
        disabled={!nama.trim()}
        style={{ opacity: !nama.trim() ? 0.5 : 1 }}
        onClick={handleFinish}
      >
        {t('setupFinish')}
      </button>
    </div>
  )
}
