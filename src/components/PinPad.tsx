type Props = {
  value: string
  onChange: (v: string) => void
  maxLength?: number
}

export function PinPad({ value, onChange, maxLength = 4 }: Props) {
  const press = (k: string) => {
    if (k === 'del') {
      onChange(value.slice(0, -1))
      return
    }
    if (value.length >= maxLength) return
    onChange(value + k)
  }

  return (
    <>
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
    </>
  )
}
