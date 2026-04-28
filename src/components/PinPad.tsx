import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  maxLength?: number
  active?: boolean
}

export function PinPad({
  value,
  onChange,
  maxLength = 4,
  active = true,
}: Props) {
  const press = (k: string) => {
    if (k === 'del') {
      onChange(value.slice(0, -1))
      return
    }
    if (value.length >= maxLength) return
    onChange(value + k)
  }

  useEffect(() => {
    if (!active) return
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target && target.isContentEditable)
      ) {
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        if (value.length < maxLength) onChange(value + e.key)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        onChange(value.slice(0, -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, value, maxLength, onChange])

  return (
    <div className={`pin-pad-wrap${active ? '' : ' inactive'}`}>
      <div className="pin-display">
        {Array.from({ length: maxLength }).map((_, i) => (
          <span
            key={i}
            className={`pin-dot ${i < value.length ? 'filled' : ''}`}
          />
        ))}
      </div>
      <div className="pin-pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
          <button key={k} onClick={() => press(k)} type="button">
            {k}
          </button>
        ))}
        <button className="pin-empty" type="button" tabIndex={-1} />
        <button onClick={() => press('0')} type="button">
          0
        </button>
        <button onClick={() => press('del')} type="button">
          ⌫
        </button>
      </div>
    </div>
  )
}
